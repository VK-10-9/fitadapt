'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProgressChart from '@/components/ProgressChart';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Progress() {
  const router = useRouter();
  const [selectedMetric, setSelectedMetric] = useState('strength');

  // Mock progress data
  const progressData = {
    strength: [
      { date: '2024-01-01', value: 50, metric: 'Total Weight (lbs)' },
      { date: '2024-01-08', value: 55, metric: 'Total Weight (lbs)' },
      { date: '2024-01-15', value: 60, metric: 'Total Weight (lbs)' },
      { date: '2024-01-22', value: 65, metric: 'Total Weight (lbs)' },
      { date: '2024-01-29', value: 70, metric: 'Total Weight (lbs)' },
    ],
    cardio: [
      { date: '2024-01-01', value: 15, metric: 'Duration (minutes)' },
      { date: '2024-01-08', value: 18, metric: 'Duration (minutes)' },
      { date: '2024-01-15', value: 20, metric: 'Duration (minutes)' },
      { date: '2024-01-22', value: 22, metric: 'Duration (minutes)' },
      { date: '2024-01-29', value: 25, metric: 'Duration (minutes)' },
    ],
    consistency: [
      { date: '2024-01-01', value: 70, metric: 'Completion Rate (%)' },
      { date: '2024-01-08', value: 75, metric: 'Completion Rate (%)' },
      { date: '2024-01-15', value: 80, metric: 'Completion Rate (%)' },
      { date: '2024-01-22', value: 85, metric: 'Completion Rate (%)' },
      { date: '2024-01-29', value: 90, metric: 'Completion Rate (%)' },
    ]
  };

  const achievements = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Completed your first workout',
      icon: '🎯',
      date: '2024-01-01',
      unlocked: true
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Completed 7 consecutive days',
      icon: '🔥',
      date: '2024-01-08',
      unlocked: true
    },
    {
      id: 3,
      title: 'Strength Builder',
      description: 'Increased weight by 20%',
      icon: '💪',
      date: '2024-01-15',
      unlocked: true
    },
    {
      id: 4,
      title: 'Consistency King',
      description: 'Maintain 90% completion rate',
      icon: '👑',
      date: null,
      unlocked: false
    }
  ];

  const weeklyStats = {
    workoutsCompleted: 5,
    totalMinutes: 150,
    averageIntensity: 7.5,
    caloriesBurned: 750
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Weekly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.workoutsCompleted}</p>
              <p className="text-sm text-gray-600">Workouts This Week</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalMinutes}</p>
              <p className="text-sm text-gray-600">Total Minutes</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.averageIntensity}/10</p>
              <p className="text-sm text-gray-600">Avg Intensity</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.caloriesBurned}</p>
              <p className="text-sm text-gray-600">Calories Burned</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metric Selector */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h2>
                <div className="flex space-x-4 mb-6">
                  {[
                    { key: 'strength', label: 'Strength', color: '#6366f1' },
                    { key: 'cardio', label: 'Cardio', color: '#10b981' },
                    { key: 'consistency', label: 'Consistency', color: '#f59e0b' }
                  ].map((metric) => (
                    <button
                      key={metric.key}
                      onClick={() => setSelectedMetric(metric.key)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedMetric === metric.key
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Chart */}
              <ProgressChart
                data={progressData[selectedMetric as keyof typeof progressData]}
                title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Progress`}
                metric={progressData[selectedMetric as keyof typeof progressData][0]?.metric || ''}
                color={
                  selectedMetric === 'strength' ? '#6366f1' :
                  selectedMetric === 'cardio' ? '#10b981' : '#f59e0b'
                }
              />

              {/* Exercise Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Performance</h3>
                <div className="space-y-4">
                  {[
                    { exercise: 'Push-ups', current: '3×12', best: '3×15', improvement: '+25%' },
                    { exercise: 'Squats', current: '3×18', best: '3×20', improvement: '+33%' },
                    { exercise: 'Plank', current: '45s', best: '60s', improvement: '+50%' },
                    { exercise: 'Burpees', current: '2×8', best: '3×10', improvement: '+87%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900">{item.exercise}</p>
                        <p className="text-sm text-gray-600">Current: {item.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">Best: {item.best}</p>
                        <p className="text-sm font-medium text-green-600">{item.improvement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.unlocked ? 'text-green-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                          {achievement.date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Unlocked {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Goals</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-900">Weekly Target</h4>
                    <p className="text-sm text-blue-700">Complete 5 workouts</p>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">5/5 completed ✓</p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="font-medium text-yellow-900">Strength Goal</h4>
                    <p className="text-sm text-yellow-700">Increase push-ups to 3×15</p>
                    <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">12/15 reps (80%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}