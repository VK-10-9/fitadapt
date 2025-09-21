'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Workout, Exercise, WorkoutExercise } from '@/types';

export function useWorkoutData() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkoutData();
    }
  }, [user]);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch exercises
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .select('*');

      if (exerciseError) throw exerciseError;
      setExercises(exerciseData || []);

      // Fetch user's workouts
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (workoutError) throw workoutError;
      setWorkouts(workoutData || []);

      // Check for today's workout
      const today = new Date().toISOString().split('T')[0];
      const todayWorkout = workoutData?.find(w => w.date === today);
      setCurrentWorkout(todayWorkout || null);

    } catch (err) {
      console.error('Error fetching workout data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workout data');
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workout: Omit<Workout, 'id' | 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([{ ...workout, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setWorkouts(prev => [data, ...prev]);
      if (data.date === new Date().toISOString().split('T')[0]) {
        setCurrentWorkout(data);
      }

      return data;
    } catch (err) {
      console.error('Error creating workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to create workout');
      return null;
    }
  };

  const updateWorkout = async (workoutId: string, updates: Partial<Workout>) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', workoutId)
        .select()
        .single();

      if (error) throw error;

      setWorkouts(prev => prev.map(w => w.id === workoutId ? data : w));
      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(data);
      }

      return data;
    } catch (err) {
      console.error('Error updating workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to update workout');
      return null;
    }
  };

  const completeExercise = async (workoutId: string, exerciseData: WorkoutExercise) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const updatedCompletedExercises = [...workout.completed_exercises, exerciseData];
    const completionRate = updatedCompletedExercises.length / workout.planned_exercises.length;

    await updateWorkout(workoutId, {
      completed_exercises: updatedCompletedExercises,
      completion_rate: completionRate
    });

    // Log progress
    await logProgress(exerciseData);
  };

  const logProgress = async (exerciseData: WorkoutExercise) => {
    if (!user) return;

    try {
      const progressEntry = {
        user_id: user.id,
        exercise_id: exerciseData.exercise_id,
        weight_used: exerciseData.weight || null,
        reps_completed: exerciseData.reps || null,
        duration_seconds: exerciseData.duration_seconds || null,
        perceived_difficulty: 7, // Default - could be collected from user
        date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('user_progress')
        .insert([progressEntry]);

      if (error) throw error;
    } catch (err) {
      console.error('Error logging progress:', err);
    }
  };

  const getProgressData = async (exerciseId?: string, days: number = 30) => {
    if (!user) return [];

    try {
      let query = supabase
        .from('user_progress')
        .select(`
          *,
          exercises:exercise_id (name, category)
        `)
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (exerciseId) {
        query = query.eq('exercise_id', exerciseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching progress data:', err);
      return [];
    }
  };

  return {
    workouts,
    exercises,
    currentWorkout,
    loading,
    error,
    createWorkout,
    updateWorkout,
    completeExercise,
    getProgressData,
    refetch: fetchWorkoutData
  };
}