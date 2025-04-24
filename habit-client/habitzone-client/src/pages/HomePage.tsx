import { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Footer from "../components/Footer";

function HomePage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <main className="d-flex flex-column align-items-center p-3 flex-grow-1">
        <div className="mb-4 text-center">
          <h1 className="display-4">📋 Bienvenido a HabitZone</h1>
          <p className="lead">Gestiona tus hábitos y mejora tu productividad.</p>
        </div>

        <div className="bg-light text-dark rounded shadow p-4 w-100" style={{ maxWidth: "500px" }}>
          {showLogin ? <LoginPage /> : <RegisterPage />}

          <div className="text-center mt-3">
            {showLogin ? (
              <p>
                ¿No tienes cuenta? {" "}
                <button className="btn btn-link text-primary p-0" onClick={() => setShowLogin(false)}>
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta? {" "}
                <button className="btn btn-link text-primary p-0" onClick={() => setShowLogin(true)}>
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;

