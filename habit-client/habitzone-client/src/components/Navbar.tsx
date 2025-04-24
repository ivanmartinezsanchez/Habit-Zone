import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  username: string;
}

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      setUsername(decoded.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid px-3">
        <span className="navbar-brand fw-bold me-auto">HabitZone</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0">
            {username && (
              <>
                <li className="nav-item d-flex align-items-center px-2">
                  <span className="text-light">👤 {username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link text-light" onClick={() => navigate("/dashboard")}>
                    🏠 Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link text-light" onClick={() => navigate("/weekly")}>
                    📅 Vista Semanal
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm ms-2">
                    🔓 Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {!username && (
              <>
                <li className="nav-item">
                  <button onClick={() => navigate("/")} className="btn btn-outline-light btn-sm me-2">
                    Iniciar sesión
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate("/register")} className="btn btn-light btn-sm">
                    Registrarse
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
