import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface OrderStatusChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = {
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
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}