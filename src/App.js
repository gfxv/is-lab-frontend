import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={<PrivateRoute>{<Navigate to="/dashboard" />}</PrivateRoute>}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute>{<DashboardPage />}</PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
