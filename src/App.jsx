import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bazaar from "./pages/Bazaar";
import StudyPlanner from "./pages/StudyPlanner";
import ExpenseTracker from "./pages/ExpenseTracker";
import Goals from "./pages/Goals";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/bazaar"
          element={
            user ? (
              <Bazaar />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/study"
          element={
            user ? (
              <StudyPlanner />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/expense"
          element={
            user ? (
              <ExpenseTracker />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/goals"
          element={
            user ? (
              <Goals />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;