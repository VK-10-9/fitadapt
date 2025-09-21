'use client';

import { WorkoutExercise, Exercise } from '@/types';
import { Clock, Target, Weight } from 'lucide-react';

interface WorkoutCardProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onComplete: (completed: WorkoutExercise) => void;
  isActive?: boolean;
}

export default function WorkoutCard({ exercise, workoutExercise, onComplete, isActive = false }: WorkoutCardProps) {
  const handleComplete = () => {
    const completed: WorkoutExercise = {
      ...workoutExercise,
      // Mark as completed with current values
    };
    onComplete(completed);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isActive ? 'border-l-indigo-500 bg-indigo-50' : 'border-l-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{exercise.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          exercise.difficulty_base <= 3 ? 'bg-green-100 text-green-800' :
          exercise.difficulty_base <= 6 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Level {exercise.difficulty_base}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {workoutExercise.sets && workoutExercise.reps && (
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            {workoutExercise.sets} sets × {workoutExercise.reps} reps
          </div>
        )}
        {workoutExercise.weight && (
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="h-4 w-4 mr-2" />
            {workoutExercise.weight} lbs
          </div>
        )}
        {workoutExercise.duration_seconds && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {Math.floor(workoutExercise.duration_seconds / 60)}:{(workoutExercise.duration_seconds % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700">{exercise.instructions}</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {exercise.muscle_groups.map((muscle) => (
          <span
            key={muscle}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
          >
            {muscle}
          </span>
        ))}
      </div>

      {isActive && (
        <button
          onClick={handleComplete}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}