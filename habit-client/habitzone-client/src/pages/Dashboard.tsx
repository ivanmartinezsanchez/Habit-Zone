import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Habit {
  id: number;
  title: string;
}

interface TrackerEntry {
  habit_id: number;
  date: string;
  completed: boolean;
}

interface TokenPayload {
  id: number;
  username: string;
}

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<number[]>([]);
  const [completedMap, setCompletedMap] = useState<Record<number, string[]>>({});
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<TokenPayload>(token) : null;
  const username = decoded?.username || "";
  const today = new Date().toISOString().split("T")[0];

  const API_BASE = "http://localhost:4000/api";

  const getPastDays = (days: number) => {
    const result: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split("T")[0]);
    }
    return result;
  };

  const calculateStreak = (habitId: number): number => {
    const dates = completedMap[habitId] || [];
    let streak = 0;
    const pastDates = getPastDays(30);
    for (const date of pastDates) {
      if (dates.includes(date)) streak++;
      else break;
    }
    return streak;
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const habitsRes = await axios.get(`${API_BASE}/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(habitsRes.data);

        const completed: number[] = [];
        const map: Record<number, string[]> = {};
        const past30 = getPastDays(30);

        await Promise.all(
          past30.map(async (date) => {
            const res = await axios.get(`${API_BASE}/tracker/date/${date}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            res.data.forEach((entry: TrackerEntry) => {
              if (!map[entry.habit_id]) map[entry.habit_id] = [];
              map[entry.habit_id].push(date);
              if (date === today) completed.push(entry.habit_id);
            });
          })
        );

        setCompletedToday(completed);
        setCompletedMap(map);
      } catch {
        setError("Error al cargar hábitos");
      }
    };

    fetchData();
  }, [token, navigate, today]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE}/habits`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newHabit: Habit = res.data.habit;
      setHabits((prev) => [...prev, newHabit]);
      setTitle("");
    } catch {
      setError("Error al crear hábito");
    }
  };

  const handleMarkAsDone = async (habitId: number) => {
    try {
      await axios.post(
        `${API_BASE}/tracker`,
        { habitId, date: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedToday((prev) => [...prev, habitId]);
    } catch {
      console.error("Error al marcar hábito");
    }
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setEditTitle(habit.title);
  };

  const handleEditSave = async () => {
    if (!editingHabit) return;
    try {
      await axios.put(
        `${API_BASE}/habits/${editingHabit.id}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, title: editTitle } : h))
      );
      setEditingHabit(null);
    } catch {
      console.error("Error al editar hábito");
    }
  };

  const confirmDelete = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const handleConfirmDelete = async () => {
    if (!habitToDelete) return;
    try {
      await axios.delete(`${API_BASE}/habits/${habitToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id));
      setCompletedToday((prev) => prev.filter((id) => id !== habitToDelete.id));
      setCompletedMap((prev) => {
        const updated: Record<number, string[]> = {};
        for (const id in prev) {
          const key = parseInt(id);
          if (!isNaN(key) && key !== habitToDelete.id) {
            updated[key] = prev[key];
          }
        }
        return updated;
      });
      setHabitToDelete(null);
    } catch {
      console.error("Error al eliminar hábito");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <Navbar />

      <div className="container py-4 flex-grow-1">
        <h2 className="text-center mb-3">
          📋 ¡Hola, {username}! Aquí verás tus tareas pendientes.
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleAddHabit} className="mb-4 mx-auto w-100" style={{ maxWidth: "500px" }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nuevo hábito"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <button className="btn btn-success" type="submit">
              <i className="bi bi-plus-circle"></i> Añadir
            </button>
          </div>
        </form>

        <div className="table-responsive">
          {habits.filter((h) => !completedToday.includes(h.id)).length === 0 ? (
            <p className="text-center">No tienes hábitos pendientes hoy.</p>
          ) : (
            <ul className="list-group">
              {habits
                .filter((habit) => !completedToday.includes(habit.id))
                .map((habit) => (
                  <li
                    key={habit.id}
                    className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-secondary flex-column flex-md-row text-center text-md-start"
                  >
                    <div className="w-100">
                      <strong>{habit.title}</strong>
                      <div className="text-info small">🔥 Racha: {calculateStreak(habit.id)} días</div>
                    </div>
                    <div className="btn-group mt-2 mt-md-0">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleMarkAsDone(habit.id)}
                      >
                        <i className="bi bi-check-circle"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => openEditModal(habit)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(habit)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {editingHabit && (
        <div className="modal fade show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Editar hábito</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditingHabit(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingHabit(null)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleEditSave}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {habitToDelete && (
        <div className="modal fade show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">¿Eliminar hábito?</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setHabitToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que deseas eliminar el hábito <strong>{habitToDelete.title}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setHabitToDelete(null)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;
