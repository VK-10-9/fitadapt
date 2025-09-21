'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Target, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    fitness_level: 'intermediate',
    goals: ['strength', 'muscle_gain'],
    equipment: ['dumbbells', 'resistance_bands'],
    height: '5\'10"',
    weight: '175 lbs',
    age: 28
  });

  const handleSaveProfile = () => {
    // In a real app, save to Supabase users table
    alert('Profile saved successfully!');
  };

  const handleGoalChange = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleEquipmentChange = (equipment: string) => {
    setUserProfile(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment) 
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
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
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'equipment', label: 'Equipment', icon: Settings },
                { id: 'achievements', label: 'Achievements', icon: Award }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitness Level
                  </label>
                  <select
                    value={userProfile.fitness_level}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, fitness_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={userProfile.age || ''}
                    onChange={(e) => setUserProfile(prev => ({ 
                      ...prev, 
                      age: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={userProfile.weight}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="175 lbs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="text"
                    value={userProfile.height}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="5'10&quot;"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Fitness Goals</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'strength', label: 'Build Strength', description: 'Increase muscle strength and power' },
                  { id: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle mass' },
                  { id: 'weight_loss', label: 'Weight Loss', description: 'Burn fat and lose weight' },
                  { id: 'cardio', label: 'Cardiovascular', description: 'Improve heart health and endurance' },
                  { id: 'flexibility', label: 'Flexibility', description: 'Increase range of motion' },
                  { id: 'general_fitness', label: 'General Fitness', description: 'Overall health and wellness' }
                ].map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalChange(goal.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      userProfile.goals.includes(goal.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.label}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      {userProfile.goals.includes(goal.id) && (
                        <div className="text-indigo-600">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Equipment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'dumbbells', label: 'Dumbbells' },
                  { id: 'barbell', label: 'Barbell' },
                  { id: 'resistance_bands', label: 'Resistance Bands' },
                  { id: 'pull_up_bar', label: 'Pull-up Bar' },
                  { id: 'kettlebells', label: 'Kettlebells' },
                  { id: 'treadmill', label: 'Treadmill' },
                  { id: 'stationary_bike', label: 'Stationary Bike' },
                  { id: 'yoga_mat', label: 'Yoga Mat' },
                  { id: 'bench', label: 'Weight Bench' }
                ].map((equipment) => (
                  <div
                    key={equipment.id}
                    onClick={() => handleEquipmentChange(equipment.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
                      userProfile.equipment.includes(equipment.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{equipment.label}</div>
                    {userProfile.equipment.includes(equipment.id) && (
                      <div className="text-indigo-600 mt-1">✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> Select all equipment you have access to. This helps us create better workout plans tailored to your setup!
                </p>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'First Workout', description: 'Completed your first workout', icon: '🎯', unlocked: true, date: '2024-01-01' },
                  { title: 'Week Warrior', description: 'Completed 7 consecutive days', icon: '🔥', unlocked: true, date: '2024-01-08' },
                  { title: 'Strength Builder', description: 'Increased weight by 20%', icon: '💪', unlocked: true, date: '2024-01-15' },
                  { title: 'Consistency King', description: 'Maintain 90% completion rate for a month', icon: '👑', unlocked: false, date: null },
                  { title: 'Marathon Master', description: 'Complete 100 total workouts', icon: '🏃', unlocked: false, date: null },
                  { title: 'Adaptation Expert', description: 'Successfully adapted 10 times', icon: '🧠', unlocked: false, date: null }
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-green-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h3>
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
                        {!achievement.unlocked && (
                          <p className="text-xs text-gray-400 mt-1">Locked</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="mt-8 text-center">
            <button
              onClick={signOut}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}