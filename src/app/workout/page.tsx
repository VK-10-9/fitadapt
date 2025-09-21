'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import WorkoutCard from '@/components/WorkoutCard';
import ExerciseTimer from '@/components/ExerciseTimer';
import { Play, Pause, SkipForward, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WorkoutSession() {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // Mock workout data
  const workout = {
    id: 'sample-workout',
    exercises: [
      {
        id: '1',
        name: 'Push-ups',
        category: 'strength' as const,
        muscle_groups: ['chest', 'shoulders', 'triceps'],
        equipment_needed: [],
        difficulty_base: 3,
        instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up',
        sets: 3,
        reps: 10,
        rest_seconds: 60
      },
      {
        id: '2',
        name: 'Bodyweight Squats',
        category: 'strength' as const,
        muscle_groups: ['quadriceps', 'glutes', 'hamstrings'],
        equipment_needed: [],
        difficulty_base: 2,
        instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing',
        sets: 3,
        reps: 15,
        rest_seconds: 60
      },
      {
        id: '3',
        name: 'Plank',
        category: 'strength' as const,
        muscle_groups: ['core', 'shoulders'],
        equipment_needed: [],
        difficulty_base: 3,
        instructions: 'Hold straight-arm plank position, keep body in straight line',
        duration_seconds: 30,
        rest_seconds: 60
      }
    ]
  };

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const workoutProgress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  const handleExerciseComplete = () => {
    setCompletedExercises(prev => [...prev, currentExerciseIndex]);
    
    if (isLastExercise) {
      // Workout complete
      setIsWorkoutActive(false);
      alert('Workout completed! Great job! 🎉');
      router.push('/dashboard');
    } else {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleSkipExercise = () => {
    if (!isLastExercise) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-bold text-gray-900">Workout Session</h1>
              <div className="text-sm text-gray-600">
                {currentExerciseIndex + 1} of {workout.exercises.length}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="pb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${workoutProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Exercise */}
            <div className="space-y-6">
              <WorkoutCard
                exercise={currentExercise}
                workoutExercise={{
                  exercise_id: currentExercise.id,
                  sets: currentExercise.sets,
                  reps: currentExercise.reps,
                  duration_seconds: currentExercise.duration_seconds,
                  rest_seconds: currentExercise.rest_seconds
                }}
                onComplete={handleExerciseComplete}
                isActive={true}
              />

              {/* Exercise Controls */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setIsWorkoutActive(!isWorkoutActive)}
                    className={`flex items-center px-6 py-2 rounded-md text-white ${
                      isWorkoutActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isWorkoutActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Workout
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipExercise}
                    disabled={isLastExercise}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Skip
                  </button>
                </div>
              </div>
            </div>

            {/* Rest Timer & Overview */}
            <div className="space-y-6">
              {/* Rest Timer */}
              {currentExercise.rest_seconds && (
                <ExerciseTimer
                  duration={currentExercise.rest_seconds}
                  onComplete={() => console.log('Rest period complete')}
                  autoStart={false}
                />
              )}

              {/* Workout Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Overview</h3>
                <div className="space-y-3">
                  {workout.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        index === currentExerciseIndex
                          ? 'bg-indigo-50 border border-indigo-200'
                          : completedExercises.includes(index)
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{exercise.name}</p>
                        <p className="text-sm text-gray-600">
                          {exercise.sets && exercise.reps && `${exercise.sets} × ${exercise.reps}`}
                          {exercise.duration_seconds && `${exercise.duration_seconds}s`}
                        </p>
                      </div>
                      <div className="text-right">
                        {completedExercises.includes(index) && (
                          <span className="text-green-600 font-medium">✓</span>
                        )}
                        {index === currentExerciseIndex && !completedExercises.includes(index) && (
                          <span className="text-indigo-600 font-medium">→</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress:</span>
                    <span>{completedExercises.length} / {workout.exercises.length} completed</span>
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