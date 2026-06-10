import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bazaar from "./pages/Bazaar";
import StudyPlanner from "./pages/StudyPlanner";
import ExpenseTracker from "./pages/ExpenseTracker";
import Goals from "./pages/Goals";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/bazaar"
          element={<Bazaar />}
        />

        <Route
          path="/study"
          element={<StudyPlanner />}
        />

        <Route
          path="/expense"
          element={<ExpenseTracker />}
        />

        <Route
          path="/goals"
          element={<Goals />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;