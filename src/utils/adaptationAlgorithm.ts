import { Workout, WorkoutExercise, Exercise, User } from '@/types';

export interface AdaptationResult {
  shouldAdapt: boolean;
  adaptationType: 'increase_difficulty' | 'decrease_difficulty' | 'change_exercise' | 'add_rest';
  reason: string;
  newValue: Record<string, unknown>;
  previousValue: Record<string, unknown>;
}

export interface PerformanceMetrics {
  completionRate: number;
  consistencyScore: number;
  difficultyTrend: number;
  recentWorkouts: Workout[];
  userFeedback?: number; // 1-10 perceived difficulty
}

export function calculatePerformanceScore(workout: Workout, exercises: Exercise[]): number {
  const completionRate = workout.completed_exercises.length / Math.max(1, workout.planned_exercises.length);
  const difficultyFactor = workout.difficulty_score / 10;
  
  // Calculate quality of completion (did they complete with good form/weight?)
  let qualityScore = 1.0;
  workout.completed_exercises.forEach((completed, index) => {
    const planned = workout.planned_exercises[index];
    if (planned && completed) {
      // Compare completed vs planned performance
      if (completed.reps && planned.reps) {
        qualityScore *= Math.min(1.0, completed.reps / planned.reps);
      }
      if (completed.duration_seconds && planned.duration_seconds) {
        qualityScore *= Math.min(1.0, completed.duration_seconds / planned.duration_seconds);
      }
    }
  });

  return (completionRate * 0.6) + (difficultyFactor * 0.3) + (qualityScore * 0.1);
}

export function analyzeWorkoutPattern(
  recentWorkouts: Workout[],
  _exercises: Exercise[],
  _user: User
): PerformanceMetrics {
  if (recentWorkouts.length === 0) {
    return {
      completionRate: 0,
      consistencyScore: 0,
      difficultyTrend: 0,
      recentWorkouts: []
    };
  }

  // Calculate completion rate over recent workouts
  const completionRates = recentWorkouts.map(workout => 
    workout.completed_exercises.length / Math.max(1, workout.planned_exercises.length)
  );
  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;

  // Calculate consistency (how regular are workouts?)
  const consistencyScore = calculateConsistencyScore(recentWorkouts);

  // Calculate difficulty trend (are workouts getting easier or harder?)
  const difficultyTrend = calculateDifficultyTrend(recentWorkouts);

  return {
    completionRate: avgCompletionRate,
    consistencyScore,
    difficultyTrend,
    recentWorkouts
  };
}

export function shouldAdaptWorkout(metrics: PerformanceMetrics): AdaptationResult[] {
  const adaptations: AdaptationResult[] = [];

  // Rule 1: Increase difficulty if consistently performing well
  if (metrics.completionRate >= 0.9 && metrics.recentWorkouts.length >= 3) {
    const recentHighPerformance = metrics.recentWorkouts
      .slice(-3)
      .every(workout => 
        workout.completed_exercises.length / Math.max(1, workout.planned_exercises.length) >= 0.9
      );

    if (recentHighPerformance) {
      adaptations.push({
        shouldAdapt: true,
        adaptationType: 'increase_difficulty',
        reason: '3+ consecutive workouts with 90%+ completion rate',
        newValue: { difficultyIncrease: 1 },
        previousValue: { currentLevel: 'previous' }
      });
    }
  }

  // Rule 2: Decrease difficulty if struggling
  if (metrics.completionRate < 0.7 && metrics.recentWorkouts.length >= 2) {
    const recentLowPerformance = metrics.recentWorkouts
      .slice(-2)
      .every(workout => 
        workout.completed_exercises.length / Math.max(1, workout.planned_exercises.length) < 0.7
      );

    if (recentLowPerformance) {
      adaptations.push({
        shouldAdapt: true,
        adaptationType: 'decrease_difficulty',
        reason: '2+ consecutive workouts with <70% completion rate',
        newValue: { difficultyDecrease: 1 },
        previousValue: { currentLevel: 'previous' }
      });
    }
  }

  // Rule 3: Change exercises if same exercise fails repeatedly
  const failedExercises = findConsistentlyFailedExercises(metrics.recentWorkouts);
  failedExercises.forEach(exerciseId => {
    adaptations.push({
      shouldAdapt: true,
      adaptationType: 'change_exercise',
      reason: `Exercise ${exerciseId} failed 3 times in a row`,
      newValue: { replaceExercise: exerciseId },
      previousValue: { originalExercise: exerciseId }
    });
  });

  // Rule 4: Add rest day if overall performance declining
  if (metrics.completionRate < 0.6 && metrics.consistencyScore > 0.8) {
    adaptations.push({
      shouldAdapt: true,
      adaptationType: 'add_rest',
      reason: 'High consistency but low completion suggests overtraining',
      newValue: { addRestDay: true },
      previousValue: { currentSchedule: 'daily' }
    });
  }

  return adaptations;
}

export function applyAdaptation(
  adaptation: AdaptationResult,
  exercises: Exercise[],
  currentWorkout: Workout
): Workout {
  const adaptedWorkout = { ...currentWorkout };

  switch (adaptation.adaptationType) {
    case 'increase_difficulty':
      adaptedWorkout.planned_exercises = adaptedWorkout.planned_exercises.map(exercise => 
        increaseDifficulty(exercise, exercises)
      );
      adaptedWorkout.difficulty_score = Math.min(10, adaptedWorkout.difficulty_score + 1);
      break;

    case 'decrease_difficulty':
      adaptedWorkout.planned_exercises = adaptedWorkout.planned_exercises.map(exercise => 
        decreaseDifficulty(exercise, exercises)
      );
      adaptedWorkout.difficulty_score = Math.max(1, adaptedWorkout.difficulty_score - 1);
      break;

    case 'change_exercise':
      const exerciseToReplace = adaptation.newValue.replaceExercise;
      adaptedWorkout.planned_exercises = adaptedWorkout.planned_exercises.map(exercise => {
        if (exercise.exercise_id === exerciseToReplace) {
          return replaceWithAlternative(exercise, exercises);
        }
        return exercise;
      });
      break;

    case 'add_rest':
      // This would typically be handled at a higher level (scheduling)
      // For now, we reduce the workout intensity
      adaptedWorkout.planned_exercises = adaptedWorkout.planned_exercises.slice(0, -1);
      break;
  }

  return adaptedWorkout;
}

function calculateConsistencyScore(workouts: Workout[]): number {
  if (workouts.length < 2) return 0;

  // Calculate days between workouts
  const workoutDates = workouts
    .map(w => new Date(w.date))
    .sort((a, b) => a.getTime() - b.getTime());

  let totalGaps = 0;
  let gapVariance = 0;

  for (let i = 1; i < workoutDates.length; i++) {
    const gap = (workoutDates[i].getTime() - workoutDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
    totalGaps += gap;
  }

  const avgGap = totalGaps / (workoutDates.length - 1);

  // Calculate variance in gaps
  for (let i = 1; i < workoutDates.length; i++) {
    const gap = (workoutDates[i].getTime() - workoutDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
    gapVariance += Math.pow(gap - avgGap, 2);
  }
  gapVariance /= (workoutDates.length - 1);

  // Lower variance = higher consistency
  const consistencyScore = Math.max(0, 1 - (gapVariance / 10));
  return Math.min(1, consistencyScore);
}

function calculateDifficultyTrend(workouts: Workout[]): number {
  if (workouts.length < 3) return 0;

  const sortedWorkouts = workouts.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstHalf = sortedWorkouts.slice(0, Math.floor(sortedWorkouts.length / 2));
  const secondHalf = sortedWorkouts.slice(Math.floor(sortedWorkouts.length / 2));

  const firstHalfAvg = firstHalf.reduce((sum, w) => sum + w.difficulty_score, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, w) => sum + w.difficulty_score, 0) / secondHalf.length;

  return secondHalfAvg - firstHalfAvg; // Positive = increasing difficulty, Negative = decreasing
}

function findConsistentlyFailedExercises(workouts: Workout[]): string[] {
  const exerciseFailures: Record<string, number> = {};

  workouts.forEach(workout => {
    workout.planned_exercises.forEach(planned => {
      const completed = workout.completed_exercises.find(c => c.exercise_id === planned.exercise_id);
      
      if (!completed) {
        // Exercise was not completed at all
        exerciseFailures[planned.exercise_id] = (exerciseFailures[planned.exercise_id] || 0) + 1;
      } else {
        // Check if performance was significantly below planned
        let isFailure = false;
        
        if (planned.reps && completed.reps && completed.reps < planned.reps * 0.7) {
          isFailure = true;
        }
        
        if (planned.duration_seconds && completed.duration_seconds && 
            completed.duration_seconds < planned.duration_seconds * 0.7) {
          isFailure = true;
        }

        if (isFailure) {
          exerciseFailures[planned.exercise_id] = (exerciseFailures[planned.exercise_id] || 0) + 1;
        }
      }
    });
  });

  // Return exercises that failed 3 or more times
  return Object.keys(exerciseFailures).filter(exerciseId => exerciseFailures[exerciseId] >= 3);
}

function increaseDifficulty(exercise: WorkoutExercise, exercises: Exercise[]): WorkoutExercise {
  const adapted = { ...exercise };
  
  if (adapted.reps) {
    adapted.reps = Math.floor(adapted.reps * 1.1); // 10% increase
  }
  
  if (adapted.weight) {
    adapted.weight = Math.floor(adapted.weight * 1.05); // 5% increase
  }
  
  if (adapted.duration_seconds) {
    adapted.duration_seconds = Math.floor(adapted.duration_seconds * 1.1); // 10% increase
  }
  
  if (adapted.sets && adapted.sets < 4) {
    adapted.sets += 1; // Add a set if under 4
  }

  return adapted;
}

function decreaseDifficulty(exercise: WorkoutExercise, exercises: Exercise[]): WorkoutExercise {
  const adapted = { ...exercise };
  
  if (adapted.reps && adapted.reps > 5) {
    adapted.reps = Math.max(5, Math.floor(adapted.reps * 0.9)); // 10% decrease, min 5
  }
  
  if (adapted.weight && adapted.weight > 0) {
    adapted.weight = Math.floor(adapted.weight * 0.95); // 5% decrease
  }
  
  if (adapted.duration_seconds && adapted.duration_seconds > 15) {
    adapted.duration_seconds = Math.max(15, Math.floor(adapted.duration_seconds * 0.9)); // 10% decrease, min 15s
  }
  
  if (adapted.sets && adapted.sets > 1) {
    adapted.sets -= 1; // Remove a set if over 1
  }

  return adapted;
}

function replaceWithAlternative(exercise: WorkoutExercise, exercises: Exercise[]): WorkoutExercise {
  const originalExercise = exercises.find(e => e.id === exercise.exercise_id);
  if (!originalExercise) return exercise;

  // Find alternative exercises in the same category and similar muscle groups
  const alternatives = exercises.filter(e => 
    e.id !== exercise.exercise_id &&
    e.category === originalExercise.category &&
    e.muscle_groups.some(muscle => originalExercise.muscle_groups.includes(muscle)) &&
    Math.abs(e.difficulty_base - originalExercise.difficulty_base) <= 2
  );

  if (alternatives.length === 0) return exercise;

  // Select a random alternative
  const alternative = alternatives[Math.floor(Math.random() * alternatives.length)];
  
  return {
    ...exercise,
    exercise_id: alternative.id
  };
}