-- FitAdapt Database Schema
-- Run this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    goals TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility')) NOT NULL,
    muscle_groups TEXT[] DEFAULT '{}',
    equipment_needed TEXT[] DEFAULT '{}',
    difficulty_base INTEGER CHECK (difficulty_base >= 1 AND difficulty_base <= 10) DEFAULT 5,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for exercises (public read access)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises" ON exercises
    FOR SELECT TO authenticated USING (true);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    planned_exercises JSONB DEFAULT '[]',
    completed_exercises JSONB DEFAULT '[]',
    difficulty_score INTEGER DEFAULT 5,
    completion_rate DECIMAL(3,2) DEFAULT 0.0,
    date DATE DEFAULT CURRENT_DATE,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts" ON workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
    FOR UPDATE USING (auth.uid() = user_id);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    exercise_id UUID REFERENCES exercises(id) NOT NULL,
    weight_used DECIMAL(5,2),
    reps_completed INTEGER,
    duration_seconds INTEGER,
    perceived_difficulty INTEGER CHECK (perceived_difficulty >= 1 AND perceived_difficulty <= 10),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Adaptation History table
CREATE TABLE IF NOT EXISTS adaptation_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    change_type TEXT CHECK (change_type IN ('increase_difficulty', 'decrease_difficulty', 'change_exercise', 'add_rest')) NOT NULL,
    reason TEXT,
    previous_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE adaptation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own adaptation history" ON adaptation_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adaptation history" ON adaptation_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample exercises
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_base, instructions) VALUES
('Push-ups', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY[], 3, 'Start in plank position, lower body until chest nearly touches floor, push back up'),
('Bodyweight Squats', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[], 2, 'Stand with feet shoulder-width apart, lower hips back and down, return to standing'),
('Plank', 'strength', ARRAY['core', 'shoulders'], ARRAY[], 3, 'Hold straight-arm plank position, keep body in straight line'),
('Jumping Jacks', 'cardio', ARRAY['full body'], ARRAY[], 2, 'Jump feet apart while raising arms overhead, return to starting position'),
('Burpees', 'strength', ARRAY['full body'], ARRAY[], 8, 'Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead'),
('Mountain Climbers', 'cardio', ARRAY['core', 'shoulders', 'legs'], ARRAY[], 4, 'Start in plank, alternate bringing knees to chest rapidly'),
('Lunges', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[], 3, 'Step forward into lunge position, lower back knee toward ground, return to standing'),
('High Knees', 'cardio', ARRAY['legs', 'core'], ARRAY[], 3, 'Run in place bringing knees up toward chest'),
('Dumbbell Bench Press', 'strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['dumbbells'], 5, 'Lie on bench, press dumbbells from chest level to full arm extension'),
('Treadmill Run', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['treadmill'], 4, 'Run at steady pace on treadmill, adjust speed and incline as needed');

-- Create indexes for better performance
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX idx_user_progress_user_exercise ON user_progress(user_id, exercise_id);
CREATE INDEX idx_adaptation_history_user_date ON adaptation_history(user_id, created_at);