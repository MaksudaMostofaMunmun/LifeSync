import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Goals() {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");

  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "goals"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setGoals(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const addGoal = async () => {
    if (!goalName || !target || !current) {
      alert("Fill all fields");
      return;
    }

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "goals"), {
        name: goalName,
        target: Number(target),
        current: Number(current),
        userId: user.uid,
        createdAt: new Date(),
      });

      setGoalName("");
      setTarget("");
      setCurrent("");

      loadGoals();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));

      loadGoals();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "30px",
        }}
      >
        <h1>🎯 Goals</h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Target"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Current"
            value={current}
            onChange={(e) =>
              setCurrent(e.target.value)
            }
          />

          <button onClick={addGoal}>
            Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round(
                (goal.current / goal.target) * 100
              )
            );

            return (
              <div
                key={goal.id}
                style={{
                  padding: "20px",
                  border: "1px solid #444",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <h3>{goal.name}</h3>

                <p>
                  {goal.current} / {goal.target}
                </p>

                <div
                  style={{
                    background: "#333",
                    height: "20px",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "#4caf50",
                    }}
                  />
                </div>

                <p
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {progress}% Completed
                </p>

                <button
                  onClick={() =>
                    deleteGoal(goal.id)
                  }
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Goals;