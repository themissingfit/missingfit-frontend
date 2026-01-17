import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/api";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ REMOVE /api/v1 here
        await api.get("/user/me");
        setAllowed(true);
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="p-10">Checking access…</div>;
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
};

export default AdminProtectedRoute;
