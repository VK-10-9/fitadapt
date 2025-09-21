'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Workout, Exercise, AdaptationHistory, User } from '@/types';
import { 
  analyzeWorkoutPattern, 
  shouldAdaptWorkout, 
  applyAdaptation,
  AdaptationResult,
  PerformanceMetrics 
} from '@/utils/adaptationAlgorithm';

export function useAdaptation() {
  const { user } = useAuth();
  const [adaptationHistory, setAdaptationHistory] = useState<AdaptationHistory[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAdaptationHistory();
    }
  }, [user]);

  const fetchAdaptationHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('adaptation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAdaptationHistory(data || []);
    } catch (err) {
      console.error('Error fetching adaptation history:', err);
    }
  };

  const analyzePerformance = async (recentWorkouts: Workout[], exercises: Exercise[]) => {
    if (!user || !recentWorkouts.length) return null;

    setLoading(true);
    try {
      // Create a mock user profile for now - in a real app, fetch from users table
      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        fitness_level: 'intermediate',
        goals: ['strength'],
        equipment: [],
        created_at: new Date().toISOString()
      };
      
      const metrics = analyzeWorkoutPattern(recentWorkouts, exercises, userProfile);
      setPerformanceMetrics(metrics);
      return metrics;
    } catch (err) {
      console.error('Error analyzing performance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateAdaptations = async (
    workouts: Workout[], 
    exercises: Exercise[]
  ): Promise<AdaptationResult[]> => {
    if (!user || !workouts.length) return [];

    try {
      // Create a mock user profile for now - in a real app, fetch from users table
      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        fitness_level: 'intermediate',
        goals: ['strength'],
        equipment: [],
        created_at: new Date().toISOString()
      };
      
      const metrics = analyzeWorkoutPattern(workouts, exercises, userProfile);
      const adaptations = shouldAdaptWorkout(metrics);
      return adaptations;
    } catch (err) {
      console.error('Error generating adaptations:', err);
      return [];
    }
  };

  const applyAdaptationToWorkout = (
    adaptation: AdaptationResult,
    workout: Workout,
    exercises: Exercise[]
  ): Workout => {
    try {
      return applyAdaptation(adaptation, exercises, workout);
    } catch (err) {
      console.error('Error applying adaptation:', err);
      return workout;
    }
  };

  const logAdaptation = async (adaptation: AdaptationResult) => {
    if (!user) return;

    try {
      const adaptationEntry = {
        user_id: user.id,
        change_type: adaptation.adaptationType,
        reason: adaptation.reason,
        previous_value: adaptation.previousValue,
        new_value: adaptation.newValue
      };

      const { data, error } = await supabase
        .from('adaptation_history')
        .insert([adaptationEntry])
        .select()
        .single();

      if (error) throw error;

      setAdaptationHistory(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error logging adaptation:', err);
      return null;
    }
  };

  const getAdaptationInsights = async (days: number = 30) => {
    if (!user) return null;

    try {
      // Get recent workouts for analysis
      const { data: workouts, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (workoutError) throw workoutError;

      // Get exercises
      const { data: exercises, error: exerciseError } = await supabase
        .from('exercises')
        .select('*');

      if (exerciseError) throw exerciseError;

      if (!workouts || !exercises) return null;

      // Create a mock user profile for now - in a real app, fetch from users table
      const userProfile: User = {
        id: user.id,
        email: user.email || '',
        fitness_level: 'intermediate',
        goals: ['strength'],
        equipment: [],
        created_at: new Date().toISOString()
      };

      const metrics = analyzeWorkoutPattern(workouts, exercises, userProfile);
      const suggestedAdaptations = shouldAdaptWorkout(metrics);

      return {
        metrics,
        suggestedAdaptations,
        workoutCount: workouts.length,
        avgCompletionRate: metrics.completionRate,
        consistencyScore: metrics.consistencyScore
      };
    } catch (err) {
      console.error('Error getting adaptation insights:', err);
      return null;
    }
  };

  const generateRecommendations = (metrics: PerformanceMetrics): string[] => {
    const recommendations: string[] = [];

    if (metrics.completionRate < 0.5) {
      recommendations.push("Consider reducing workout intensity or duration");
      recommendations.push("Focus on building consistency before increasing difficulty");
    } else if (metrics.completionRate > 0.9) {
      recommendations.push("You're ready for more challenging workouts");
      recommendations.push("Consider adding weight or increasing reps");
    }

    if (metrics.consistencyScore < 0.5) {
      recommendations.push("Try to maintain a more regular workout schedule");
      recommendations.push("Set reminders or find an accountability partner");
    }

    if (metrics.difficultyTrend < -1) {
      recommendations.push("Your workouts are getting easier - time to step it up!");
    } else if (metrics.difficultyTrend > 2) {
      recommendations.push("Rapid difficulty increases detected - ensure adequate recovery");
    }

    if (recommendations.length === 0) {
      recommendations.push("Great progress! Keep up the consistent effort");
    }

    return recommendations;
  };

  return {
    adaptationHistory,
    performanceMetrics,
    loading,
    analyzePerformance,
    generateAdaptations,
    applyAdaptationToWorkout,
    logAdaptation,
    getAdaptationInsights,
    generateRecommendations,
    refetch: fetchAdaptationHistory
  };
}