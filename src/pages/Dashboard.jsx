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
  const [bazaarCount, setBazaarCount] = useState(0);
  const [studyCompleted, setStudyCompleted] = useState(0);
  const [studyTotal, setStudyTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
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

  const loadDashboardData = async (user) => {
    try {
      const bazaarQuery = query(
        collection(db, "bazaar"),
        where("userId", "==", user.uid)
      );

      const bazaarSnapshot =
        await getDocs(bazaarQuery);

      setBazaarCount(
        bazaarSnapshot.docs.length
      );

      const studyQuery = query(
        collection(db, "studyTasks"),
        where("userId", "==", user.uid)
      );

      const studySnapshot =
        await getDocs(studyQuery);

      const studyData =
        studySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setStudyTotal(studyData.length);

      setStudyCompleted(
        studyData.filter(
          (task) => task.completed
        ).length
      );

      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid)
      );

      const expenseSnapshot =
        await getDocs(expenseQuery);

      const expenses =
        expenseSnapshot.docs.map((doc) =>
          doc.data()
        );

      const totalExpense =
        expenses.reduce(
          (sum, expense) =>
            sum + Number(expense.amount),
          0
        );

      setExpenseTotal(totalExpense);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
            marginBottom: "15px",
          }}
        >
          🚀 LifeSync
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginBottom: "40px",
          }}
        >
          Welcome back,
          <strong> {userEmail}</strong>
        </p>

        <div className="grid">
          <div className="card">
            <h2>🛒 Bazaar</h2>

            <div className="stat-number">
              {bazaarCount}
            </div>

            <p>Total Items</p>
          </div>

          <div className="card">
            <h2>📚 Study Planner</h2>

            <div className="stat-number">
              {studyCompleted}/{studyTotal}
            </div>

            <p>Completed Tasks</p>
          </div>

          <div className="card">
            <h2>💰 Expenses</h2>

            <div className="stat-number">
              {expenseTotal}
            </div>

            <p>BDT Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;