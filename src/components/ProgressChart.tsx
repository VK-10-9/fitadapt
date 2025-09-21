'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  value: number;
  metric: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  title: string;
  metric: string;
  color?: string;
}

export default function ProgressChart({ data, title, metric, color = '#6366f1' }: ProgressChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available yet. Complete some workouts to see your progress!
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [value, metric]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-lg font-semibold">{data[data.length - 1]?.value}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Best</p>
            <p className="text-lg font-semibold">{Math.max(...data.map(d => d.value))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Improvement</p>
            <p className="text-lg font-semibold text-green-600">
              {data.length > 1 ? 
                `+${((data[data.length - 1].value - data[0].value) / data[0].value * 100).toFixed(1)}%` : 
                '0%'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}