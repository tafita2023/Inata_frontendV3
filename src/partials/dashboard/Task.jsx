// Task.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Task() {
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("moyenne");

  // Charger les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://127.0.0.1:8000/api/taches/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  // Ajouter une tâche
  const handleAddTask = async () => {
    if (!newTaskDescription.trim()) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/taches/",
        {
          description: newTaskDescription,
          priorite: newTaskPriority.toLowerCase(), // "basse", "moyenne", "haute"
          statut: "a_faire", // valeur par défaut
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setNewTaskDescription("");
      setNewTaskPriority("moyenne");
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Erreur ajout tâche:", err.response?.data || err);
    }
  };

  // Toggle statut (fait / en attente)
  const toggleTask = async (task) => {
    try {
      const token = localStorage.getItem("authToken");
      const newStatus = task.statut === "terminee" ? "a_faire" : "terminee";

      const res = await axios.put(
        `http://127.0.0.1:8000/api/taches/${task.id}/`,
        { ...task, statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Erreur update tâche:", err.response?.data || err);
    }
  };

  // Supprimer
  const removeTask = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/taches/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Erreur suppression tâche:", err.response?.data || err);
    }
  };

  return (
    <div className="col-span-full xl:col-span-7 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="flex items-start justify-between w-full px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Liste des tâches</h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
        >
          Ajouter
        </button>
      </header>

      <div className="p-3">
        <ul className="my-1 space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.statut === "terminee"}
                  onChange={() => toggleTask(task)}
                  className="w-4 h-4 text-violet-500 accent-violet-500"
                />
                <span
                  className={`text-gray-800 dark:text-gray-100 ${
                    task.statut === "terminee"
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : ""
                  }`}
                >
                  {task.description}
                </span>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Popup d'ajout */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
              Nouvelle tâche
            </h3>

            {/* Description */}
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-900 dark:text-white"
              rows="3"
            />

            {/* Priorité */}
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-900 dark:text-white"
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>

            {/* Boutons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTask}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
