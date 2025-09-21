'use client';

import { AdaptationHistory } from '@/types';
import { TrendingUp, TrendingDown, RefreshCw, Clock } from 'lucide-react';

interface AdaptationInsightsProps {
  adaptations: AdaptationHistory[];
  recentWorkouts: number;
  completionRate: number;
}

export default function AdaptationInsights({ adaptations, recentWorkouts, completionRate }: AdaptationInsightsProps) {
  const getAdaptationIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase_difficulty':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'decrease_difficulty':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'change_exercise':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case 'add_rest':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAdaptationColor = (changeType: string) => {
    switch (changeType) {
      case 'increase_difficulty':
        return 'bg-green-50 border-green-200';
      case 'decrease_difficulty':
        return 'bg-red-50 border-red-200';
      case 'change_exercise':
        return 'bg-blue-50 border-blue-200';
      case 'add_rest':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAdaptationTitle = (changeType: string) => {
    switch (changeType) {
      case 'increase_difficulty':
        return 'Difficulty Increased';
      case 'decrease_difficulty':
        return 'Difficulty Decreased';
      case 'change_exercise':
        return 'Exercise Changed';
      case 'add_rest':
        return 'Rest Day Added';
      default:
        return 'Adaptation Made';
    }
  };

  const getPerformanceMessage = () => {
    if (completionRate >= 0.9) {
      return {
        message: "Excellent performance! You're crushing your workouts.",
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    } else if (completionRate >= 0.7) {
      return {
        message: "Good progress! Keep up the consistent effort.",
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    } else if (completionRate >= 0.5) {
      return {
        message: "Making progress. Consider adjusting your routine.",
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    } else {
      return {
        message: "Let's optimize your routine for better success.",
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    }
  };

  const performanceInfo = getPerformanceMessage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adaptation Insights</h3>
      
      {/* Performance Summary */}
      <div className={`p-4 rounded-lg border ${performanceInfo.bgColor} mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${performanceInfo.color}`}>
              {performanceInfo.message}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {recentWorkouts} workouts completed • {(completionRate * 100).toFixed(0)}% completion rate
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {(completionRate * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Adaptations */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Adaptations</h4>
        {adaptations.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No adaptations yet. Complete more workouts to see how your routine evolves!
          </p>
        ) : (
          <div className="space-y-3">
            {adaptations.slice(0, 5).map((adaptation) => (
              <div
                key={adaptation.id}
                className={`p-3 rounded-lg border ${getAdaptationColor(adaptation.change_type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAdaptationIcon(adaptation.change_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {getAdaptationTitle(adaptation.change_type)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {adaptation.reason}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(adaptation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h4 className="font-medium text-indigo-900 mb-2">💡 AI Insight</h4>
        <p className="text-sm text-indigo-800">
          {completionRate > 0.8 
            ? "Your consistency is excellent! Consider adding more challenging exercises to continue progressing."
            : completionRate > 0.6
            ? "You're building good habits. Focus on completing full workouts before increasing difficulty."
            : "Consider starting with shorter, easier workouts to build momentum and confidence."
          }
        </p>
      </div>
    </div>
  );
}