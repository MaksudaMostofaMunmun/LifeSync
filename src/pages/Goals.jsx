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
  updateDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Goals() {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [dueDate, setDueDate] = useState("");

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
    if (
      !goalName ||
      !target ||
      !current ||
      !dueDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "goals"), {
        name: goalName,
        target: Number(target),
        current: Number(current),
        dueDate,
        completed: false,
        userId: user.uid,
        createdAt: new Date(),
      });

      setGoalName("");
      setTarget("");
      setCurrent("");
      setDueDate("");

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

  const updateProgress = async (
    id,
    current,
    target
  ) => {
    const newValue = prompt(
      "Enter Current Progress",
      current
    );

    if (!newValue) return;

    const progress =
      (Number(newValue) / Number(target)) *
      100;

    try {
      await updateDoc(
        doc(db, "goals", id),
        {
          current: Number(newValue),
          completed: progress >= 100,
        }
      );

      loadGoals();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const activeGoals = goals.filter(
    (goal) => !goal.completed
  ).length;

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          padding: "20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
          }}
        >
          🎯 Goals Tracker
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <input
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
            style={{
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Target"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
            style={{
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Current Progress"
            value={current}
            onChange={(e) =>
              setCurrent(e.target.value)
            }
            style={{
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
            style={{
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <button
            onClick={addGoal}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Goal
          </button>
        </div>

        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "15px",
            background: "#f1f5f9",
          }}
        >
          <h3>
            Active Goals:
            {" "}
            {activeGoals}
          </h3>

          <h3>
            Total Goals:
            {" "}
            {goals.length}
          </h3>
        </div>

        {goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round(
                (goal.current /
                  goal.target) *
                  100
              )
            );

            return (
              <div
                key={goal.id}
                style={{
                  padding: "20px",
                  border:
                    "1px solid #ddd",
                  borderRadius: "15px",
                  marginBottom: "20px",
                  background:
                    "#f8fafc",
                }}
              >
                <h2>
                  {goal.completed
                    ? "✅ "
                    : "🎯 "}
                  {goal.name}
                </h2>

                <p>
                  Progress:
                  {" "}
                  {goal.current}
                  /
                  {goal.target}
                </p>

                <p>
                  Due Date:
                  {" "}
                  {goal.dueDate}
                </p>

                <div
                  style={{
                    background:
                      "#e5e7eb",
                    height: "20px",
                    borderRadius:
                      "10px",
                    overflow:
                      "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background:
                        progress >= 100
                          ? "#16a34a"
                          : "#2563eb",
                    }}
                  />
                </div>

                <p
                  style={{
                    marginTop: "10px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {progress}%
                  Completed
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap:
                      "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      updateProgress(
                        goal.id,
                        goal.current,
                        goal.target
                      )
                    }
                    style={{
                      padding:
                        "10px 15px",
                    }}
                  >
                    Update Progress
                  </button>

                  <button
                    onClick={() =>
                      deleteGoal(
                        goal.id
                      )
                    }
                    style={{
                      padding:
                        "10px 15px",
                      background:
                        "#dc2626",
                      color:
                        "white",
                      border:
                        "none",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Goals;