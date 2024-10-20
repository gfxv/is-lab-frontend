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
import NewSpaceMarinePage from "./pages/NewSpaceMarine";
import SpaceMarinoInfo from "./pages/SpaceMarineInfo";

import AdminDashboardPage from "./pages/AdminDashboard";

import {
  GlobalStateProvider,
  useGlobalState,
} from "./providers/GlobalStateContext";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={<PrivateRoute>{<AdminDashboardPage />}</PrivateRoute>}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>{<Navigate to="/dashboard" />}</PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute>{<DashboardPage />}</PrivateRoute>}
          />
          <Route
            path="/marines/:id"
            element={<PrivateRoute>{<SpaceMarinoInfo />}</PrivateRoute>}
          />
          <Route
            path="/marines/new"
            element={<PrivateRoute>{<NewSpaceMarinePage />}</PrivateRoute>}
          />
        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
