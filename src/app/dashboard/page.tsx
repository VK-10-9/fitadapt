'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import WorkoutCard from '@/components/WorkoutCard';
import AdaptationInsights from '@/components/AdaptationInsights';
import { Activity, Calendar, TrendingUp, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Workout, Exercise, AdaptationHistory } from '@/types';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [adaptations, setAdaptations] = useState<AdaptationHistory[]>([]);
  const [stats, setStats] = useState({
    weeklyWorkouts: 0,
    completionRate: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's workout
      const today = new Date().toISOString().split('T')[0];
      const { data: workoutData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single();

      if (workoutData) {
        setTodayWorkout(workoutData);
      }

      // Fetch exercises
      const { data: exerciseData } = await supabase
        .from('exercises')
        .select('*');

      if (exerciseData) {
        setExercises(exerciseData);
      }

      // Fetch recent adaptations
      const { data: adaptationData } = await supabase
        .from('adaptation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (adaptationData) {
        setAdaptations(adaptationData);
      }

      // Calculate stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: weeklyWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', oneWeekAgo.toISOString().split('T')[0]);

      if (weeklyWorkouts) {
        const completedWorkouts = weeklyWorkouts.filter(w => w.completion_rate > 0);
        const avgCompletion = weeklyWorkouts.length > 0 
          ? weeklyWorkouts.reduce((sum, w) => sum + w.completion_rate, 0) / weeklyWorkouts.length 
          : 0;

        setStats({
          weeklyWorkouts: completedWorkouts.length,
          completionRate: avgCompletion,
          currentStreak: 3 // Simplified for demo
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTodayWorkout = async () => {
    // Simplified workout generation for demo
    const sampleWorkout: Workout = {
      id: 'temp-id',
      user_id: user?.id || '',
      planned_exercises: [
        { exercise_id: 'push-ups', sets: 3, reps: 10, rest_seconds: 60 },
        { exercise_id: 'squats', sets: 3, reps: 15, rest_seconds: 60 },
        { exercise_id: 'plank', duration_seconds: 30, rest_seconds: 60 }
      ],
      completed_exercises: [],
      difficulty_score: 5,
      completion_rate: 0,
      date: new Date().toISOString().split('T')[0],
      duration_minutes: 0
    };

    setTodayWorkout(sampleWorkout);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-indigo-600 mr-3" />
                <span className="text-2xl font-bold text-gray-900">FitAdapt</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/workout')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Start Workout
                </button>
                <button
                  onClick={() => router.push('/progress')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Progress
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Profile
                </button>
                <span className="text-gray-700">Welcome, {user?.email}</span>
                <button
                  onClick={signOut}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.weeklyWorkouts}</p>
                  <p className="text-sm text-gray-600">Workouts</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{(stats.completionRate * 100).toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">Average</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                  <p className="text-sm text-gray-600">Days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Workout */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Today&apos;s Workout</h2>
                
                {todayWorkout ? (
                  <div className="space-y-4">
                    {todayWorkout.planned_exercises.map((workoutExercise, index) => {
                      const exercise = exercises.find(e => e.name.toLowerCase().replace(/[^a-z]/g, '') === workoutExercise.exercise_id) || {
                        id: workoutExercise.exercise_id,
                        name: workoutExercise.exercise_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        category: 'strength' as const,
                        muscle_groups: ['full body'],
                        equipment_needed: [],
                        difficulty_base: 5,
                        instructions: 'Follow proper form and controlled movements.'
                      };
                      
                      return (
                        <WorkoutCard
                          key={index}
                          exercise={exercise}
                          workoutExercise={workoutExercise}
                          onComplete={(completed) => {
                            console.log('Exercise completed:', completed);
                          }}
                          isActive={index === 0}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No workout planned for today</p>
                    <button
                      onClick={generateTodayWorkout}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Generate Today&apos;s Workout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Adaptation Insights */}
            <div className="lg:col-span-1">
              <AdaptationInsights
                adaptations={adaptations}
                recentWorkouts={stats.weeklyWorkouts}
                completionRate={stats.completionRate}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}