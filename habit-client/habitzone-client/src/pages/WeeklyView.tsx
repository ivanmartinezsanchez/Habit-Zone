import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getHabits, updateHabit, deleteHabit } from "../services/habitService";
import { getTrackingByDate } from "../services/trackerService";

interface Habit {
  id: number;
  title: string;
}

interface TrackerEntry {
  habit_id: number;
  date: string;
  completed: boolean;
}

function WeeklyView() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weekData, setWeekData] = useState<Record<string, number[]>>({});
  const [week, setWeek] = useState<string[]>([]);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const getPast7Days = (): string[] => {
      const days: string[] = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date.toISOString().split("T")[0]);
      }
      return days;
    };

    const currentWeek = getPast7Days();
    setWeek(currentWeek);

    const fetchHabitsAndTracking = async () => {
      try {
        const habitsList: Habit[] = await getHabits(token);
        setHabits(habitsList);

        const newWeekData: Record<string, number[]> = {};

        await Promise.all(
          currentWeek.map(async (date) => {
            const entries: TrackerEntry[] = await getTrackingByDate(token, date);

            const filteredEntries = entries.filter((entry) =>
              habitsList.some((habit) => habit.id === entry.habit_id)
            );

            newWeekData[date] = filteredEntries.map((item) => item.habit_id);
          })
        );

        setWeekData(newWeekData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchHabitsAndTracking();
  }, [token, navigate]);

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setEditTitle(habit.title);
  };

  const handleEditSave = async () => {
    if (!editingHabit || !token) return;
    try {
      await updateHabit(editingHabit.id, editTitle, token);
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, title: editTitle } : h))
      );
      setEditingHabit(null);
    } catch (error) {
      console.error("Error al editar hábito:", error);
    }
  };

  const confirmDelete = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const handleConfirmDelete = async () => {
    if (!habitToDelete || !token) return;
    try {
      await deleteHabit(habitToDelete.id, token);
      setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id));
      setWeekData((prev) => {
        const updated: Record<string, number[]> = {};
        for (const date in prev) {
          updated[date] = prev[date].filter((id) => id !== habitToDelete.id);
        }
        return updated;
      });
      setHabitToDelete(null);
    } catch (error) {
      console.error("Error al eliminar hábito:", error);
    }
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        <h2 className="text-center mb-4">📆 Historial Semanal de tus tareas.</h2>

        {habits.length === 0 ? (
          <p className="text-center">No tienes hábitos registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered text-center text-light border-secondary">
              <thead className="table-dark">
                <tr>
                  <th>Hábito</th>
                  {week.map((date) => (
                    <th key={date}>{date.slice(5)}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id}>
                    <td className="text-start">{habit.title}</td>
                    {week.map((date) => (
                      <td key={date}>
                        {weekData[date]?.includes(habit.id) ? (
                          <span className="text-success fs-5">✔</span>
                        ) : (
                          <span className="text-danger fs-5">✘</span>
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="btn-group">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
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

      {/* Modal de Eliminación */}
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

export default WeeklyView;
