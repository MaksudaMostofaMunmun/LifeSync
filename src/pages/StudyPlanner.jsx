
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

import {
  requestPermission,
  scheduleReminder,
} from "../notifications";

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
  const [reminderDate, setReminderDate] =
    useState("");
  const [reminderTime, setReminderTime] =
    useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    requestPermission();
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
    if (
      !task ||
      !reminderDate ||
      !reminderTime
    ) {
      alert(
        "Please enter task, date and time"
      );
      return;
    }

    const user = auth.currentUser;

    await addDoc(
      collection(db, "studyTasks"),
      {
        task,
        completed: false,
        reminderDate,
        reminderTime,
        userId: user.uid,
        createdAt: new Date(),
      }
    );

    await scheduleReminder(
      "📚 Study Reminder",
      task,
      Date.now()
    );

    setTask("");
    setReminderDate("");
    setReminderTime("");

    loadTasks();

    alert(
      "Task saved with reminder"
    );
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
          padding: "20px",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>📚 Study Planner</h1>

        <input
          placeholder="Task Name"
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        <input
          type="date"
          value={reminderDate}
          onChange={(e) =>
            setReminderDate(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        <input
          type="time"
          value={reminderTime}
          onChange={(e) =>
            setReminderTime(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "12px",
            width: "100%",
          }}
        >
          Add Task + Reminder
        </button>

        <hr />

        <h2>Progress: {progress}%</h2>

        <p>
          Completed {completedCount} /{" "}
          {tasks.length}
        </p>

        <hr />

        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
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
                marginLeft: "10px",
                textDecoration:
                  t.completed
                    ? "line-through"
                    : "none",
              }}
            >
              {t.task}
            </span>

            <p>📅 {t.reminderDate}</p>
            <p>⏰ {t.reminderTime}</p>

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

