import React from 'react';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../../../lib/utils/format';

interface RevenueChartProps {
  data: {
    labels: string[];
    revenue: number[];
  };
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue,
        fill: false,
        borderColor: 'rgb(79, 70, 229)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}