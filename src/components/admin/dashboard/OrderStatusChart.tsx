import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { cn } from '../../../lib/utils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatusChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          'rgb(79, 70, 229)', // Indigo
          'rgb(59, 130, 246)', // Blue
          'rgb(245, 158, 11)', // Yellow
          'rgb(16, 185, 129)', // Green
        ],
        borderColor: [
          'rgb(67, 56, 202)',
          'rgb(37, 99, 235)',
          'rgb(217, 119, 6)',
          'rgb(5, 150, 105)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0);
            const percentage = Math.round(((context.parsed / total) * 100) * 10) / 10;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
      <div className="relative" style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}