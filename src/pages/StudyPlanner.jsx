
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

import { auth, db } from "../firebase";

function StudyPlanner() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "studyTasks"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setTasks(data);
  };

  const addTask = async () => {
    if (!task) return;

    const user = auth.currentUser;

    await addDoc(collection(db, "studyTasks"), {
      task,
      completed: false,
      userId: user.uid,
      createdAt: new Date(),
    });

    setTask("");

    loadTasks();
  };

  const deleteTask = async (id) => {
    await deleteDoc(
      doc(db, "studyTasks", id)
    );

    loadTasks();
  };

  const toggleComplete = async (
    id,
    currentStatus
  ) => {
    await updateDoc(
      doc(db, "studyTasks", id),
      {
        completed: !currentStatus,
      }
    );

    loadTasks();
  };

  const completedCount = tasks.filter(
    (t) => t.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount / tasks.length) * 100
        );

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>📚 Study Planner</h1>

        <input
          placeholder="New Task"
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
        />

        <button
          onClick={addTask}
          style={{
            marginLeft: "10px",
          }}
        >
          Add Task
        </button>

        <hr />

        <h2>
          Progress: {progress}%
        </h2>

        <p>
          Completed: {completedCount} /
          {tasks.length}
        </p>

        <hr />

        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() =>
                toggleComplete(
                  t.id,
                  t.completed
                )
              }
            />

            <span
              style={{
                textDecoration: t.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {t.task}
            </span>

            <button
              onClick={() =>
                deleteTask(t.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyPlanner;

