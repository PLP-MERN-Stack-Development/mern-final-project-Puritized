import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // updated to match your AuthContext

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // use the custom hook

  return user ? children : <Navigate to="/login" replace />;
}