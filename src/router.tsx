import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import LogIn from "./pages/LogIn";
import Partner from "./components/Partner";
import TestingPage from "./pages/TestingPage";
import DashboardPartner from "./components/dashboard/DashboardPartner";

export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<TestingPage />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/partner" element={<Partner />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
