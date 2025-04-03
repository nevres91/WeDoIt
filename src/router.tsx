import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import LogIn from "./pages/LogIn";
import Partner from "./components/Partner";
import { ErrorProvider } from "./context/ErrorContext";

export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <ErrorProvider>
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
        </ErrorProvider>
      </AuthProvider>
    </Router>
  );
}
