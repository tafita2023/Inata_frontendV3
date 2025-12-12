import React, { useState, useEffect } from "react";
import axios from "axios";

function Paiement() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://127.0.0.1:8000/api/admin/paiements/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaiements(res.data);
      } catch (err) {
        setError("Impossible de charger les paiements");
      } finally {
        setLoading(false);
      }
    };
    fetchPaiements();
  }, []);

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-3 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          La liste des derniers paiements
        </h2>
      </header>

      <div className="p-4">
        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paiements.length === 0 ? (
          <p className="text-gray-500">Aucun paiement trouvé</p>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="table-auto w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">#</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Nom</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Prénom</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Classe</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Mois payés</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Montant</th>
                  <th className="px-3 py-1 text-left text-gray-700 dark:text-gray-200">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p, index) => (
                  <tr key={p.id} className="border-t border-gray-200 dark:border-gray-600">
                    <td className="px-3 py-1">{index + 1}</td>
                    <td className="px-3 py-1">{p.nom}</td>
                    <td className="px-3 py-1">{p.prenom}</td>
                    <td className="px-3 py-1">{p.classe}</td>
                    <td className="px-3 py-1">
                      {(() => {
                        if (!p.mois_payes || p.mois_payes.length === 0) return "-";
                        const mois = p.mois_payes.map(m => m.split(" ")[0]); // garde juste le nom du mois
                        const annee = p.mois_payes[0].match(/\(([^)]+)\)/)?.[1]; // récupère l'année entre parenthèses
                        return `${mois.join(", ")} (${annee})`;
                      })()}
                    </td>
                    <td className="px-3 py-1">{p.montant_total} Ar</td>
                    <td className="px-3 py-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          p.statut === "Payé"
                            ? "bg-green-200 text-green-700"
                            : p.statut === "En attente"
                            ? "bg-yellow-200 text-yellow-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Paiement;
