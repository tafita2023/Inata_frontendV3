import React, { useMemo, useState, useEffect } from "react";
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstanceInstance';
import AxiosInstance from "../../components/instance/AxiosInstance";

export default function CalendarEvents() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [events, setEvents] = useState([]);

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

  // Clic sur un jour
  const handleDayClick = (date) => {
    setSelectedDate(date);
    const dayEvents = events.filter((e) => {
      const start = new Date(e.date_debut);
      const end = new Date(e.date_fin);
      return date >= start && date <= end;
    });
    setSelectedDayEvents(dayEvents);
    setShowPopup(true);
  };

  // Vérifie si un événement tombe sur une date
  const isEventOnDay = (date) => {
    return events.filter((e) => {
      const start = new Date(e.date_debut);
      const end = new Date(e.date_fin);
      return date >= start && date <= end;
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
          <div className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">{monthLabel}</div>
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
            const dayEvents = isEventOnDay(d.date);
            const isToday = sameDay(d.date, today);
            const hasEvent = dayEvents.length > 0;

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

                  {/* SVG ruban rouge si événement */}
                  {hasEvent && (
                    <svg
                      className="absolute top-0 right-0 w-6 h-6 text-red-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
        <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
              Événements du {selectedDate?.toLocaleDateString()}
            </h3>

            {selectedDayEvents.length > 0 ? (
              <ul className="max-h-40 overflow-auto border p-2 rounded dark:border-gray-700">
                {selectedDayEvents.map((e, i) => (
                  <li key={i} className="text-gray-800 dark:text-gray-100 text-sm mb-1">
                    • {e.motif} ({new Date(e.date_debut).toLocaleDateString()} → {new Date(e.date_fin).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-300">Aucun événement ce jour.</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function buildMonthGrid(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const days = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, inMonth: false });
  }

  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push({ date: new Date(year, month, d), inMonth: true });
  }

  while (days.length % 7 !== 0) {
    const nextDay = new Date(year, month + 1, days.length - lastDayOfMonth.getDate() - startDay + 1);
    days.push({ date: nextDay, inMonth: false });
  }

  return days;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
