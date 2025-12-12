import React from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart02';
import { getCssVariable } from '../../utils/Utils';

function Graphique() {

  const chartData = {
    labels: [
        '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025',
    ],
    datasets: [
      // Violet line - Inscriptions
      {
        data: [420, 380, 450, 320, 280, 250, 300, 350, 400, 380, 320, 290, 430, 410, 470, 390, 310, 270, 330, 370, 420, 390, 340, 300, 460, 440],
        borderColor: getCssVariable('--color-violet-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Blue line - Diplômés
      {
        label: 'Étudiants Diplômés',
        data: [180, 160, 190, 150, 140, 200, 220, 180, 210, 250, 230, 190, 170, 210, 240, 200, 180, 220, 260, 240, 210, 230, 270, 250, 220, 240],
        borderColor: getCssVariable('--color-sky-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-sky-500'),
        pointHoverBackgroundColor: getCssVariable('--color-sky-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Green line - Taux de Réussite
      {
        label: 'Taux de Réussite (%)',
        data: [78, 82, 85, 80, 83, 87, 84, 81, 86, 89, 85, 82, 84, 88, 86, 83, 85, 87, 90, 88, 85, 87, 89, 86, 88, 90],
        borderColor: getCssVariable('--color-green-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-green-500'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
        yAxisID: 'y1'
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Nombre d'étudiants"
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Taux de réussite (%)"
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Statistiques Académiques</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-violet-500">● Inscriptions</span>
          <span className="text-xs text-sky-500">● Diplômés</span>
          <span className="text-xs text-green-500">● Réussite</span>
        </div>
      </header>
      
      {/* Info Cards */}
    <div className="grid grid-cols-3 gap-4 px-5 py-4">
        <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg flex items-center justify-between">
            <div>
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">120</div>
            <div className="text-sm text-violet-700 dark:text-violet-300">Total étudiants</div>
            </div>
            <svg class="w-8 h-8 text-violet-700 dark:text-violet-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg flex items-center justify-between">
            <div>
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">86%</div>
            <div className="text-sm text-sky-700 dark:text-sky-300">Moyenne réussite</div>
            </div>
            <svg class="w-8 h-8 text-sky-700 dark:text-sky-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"/>
            </svg>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center justify-between">
            <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">2150</div>
            <div className="text-sm text-green-700 dark:text-green-300">Diplômés</div>
            </div>
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z"/>
            </svg>
        </div>
    </div>

      {/* Chart built with Chart.js 3 */}
      <LineChart data={chartData} width={595} height={248} options={chartOptions} />
      
    </div>
  );
}

export default Graphique;