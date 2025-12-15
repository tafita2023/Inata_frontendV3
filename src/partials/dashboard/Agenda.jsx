import React, { useMemo, useState, useEffect } from "react";
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

export default function Agenda() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventMotif, setEventMotif] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const monthLabel = current.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const days = useMemo(() => buildMonthGrid(current), [current]);

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await AxiosInstance.get("/api/evenements/");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // 📅 Clic sur un jour
  const handleDayClick = (date) => {
    const dayEvents = isEventOnDay(date);
    const event = dayEvents.length > 0 ? dayEvents[0] : null;

    setSelectedDate(date);
    setEditingEvent(event);

    if (event) {
      setEventMotif(event.motif || "");
      setEventEndDate(
        event.date_fin
          ? event.date_fin.split("T")[0]
          : event.date_debut.split("T")[0]
      );
    } else {
      setEventMotif("");
      setEventEndDate("");
    }

    setShowPopup(true);
  };

  // ➕ Ajouter un événement
  const handleAddEvent = async () => {
    if (!eventMotif.trim()) return;

    try {
      const res = await AxiosInstance.post("/api/evenements/", {
        motif: eventMotif,
        date_debut: toYMD(selectedDate),
        date_fin: eventEndDate || toYMD(selectedDate),
      });

      setEvents([...events, res.data]);
      setShowPopup(false);
      alert("Evenement ajouté avec succès !");
    } catch (err) {
      console.error(err);
      alert("Échec de l'ajout de l'événement !");
    }
  };

  // ✏️ Modifier un événement
  const handleUpdateEvent = async () => {
    if (!eventMotif.trim()) return;

    try {
      const res = await AxiosInstance.put(
        `/api/evenements/${editingEvent.id}/`,
        {
          motif: eventMotif,
          date_debut: editingEvent.date_debut,
          date_fin: eventEndDate || editingEvent.date_debut,
        }
      );

      setEvents(events.map(e => e.id === editingEvent.id ? res.data : e));
      setShowPopup(false);
      alert("Evenement modifié avec succès !");
    } catch (err) {
      console.error(err);
      alert("Échec de la modification !");
    }
  };

  // ✅ COMPARAISON DE DATE CORRIGÉE (ANTI TIMEZONE)
  const isEventOnDay = (date) => {
    return events.filter(e => {
      const start = new Date(e.date_debut);
      const end = new Date(e.date_fin);
      
      // Supprime l'heure pour éviter les décalages
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const f = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      
      return d >= s && d <= f;
    });
  };
  
  return (
    <div className="col-span-full xl:col-span-5 bg-white dark:bg-gray-800 shadow-xs rounded-xl relative">
      <div className="px-5 py-4 dark:border-gray-700">

        {/* Navigation mois */}
        <div className="flex items-center justify-between">
          <button
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
            onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            ◀
          </button>
          <div className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">
            {monthLabel}
          </div>
          <button
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
            onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            ▶
          </button>
        </div>

        {/* En-tête des jours */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 mt-5">
          {"DLMMJVS".split("").map((d, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
              {d}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
          {days.map((d, idx) => {
            const hasEvent = isEventOnDay(d.date).length > 0;
            const isToday = sameDay(d.date, today);

            return (
              <button
                key={idx}
                onClick={() => d.inMonth && handleDayClick(d.date)}
                className={`relative h-16 p-1 text-left transition rounded ${
                  !d.inMonth
                    ? "bg-gray-200 dark:bg-gray-800 cursor-default"
                    : "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                disabled={!d.inMonth}
              >
                <div className="flex flex-col items-center justify-center h-full relative">
                  <span
                    className={`flex items-center justify-center w-6 h-6 text-sm font-medium ${
                      isToday ? "bg-violet-600 text-white rounded-full" : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {d.date.getDate()}
                  </span>

                  {hasEvent && (
                    <svg
                      className="absolute top-0 right-0 w-6 h-6 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
              {editingEvent ? "Modifier l’événement" : "Ajouter un événement"}
            </h3>

            <textarea
              placeholder="Motif"
              value={eventMotif}
              onChange={(e) => setEventMotif(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-900 dark:text-white"
              rows="3"
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Date de fin :
            </label>
            <input
              type="date"
              value={eventEndDate || ""}
              onChange={(e) => setEventEndDate(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-900 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Annuler
              </button>

              {editingEvent ? (
                <button
                  onClick={handleUpdateEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Modifier
                </button>
              ) : (
                <button
                  onClick={handleAddEvent}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Ajouter
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helpers */
function buildMonthGrid(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const days = [];

  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), inMonth: false });
  }

  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push({ date: new Date(year, month, d), inMonth: true });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: new Date(year, month + 1, days.length), inMonth: false });
  }

  return days;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// 🔧 Helper date (anti timezone)
function toYMD(date) {
  return date.toISOString().split("T")[0];
}
