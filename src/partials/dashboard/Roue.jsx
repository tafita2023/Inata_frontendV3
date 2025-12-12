import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard06() {

  const chartData = {
    labels: ['Garçon ', 'Fille'],
    datasets: [
      {
        label: 'Répartition des étudiants',
        data: [75, 25],
        backgroundColor: [
          getCssVariable('--color-violet-500'), // Garçon
          getCssVariable('--color-sky-500'),    // Fille
        ],
        hoverBackgroundColor: [
          getCssVariable('--color-violet-600'),
          getCssVariable('--color-sky-600'),
        ],
        borderWidth: 0,
      },
    ],
  };

  // Options pour tooltip
  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            let value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Étudiants</h2>
      </header>
      <DoughnutChart data={chartData} options={chartOptions} width={45} height={260} />
    </div>
  );
}

export default DashboardCard06;
