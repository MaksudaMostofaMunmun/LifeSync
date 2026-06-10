import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Dashboard() {
  const [bazaarCount, setBazaarCount] =
    useState(0);

  const [studyCompleted, setStudyCompleted] =
    useState(0);

  const [studyTotal, setStudyTotal] =
    useState(0);

  const [expenseTotal, setExpenseTotal] =
    useState(0);

  const [userEmail, setUserEmail] =
    useState("");

  const [goalTotal, setGoalTotal] =
    useState(0);

  const [goalCompleted, setGoalCompleted] =
    useState(0);

  const [goalAverage, setGoalAverage] =
    useState(0);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            setUserEmail(user.email);
            loadDashboardData(user);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  const loadDashboardData = async (
    user
  ) => {
    try {
      // Bazaar

      const bazaarQuery = query(
        collection(db, "bazaar"),
        where(
          "userId",
          "==",
          user.uid
        )
      );

      const bazaarSnapshot =
        await getDocs(bazaarQuery);

      setBazaarCount(
        bazaarSnapshot.docs.length
      );

      // Study Tasks

      const studyQuery = query(
        collection(db, "studyTasks"),
        where(
          "userId",
          "==",
          user.uid
        )
      );

      const studySnapshot =
        await getDocs(studyQuery);

      const studyData =
        studySnapshot.docs.map(
          (docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })
        );

      setStudyTotal(
        studyData.length
      );

      setStudyCompleted(
        studyData.filter(
          (task) =>
            task.completed
        ).length
      );

      // Expenses

      const expenseQuery = query(
        collection(db, "expenses"),
        where(
          "userId",
          "==",
          user.uid
        )
      );

      const expenseSnapshot =
        await getDocs(expenseQuery);

      const expenses =
        expenseSnapshot.docs.map(
          (docItem) =>
            docItem.data()
        );

      const totalExpense =
        expenses.reduce(
          (
            sum,
            expense
          ) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

      setExpenseTotal(
        totalExpense
      );

      // Goals

      const goalsQuery = query(
        collection(db, "goals"),
        where(
          "userId",
          "==",
          user.uid
        )
      );

      const goalsSnapshot =
        await getDocs(goalsQuery);

      const goals =
        goalsSnapshot.docs.map(
          (docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })
        );

      setGoalTotal(
        goals.length
      );

      const completedGoals =
        goals.filter(
          (goal) =>
            goal.completed
        ).length;

      setGoalCompleted(
        completedGoals
      );

      const average =
        goals.length === 0
          ? 0
          : Math.round(
              goals.reduce(
                (
                  sum,
                  goal
                ) => {
                  const progress =
                    goal.target > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (goal.current /
                              goal.target) *
                              100
                          )
                        )
                      : 0;

                  return (
                    sum +
                    progress
                  );
                },
                0
              ) / goals.length
            );

      setGoalAverage(
        average
      );
    } catch (error) {
      console.error(error);
    }
  };

  const cardStyle = {
    background:
      "rgba(17,24,39,0.85)",
    color: "white",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
    border:
      "1px solid rgba(255,255,255,0.1)",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.3)",
    backdropFilter:
      "blur(10px)",
  };

  const numberStyle = {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#60a5fa",
    margin: "10px 0",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#020617)",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
            color: "white",
            marginBottom: "10px",
          }}
        >
          🚀 LifeSync
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "40px",
            fontSize: "18px",
          }}
        >
          Welcome back,
          <strong>
            {" "}
            {userEmail}
          </strong>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "25px",
          }}
        >
          <div style={cardStyle}>
            <h2>🛒 Bazaar</h2>

            <div style={numberStyle}>
              {bazaarCount}
            </div>

            <p>Total Items</p>
          </div>

          <div style={cardStyle}>
            <h2>📚 Study</h2>

            <div style={numberStyle}>
              {studyCompleted}/
              {studyTotal}
            </div>

            <p>
              Completed Tasks
            </p>
          </div>

          <div style={cardStyle}>
            <h2>💰 Expenses</h2>

            <div style={numberStyle}>
              ৳{expenseTotal}
            </div>

            <p>
              Total Spending
            </p>
          </div>

          <div style={cardStyle}>
            <h2>🎯 Goals</h2>

            <div style={numberStyle}>
              {goalCompleted}/
              {goalTotal}
            </div>

            <p>
              Completed Goals
            </p>
          </div>

          <div style={cardStyle}>
            <h2>📈 Progress</h2>

            <div style={numberStyle}>
              {goalAverage}%
            </div>

            <p>
              Average Goal
              Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
