import React, { useEffect } from "react";
import { useFirebase } from "../../firebase_context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../app_router";

const LoginPage = () => {
  const { user, login, loading } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.marketings);
    }
  }, [user, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {loading && <div>Loading...</div>}
      <button
        type="submit"
        onClick={login}
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
