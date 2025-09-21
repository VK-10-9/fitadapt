'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  autoStart?: boolean;
}

export default function ExerciseTimer({ duration, onComplete, autoStart = false }: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    if (!isCompleted) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Progress Circle */}
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke={isCompleted ? "#10b981" : "#6366f1"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${
            isCompleted ? 'text-green-600' : 'text-gray-900'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          disabled={isCompleted}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            isCompleted 
              ? 'bg-green-100 text-green-800 cursor-not-allowed'
              : isRunning
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
          }`}
        >
          {isCompleted ? (
            '✓ Complete'
          ) : isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </button>
      </div>

      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">Exercise completed! 🎉</p>
        </div>
      )}
    </div>
  );
}