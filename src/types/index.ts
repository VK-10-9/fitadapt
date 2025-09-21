export interface User {
  id: string;
  email: string;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  equipment: string[];
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscle_groups: string[];
  equipment_needed: string[];
  difficulty_base: number;
  instructions: string;
}

export interface WorkoutExercise {
  exercise_id: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
}

export interface Workout {
  id: string;
  user_id: string;
  planned_exercises: WorkoutExercise[];
  completed_exercises: WorkoutExercise[];
  difficulty_score: number;
  completion_rate: number;
  date: string;
  duration_minutes: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  weight_used?: number;
  reps_completed?: number;
  duration_seconds?: number;
  perceived_difficulty: number;
  date: string;
}

export interface AdaptationHistory {
  id: string;
  user_id: string;
  change_type: 'increase_difficulty' | 'decrease_difficulty' | 'change_exercise' | 'add_rest';
  reason: string;
  previous_value: Record<string, unknown>;
  new_value: Record<string, unknown>;
  created_at: string;
}

export interface WorkoutSession {
  workout: Workout;
  exercises: Exercise[];
  currentExerciseIndex: number;
  startTime: Date;
  isActive: boolean;
}