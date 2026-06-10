
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

import { auth, db } from "../firebase";

function ExpenseTracker() {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setExpenses(data);
  };

  const addExpense = async () => {
    if (!expenseName || !amount) return;

    const user = auth.currentUser;

    await addDoc(collection(db, "expenses"), {
      name: expenseName,
      amount: Number(amount),
      userId: user.uid,
      createdAt: new Date(),
    });

    setExpenseName("");
    setAmount("");

    loadExpenses();
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));

    loadExpenses();
  };

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <h1>💰 Expense Tracker</h1>

        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) =>
            setExpenseName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          style={{
            marginLeft: "10px",
          }}
        />

        <button
          onClick={addExpense}
          style={{
            marginLeft: "10px",
          }}
        >
          Add Expense
        </button>

        <hr />

        <h2>
          Total Expense: {totalExpense} BDT
        </h2>

        <hr />

        {expenses.map((expense) => (
          <div
            key={expense.id}
            style={{
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>
              {expense.name} - {expense.amount} BDT
            </span>

            <button
              onClick={() =>
                deleteExpense(expense.id)
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

export default ExpenseTracker;

