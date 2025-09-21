# 📚 API Documentation

## Database Schema

FitAdapt uses Supabase (PostgreSQL) with Row Level Security for data management. Below is the complete database schema and API reference.

## 🗄️ Database Tables

### 1. Users Table

Extended user profile information beyond Supabase Auth.

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  goals TEXT[] DEFAULT ARRAY['general_fitness'],
  equipment TEXT[] DEFAULT ARRAY['bodyweight'],
  height TEXT,
  weight TEXT,
  age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID, Primary key linked to auth.users
- `email`: User's email address
- `full_name`: User's display name
- `fitness_level`: beginner | intermediate | advanced
- `goals`: Array of fitness goals (strength, cardio, weight_loss, muscle_gain, endurance)
- `equipment`: Array of available equipment (bodyweight, dumbbells, resistance_bands, pull_up_bar, full_gym)
- `height`: User's height (e.g., "5'10\"")
- `weight`: User's weight (e.g., "175 lbs")
- `age`: User's age in years

### 2. Exercises Table

Master list of all available exercises.

```sql
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  equipment_needed TEXT[] DEFAULT ARRAY['bodyweight'],
  difficulty_base INTEGER CHECK (difficulty_base >= 1 AND difficulty_base <= 10) DEFAULT 5,
  instructions TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: Auto-incrementing primary key
- `name`: Exercise name (e.g., "Push-ups", "Squats")
- `category`: Exercise category (strength, cardio, flexibility, balance)
- `muscle_groups`: Array of targeted muscle groups
- `equipment_needed`: Array of required equipment
- `difficulty_base`: Base difficulty level (1-10)
- `instructions`: Step-by-step exercise instructions
- `video_url`: Optional video demonstration URL

### 3. Workouts Table

Generated workout sessions.

```sql
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL,
  estimated_duration INTEGER NOT NULL,
  difficulty_level INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Exercise JSON Structure:**
```typescript
{
  exercise_id: number;
  name: string;
  sets: number;
  reps: number;
  duration: number; // in seconds
  rest_time: number; // in seconds
  weight?: number; // optional for strength exercises
  distance?: number; // optional for cardio exercises
}
```

**Columns:**
- `id`: UUID primary key
- `user_id`: Reference to the user
- `name`: Workout name (e.g., "Upper Body Strength")
- `exercises`: JSONB array of exercise details
- `estimated_duration`: Total workout time in minutes
- `difficulty_level`: Overall workout difficulty (1-10)
- `status`: Current workout status
- `scheduled_for`: When the workout is planned
- `started_at`: When user started the workout
- `completed_at`: When workout was finished

### 4. User Progress Table

Tracks individual exercise performance over time.

```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workout_id UUID REFERENCES workouts(id) NOT NULL,
  exercise_id INTEGER REFERENCES exercises(id) NOT NULL,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER DEFAULT 0,
  reps_completed INTEGER DEFAULT 0,
  weight_used DECIMAL,
  duration_seconds INTEGER,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: UUID primary key
- `user_id`: Reference to the user
- `workout_id`: Reference to the workout session
- `exercise_id`: Reference to the exercise
- `sets_completed`: Number of sets actually completed
- `reps_completed`: Number of reps actually completed
- `weight_used`: Weight used for the exercise
- `duration_seconds`: Time spent on the exercise
- `difficulty_rating`: User's subjective difficulty rating (1-5)
- `notes`: Optional user notes

### 5. Adaptation History Table

Tracks how the algorithm adapts workouts based on performance.

```sql
CREATE TABLE adaptation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  adaptation_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Adaptation Types:**
- `difficulty_increase`: Workout difficulty was increased
- `difficulty_decrease`: Workout difficulty was decreased
- `exercise_substitution`: Exercise was replaced with alternative
- `rest_day_added`: Recovery day was inserted
- `volume_adjustment`: Sets/reps were modified

## 🔐 Row Level Security (RLS) Policies

All tables have RLS enabled to ensure users can only access their own data.

### Users Table Policies
```sql
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Workouts Table Policies
```sql
-- Users can manage their own workouts
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);
```

### User Progress Table Policies
```sql
-- Users can manage their own progress data
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### Adaptation History Table Policies
```sql
-- Users can view their own adaptation history
CREATE POLICY "Users can view own adaptations" ON adaptation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adaptations" ON adaptation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Exercises Table Policies
```sql
-- All authenticated users can view exercises
CREATE POLICY "Authenticated users can view exercises" ON exercises
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 🚀 API Usage Examples

### Authentication

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### User Profile Management

```typescript
// Get user profile
const { data: profile, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single();

// Update user profile
const { data, error } = await supabase
  .from('users')
  .update({
    fitness_level: 'intermediate',
    goals: ['strength', 'muscle_gain'],
    equipment: ['dumbbells', 'resistance_bands']
  })
  .eq('id', user.id);
```

### Workout Management

```typescript
// Create a new workout
const { data, error } = await supabase
  .from('workouts')
  .insert({
    user_id: user.id,
    name: 'Upper Body Strength',
    exercises: [
      {
        exercise_id: 1,
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        rest_time: 60
      }
    ],
    estimated_duration: 30,
    difficulty_level: 5
  });

// Get user's workouts
const { data: workouts, error } = await supabase
  .from('workouts')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Update workout status
const { data, error } = await supabase
  .from('workouts')
  .update({ 
    status: 'completed',
    completed_at: new Date().toISOString()
  })
  .eq('id', workoutId);
```

### Progress Tracking

```typescript
// Record exercise completion
const { data, error } = await supabase
  .from('user_progress')
  .insert({
    user_id: user.id,
    workout_id: workoutId,
    exercise_id: exerciseId,
    exercise_name: 'Push-ups',
    sets_completed: 3,
    reps_completed: 12,
    difficulty_rating: 3,
    notes: 'Felt good, could do more reps'
  });

// Get progress data for charts
const { data: progress, error } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id)
  .gte('completed_at', thirtyDaysAgo)
  .order('completed_at', { ascending: true });
```

### Exercise Library

```typescript
// Get all exercises
const { data: exercises, error } = await supabase
  .from('exercises')
  .select('*')
  .order('name');

// Filter exercises by equipment
const { data: bodyweightExercises, error } = await supabase
  .from('exercises')
  .select('*')
  .contains('equipment_needed', ['bodyweight']);

// Filter exercises by muscle group
const { data: chestExercises, error } = await supabase
  .from('exercises')
  .select('*')
  .contains('muscle_groups', ['chest']);
```

## 📊 Real-time Subscriptions

Subscribe to real-time updates for live data.

```typescript
// Subscribe to workout updates
const workoutSubscription = supabase
  .channel('workout-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'workouts',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('Workout updated:', payload);
  })
  .subscribe();

// Subscribe to progress updates
const progressSubscription = supabase
  .channel('progress-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'user_progress',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('New progress recorded:', payload);
  })
  .subscribe();

// Cleanup subscriptions
workoutSubscription.unsubscribe();
progressSubscription.unsubscribe();
```

## 🔍 Common Queries

### Get User's Recent Workouts
```sql
SELECT w.*, COUNT(up.id) as exercises_completed
FROM workouts w
LEFT JOIN user_progress up ON w.id = up.workout_id
WHERE w.user_id = $1
  AND w.created_at >= NOW() - INTERVAL '30 days'
GROUP BY w.id
ORDER BY w.created_at DESC;
```

### Calculate Completion Rate
```sql
SELECT 
  exercise_name,
  AVG(CASE WHEN sets_completed > 0 THEN 1.0 ELSE 0.0 END) as completion_rate,
  AVG(difficulty_rating) as avg_difficulty
FROM user_progress
WHERE user_id = $1
  AND completed_at >= NOW() - INTERVAL '7 days'
GROUP BY exercise_name;
```

### Get Progress Trends
```sql
SELECT 
  DATE(completed_at) as date,
  COUNT(*) as exercises_completed,
  AVG(difficulty_rating) as avg_difficulty,
  SUM(duration_seconds) as total_duration
FROM user_progress
WHERE user_id = $1
  AND completed_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(completed_at)
ORDER BY date;
```

## 🛠️ Database Functions

### Create User Profile Function
```sql
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
```

## 📈 Performance Optimization

### Indexes
```sql
-- Improve query performance
CREATE INDEX idx_workouts_user_created ON workouts(user_id, created_at DESC);
CREATE INDEX idx_progress_user_completed ON user_progress(user_id, completed_at DESC);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment_needed);
CREATE INDEX idx_exercises_muscles ON exercises USING GIN(muscle_groups);
```

### Materialized Views
```sql
-- Pre-calculated user statistics
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  user_id,
  COUNT(DISTINCT workout_id) as total_workouts,
  AVG(difficulty_rating) as avg_difficulty,
  SUM(duration_seconds) as total_exercise_time,
  MAX(completed_at) as last_workout_date
FROM user_progress
GROUP BY user_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_stats;
```

This API documentation provides a complete reference for working with the FitAdapt database and implementing new features.