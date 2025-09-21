# 🔧 Setup Guide

This guide will walk you through setting up FitAdapt from scratch, including Supabase configuration, environment setup, and deployment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** - VS Code recommended

## 🚀 Step 1: Project Setup

### 1.1 Clone the Repository

```bash
git clone https://github.com/yourusername/fitadapt.git
cd fitadapt
```

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Verify Installation

```bash
npm run dev
```

You should see the Next.js development server start. Visit `http://localhost:3000` to see the landing page.

> ⚠️ **Note**: The app won't be fully functional until you configure Supabase.

## 🗄️ Step 2: Supabase Setup

### 2.1 Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### 2.2 Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `fitadapt` or your preferred name
   - **Database Password**: Generate a secure password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

4. Click "Create new project"
5. Wait 1-2 minutes for the project to be ready

### 2.3 Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API Keys** → `anon` `public` key
   - **Project API Keys** → `service_role` `secret` key (optional, for admin operations)

### 2.4 Configure Environment Variables

1. In your project root, create a `.env.local` file:

```bash
touch .env.local
```

2. Add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> 🔒 **Security Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 🗃️ Step 3: Database Setup

### 3.1 Open SQL Editor

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"

### 3.2 Run the Schema

1. Copy the entire contents of `schema.sql` from your project
2. Paste it into the SQL editor
3. Click "Run" to execute

This will create:
- All necessary tables (users, exercises, workouts, user_progress, adaptation_history)
- Row Level Security policies
- Sample exercise data
- Database functions and triggers

### 3.3 Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `exercises` (with sample data)
   - `users`
   - `workouts`
   - `user_progress`
   - `adaptation_history`

3. Click on `exercises` table - you should see sample exercises like "Push-ups", "Squats", etc.

## 🔐 Step 4: Authentication Configuration

### 4.1 Configure Auth Settings

1. In Supabase, go to **Authentication** → **Settings**
2. Under **General settings**:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`

### 4.2 Enable Email Confirmation (Optional)

For production, you may want to enable email confirmation:

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**:
   - Toggle "Enable email confirmations"
   - Configure email templates if desired

### 4.3 Test Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Get Started" → Sign up with a test email
4. Check if the user appears in **Authentication** → **Users**

## 🧪 Step 5: Testing the Application

### 5.1 Test User Registration

1. Visit `http://localhost:3000`
2. Click "Get Started"
3. Create a new account
4. You should be redirected to the dashboard

### 5.2 Test Workout Generation

1. On the dashboard, click "Start Today's Workout"
2. A workout should be generated with exercises
3. Click through the workout to test the timer and completion

### 5.3 Test Progress Tracking

1. Complete a workout or exercise
2. Go to the Progress page
3. You should see charts with your data

### 5.4 Test Profile Management

1. Go to the Profile page
2. Update your fitness level, goals, and equipment
3. Save the changes
4. Generate a new workout to see how it adapts

## 🚀 Step 6: Production Deployment

### 6.1 Prepare for Production

1. Update Supabase auth settings:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production callback URL

2. Update environment variables for production

### 6.2 Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add your environment variables

4. **Custom Domain** (optional):
   - Add your custom domain in Vercel
   - Update Supabase auth settings

### 6.3 Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables in site settings

## 🔧 Step 7: Advanced Configuration

### 7.1 Custom Exercise Data

Add your own exercises to the database:

```sql
INSERT INTO exercises (
  name, 
  category, 
  muscle_groups, 
  equipment_needed, 
  difficulty_base, 
  instructions
) VALUES (
  'Custom Exercise',
  'strength',
  ARRAY['chest', 'triceps'],
  ARRAY['dumbbells'],
  6,
  'Your exercise instructions here'
);
```

### 7.2 Customize Adaptation Algorithm

Edit `src/utils/adaptationAlgorithm.ts` to modify how workouts adapt:

```typescript
// Modify thresholds
const DIFFICULTY_INCREASE_THRESHOLD = 0.9; // Increase from 90% completion
const DIFFICULTY_DECREASE_THRESHOLD = 0.7; // Decrease below 70% completion
```

### 7.3 Add New Workout Goals

1. Update the user goals enum in `src/types/database.ts`
2. Modify workout generation logic in `src/utils/workoutGenerator.ts`
3. Update the profile form in `src/app/profile/page.tsx`

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Invalid Supabase URL" Error

**Problem**: Environment variables not loading correctly.

**Solution**:
1. Verify `.env.local` is in project root
2. Restart development server: `npm run dev`
3. Check for typos in variable names

#### ❌ "Row Level Security" Errors

**Problem**: RLS policies not properly set up.

**Solution**:
1. Re-run the `schema.sql` file in Supabase
2. Verify policies exist in **Authentication** → **Policies**
3. Check user is properly authenticated

#### ❌ Build Errors

**Problem**: TypeScript or dependency issues.

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### ❌ Database Connection Issues

**Problem**: Can't connect to Supabase.

**Solution**:
1. Verify your project URL and API keys
2. Check if your Supabase project is active
3. Ensure your IP isn't blocked (rare)

### Getting Help

If you encounter issues:

1. **Check the logs**: Look at browser console and terminal output
2. **Verify environment**: Ensure all environment variables are set
3. **Test database**: Use Supabase SQL editor to test queries
4. **GitHub Issues**: Create an issue with error details

## 📊 Monitoring & Analytics

### 7.1 Supabase Analytics

Monitor your app's usage:

1. Go to **Settings** → **Usage**
2. Monitor database size, API requests, and auth users
3. Set up alerts for usage limits

### 7.2 Custom Analytics

Add analytics tracking:

```typescript
// Example: Track workout completions
const trackWorkoutCompletion = async (workoutId: string) => {
  await supabase
    .from('adaptation_history')
    .insert({
      user_id: user.id,
      adaptation_type: 'workout_completed',
      reason: 'User completed workout',
      new_value: { workout_id: workoutId }
    });
};
```

## 🎉 You're Ready!

Congratulations! You now have a fully functional FitAdapt application. Your setup includes:

- ✅ Complete database with sample data
- ✅ User authentication system
- ✅ Adaptive workout generation
- ✅ Progress tracking and analytics
- ✅ Production-ready deployment

### Next Steps

1. **Customize**: Add your own exercises and workout templates
2. **Enhance**: Implement additional features like social sharing
3. **Scale**: Monitor usage and optimize performance
4. **Feedback**: Gather user feedback and iterate

Happy coding! 💪🚀