'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Activity, Target, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">FitAdapt</span>
            </div>
            <button
              onClick={() => router.push('/auth')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your <span className="text-indigo-600">Personal</span> Workout Coach
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of fitness with AI-powered workouts that adapt to your progress, 
            schedule, and goals. Get stronger, faster, and more confident with personalized training.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg"
          >
            Start Your Journey
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Adaptation</h3>
            <p className="text-gray-600">
              Workouts automatically adjust based on your performance, ensuring optimal challenge and progress.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Detailed analytics and insights help you understand your fitness journey and celebrate wins.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Plans</h3>
            <p className="text-gray-600">
              Every workout is tailored to your fitness level, available equipment, and time constraints.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who are already experiencing the power of adaptive training.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200 shadow-lg"
          >
            Start Free Today
          </button>
        </div>
      </main>
    </div>
  );
}