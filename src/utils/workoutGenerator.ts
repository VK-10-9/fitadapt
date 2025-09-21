import { Exercise, WorkoutExercise, Workout, User } from '@/types';

export interface WorkoutGenerationParams {
  user: User;
  exercises: Exercise[];
  recentWorkouts: Workout[];
  targetDuration?: number; // minutes
  equipment?: string[];
}

export function generateWorkout(params: WorkoutGenerationParams): Workout {
  const { user, exercises, recentWorkouts, targetDuration = 30, equipment = [] } = params;
  
  // Filter exercises based on user's fitness level and available equipment
  const availableExercises = exercises.filter(exercise => {
    // Check equipment requirements
    const hasRequiredEquipment = exercise.equipment_needed.length === 0 || 
      exercise.equipment_needed.every(eq => equipment.includes(eq));
    
    // Check fitness level appropriateness
    const difficultyMatch = getDifficultyForLevel(user.fitness_level);
    const isAppropriate = exercise.difficulty_base >= difficultyMatch.min && 
                         exercise.difficulty_base <= difficultyMatch.max;
    
    return hasRequiredEquipment && isAppropriate;
  });

  // Get recent exercise performance
  const recentPerformance = getRecentPerformance(recentWorkouts);
  
  // Select exercises based on goals and variety
  const selectedExercises = selectExercisesForWorkout(
    availableExercises, 
    user.goals, 
    recentPerformance,
    targetDuration
  );

  // Generate workout plan
  const plannedExercises: WorkoutExercise[] = selectedExercises.map(exercise => 
    generateExerciseplan(exercise, user, recentPerformance)
  );

  const difficultyScore = calculateWorkoutDifficulty(plannedExercises, exercises);

  return {
    id: `workout-${Date.now()}`,
    user_id: user.id,
    planned_exercises: plannedExercises,
    completed_exercises: [],
    difficulty_score: difficultyScore,
    completion_rate: 0,
    date: new Date().toISOString().split('T')[0],
    duration_minutes: 0
  };
}

function getDifficultyForLevel(fitnessLevel: string) {
  switch (fitnessLevel) {
    case 'beginner':
      return { min: 1, max: 4 };
    case 'intermediate':
      return { min: 3, max: 7 };
    case 'advanced':
      return { min: 6, max: 10 };
    default:
      return { min: 1, max: 5 };
  }
}

function getRecentPerformance(recentWorkouts: Workout[]) {
  const performance: Record<string, {
    completions: number;
    avgWeight: number;
    avgReps: number;
    avgDuration: number;
    weights: number[];
    reps: number[];
    durations: number[];
  }> = {};
  
  recentWorkouts.forEach(workout => {
    workout.completed_exercises.forEach(exercise => {
      if (!performance[exercise.exercise_id]) {
        performance[exercise.exercise_id] = {
          completions: 0,
          avgWeight: 0,
          avgReps: 0,
          avgDuration: 0,
          weights: [],
          reps: [],
          durations: []
        };
      }
      
      const perf = performance[exercise.exercise_id];
      perf.completions++;
      
      if (exercise.weight) perf.weights.push(exercise.weight);
      if (exercise.reps) perf.reps.push(exercise.reps);
      if (exercise.duration_seconds) perf.durations.push(exercise.duration_seconds);
    });
  });

  // Calculate averages
  Object.keys(performance).forEach(exerciseId => {
    const perf = performance[exerciseId];
    perf.avgWeight = perf.weights.length > 0 ? 
      perf.weights.reduce((a: number, b: number) => a + b, 0) / perf.weights.length : 0;
    perf.avgReps = perf.reps.length > 0 ? 
      perf.reps.reduce((a: number, b: number) => a + b, 0) / perf.reps.length : 0;
    perf.avgDuration = perf.durations.length > 0 ? 
      perf.durations.reduce((a: number, b: number) => a + b, 0) / perf.durations.length : 0;
  });

  return performance;
}

function selectExercisesForWorkout(
  exercises: Exercise[],
  goals: string[],
  recentPerformance: Record<string, {
    completions: number;
    avgWeight: number;
    avgReps: number;
    avgDuration: number;
    weights: number[];
    reps: number[];
    durations: number[];
  }>,
  targetDuration: number
): Exercise[] {
  const selectedExercises: Exercise[] = [];
  const targetCount = Math.floor(targetDuration / 6); // ~6 minutes per exercise including rest
  
  // Categorize exercises by goal alignment
  const strengthExercises = exercises.filter(e => e.category === 'strength');
  const cardioExercises = exercises.filter(e => e.category === 'cardio');
  const flexibilityExercises = exercises.filter(e => e.category === 'flexibility');
  
  // Determine exercise distribution based on goals
  let strengthCount = 0, cardioCount = 0, flexibilityCount = 0;
  
  if (goals.includes('strength') || goals.includes('muscle_gain')) {
    strengthCount = Math.ceil(targetCount * 0.6);
    cardioCount = Math.floor(targetCount * 0.3);
    flexibilityCount = Math.max(1, targetCount - strengthCount - cardioCount);
  } else if (goals.includes('cardio') || goals.includes('weight_loss')) {
    cardioCount = Math.ceil(targetCount * 0.6);
    strengthCount = Math.floor(targetCount * 0.3);
    flexibilityCount = Math.max(1, targetCount - cardioCount - strengthCount);
  } else {
    // Balanced approach
    strengthCount = Math.floor(targetCount * 0.4);
    cardioCount = Math.floor(targetCount * 0.4);
    flexibilityCount = Math.max(1, targetCount - strengthCount - cardioCount);
  }

  // Select exercises avoiding recent repeats
  const recentExerciseIds = Object.keys(recentPerformance);
  
  // Add strength exercises
  const availableStrength = strengthExercises.filter(e => 
    !recentExerciseIds.includes(e.id) || recentExerciseIds.length < 3
  );
  selectedExercises.push(...selectVariedExercises(availableStrength, strengthCount));
  
  // Add cardio exercises
  const availableCardio = cardioExercises.filter(e => 
    !recentExerciseIds.includes(e.id) || recentExerciseIds.length < 3
  );
  selectedExercises.push(...selectVariedExercises(availableCardio, cardioCount));
  
  // Add flexibility exercises
  const availableFlexibility = flexibilityExercises.filter(e => 
    !recentExerciseIds.includes(e.id) || recentExerciseIds.length < 3
  );
  selectedExercises.push(...selectVariedExercises(availableFlexibility, flexibilityCount));

  return selectedExercises.slice(0, targetCount);
}

function selectVariedExercises(exercises: Exercise[], count: number): Exercise[] {
  if (exercises.length === 0) return [];
  
  // Group by muscle groups to ensure variety
  const muscleGroupMap: Record<string, Exercise[]> = {};
  exercises.forEach(exercise => {
    exercise.muscle_groups.forEach(muscle => {
      if (!muscleGroupMap[muscle]) muscleGroupMap[muscle] = [];
      muscleGroupMap[muscle].push(exercise);
    });
  });

  const selected: Exercise[] = [];
  const usedMuscleGroups = new Set<string>();
  
  // First pass: select from different muscle groups
  while (selected.length < count && Object.keys(muscleGroupMap).length > usedMuscleGroups.size) {
    for (const muscle of Object.keys(muscleGroupMap)) {
      if (usedMuscleGroups.has(muscle) || selected.length >= count) continue;
      
      const availableExercises = muscleGroupMap[muscle].filter(e => !selected.includes(e));
      if (availableExercises.length > 0) {
        selected.push(availableExercises[Math.floor(Math.random() * availableExercises.length)]);
        usedMuscleGroups.add(muscle);
      }
    }
  }

  // Second pass: fill remaining slots
  while (selected.length < count && selected.length < exercises.length) {
    const remaining = exercises.filter(e => !selected.includes(e));
    if (remaining.length > 0) {
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    } else {
      break;
    }
  }

  return selected;
}

function generateExerciseplan(
  exercise: Exercise, 
  user: User, 
  recentPerformance: Record<string, {
    completions: number;
    avgWeight: number;
    avgReps: number;
    avgDuration: number;
    weights: number[];
    reps: number[];
    durations: number[];
  }>
): WorkoutExercise {
  const baseplan: WorkoutExercise = {
    exercise_id: exercise.id,
    rest_seconds: 60
  };

  // Get previous performance for this exercise
  const previousPerf = recentPerformance[exercise.id];
  
  if (exercise.category === 'strength') {
    // For strength exercises, set sets and reps
    const sets = 3;
    let reps = getBaseRepsForExercise(exercise, user.fitness_level);
    let weight = 0;

    if (previousPerf) {
      // Adapt based on previous performance
      reps = Math.max(reps, Math.floor(previousPerf.avgReps * 1.1)); // 10% increase
      weight = previousPerf.avgWeight || 0;
      
      if (weight > 0) {
        weight = Math.floor(weight * 1.05); // 5% weight increase
      }
    }

    baseplan.sets = sets;
    baseplan.reps = reps;
    if (weight > 0) baseplan.weight = weight;
    
  } else if (exercise.category === 'cardio') {
    // For cardio exercises, set duration
    let duration = getBaseDurationForExercise(exercise, user.fitness_level);
    
    if (previousPerf && previousPerf.avgDuration > 0) {
      duration = Math.max(duration, Math.floor(previousPerf.avgDuration * 1.1)); // 10% increase
    }
    
    baseplan.duration_seconds = duration;
    
  } else if (exercise.category === 'flexibility') {
    // For flexibility exercises, set hold duration
    baseplan.duration_seconds = 30 + (user.fitness_level === 'advanced' ? 15 : 0);
  }

  return baseplan;
}

function getBaseRepsForExercise(exercise: Exercise, fitnessLevel: string): number {
  const baseReps: Record<string, number> = {
    'beginner': 8,
    'intermediate': 12,
    'advanced': 15
  };
  
  const base = baseReps[fitnessLevel] || 10;
  
  // Adjust based on exercise difficulty
  const difficultyMultiplier = (11 - exercise.difficulty_base) / 10;
  return Math.max(5, Math.floor(base * difficultyMultiplier));
}

function getBaseDurationForExercise(exercise: Exercise, fitnessLevel: string): number {
  const baseDurations: Record<string, number> = {
    'beginner': 30,
    'intermediate': 45,
    'advanced': 60
  };
  
  return baseDurations[fitnessLevel] || 30;
}

function calculateWorkoutDifficulty(plannedExercises: WorkoutExercise[], exercises: Exercise[]): number {
  if (plannedExercises.length === 0) return 5;
  
  const totalDifficulty = plannedExercises.reduce((sum, workoutEx) => {
    const exercise = exercises.find(e => e.id === workoutEx.exercise_id);
    if (!exercise) return sum;
    
    let exerciseDifficulty = exercise.difficulty_base;
    
    // Adjust for volume
    if (workoutEx.sets && workoutEx.reps) {
      const volume = workoutEx.sets * workoutEx.reps;
      exerciseDifficulty += Math.floor(volume / 20); // Every 20 reps adds 1 difficulty
    }
    
    if (workoutEx.duration_seconds) {
      exerciseDifficulty += Math.floor(workoutEx.duration_seconds / 30); // Every 30 seconds adds 1 difficulty
    }
    
    return sum + Math.min(10, exerciseDifficulty);
  }, 0);
  
  return Math.min(10, Math.floor(totalDifficulty / plannedExercises.length));
}