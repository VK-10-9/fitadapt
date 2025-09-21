# 🏋️‍♂️ FitAdapt - Personal Workout Coach

> An intelligent fitness application that adapts to your progress, creating personalized workouts that evolve with your fitness journey.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)

![FitAdapt Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=FitAdapt+Workout+Planner)

## 🚀 Features

- **Smart Adaptation**: Workouts automatically adjust based on your performance and progress
- **Progress Tracking**: Detailed insights into your fitness journey with visual progress charts
- **Personalized**: Tailored to your fitness level, goals, and available equipment
- **Real-time Feedback**: Exercise timers and completion tracking
- **Achievement System**: Unlock achievements as you reach fitness milestones

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fitadapt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and anon key
3. Go to SQL Editor and run the schema from `schema.sql`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── workout/          # Workout session page
│   ├── progress/         # Progress tracking page
│   └── profile/          # User profile settings
├── components/           # Reusable UI components
│   ├── AuthForm.tsx      # Login/signup form
│   ├── WorkoutCard.tsx   # Exercise card component
│   ├── ProgressChart.tsx # Progress visualization
│   ├── ExerciseTimer.tsx # Workout timer
│   └── AdaptationInsights.tsx # AI insights
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/              # Custom React hooks
│   ├── useWorkoutData.ts # Workout data management
│   └── useAdaptation.ts  # Adaptation algorithm
├── lib/               # Utility libraries
│   └── supabase.ts    # Supabase client
├── types/             # TypeScript type definitions
│   └── index.ts       # All type definitions
└── utils/             # Utility functions
    ├── workoutGenerator.ts    # Workout generation logic
    └── adaptationAlgorithm.ts # Adaptation algorithm
```

## 🎯 Core Features Explained

### Adaptive Algorithm

The system uses performance metrics to automatically adjust workouts:

- **Increase Difficulty**: When you consistently complete 90%+ of exercises
- **Decrease Difficulty**: When completion rate drops below 70%
- **Exercise Substitution**: Replace exercises that consistently fail
- **Rest Day Insertion**: Add recovery when showing signs of overtraining

### Workout Generation

Workouts are generated based on:
- User fitness level (beginner/intermediate/advanced)
- Selected goals (strength, cardio, weight loss, etc.)
- Available equipment
- Recent performance history
- Muscle group rotation for balanced training

### Progress Tracking

Track multiple metrics:
- Exercise performance (weight, reps, duration)
- Completion rates and consistency
- Visual progress charts
- Achievement unlocks

## 🔧 Customization

### Adding New Exercises

Add exercises to the `exercises` table in Supabase:

```sql
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_base, instructions)
VALUES ('New Exercise', 'strength', ARRAY['chest'], ARRAY['dumbbells'], 5, 'Exercise instructions here');
```

### Modifying Adaptation Rules

Edit the adaptation logic in `src/utils/adaptationAlgorithm.ts`:

```typescript
// Example: Change difficulty increase threshold
if (metrics.completionRate >= 0.95) { // Changed from 0.9 to 0.95
  // Trigger difficulty increase
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📈 Future Enhancements

- [ ] AI-powered form analysis with computer vision
- [ ] Social features and workout sharing
- [ ] Wearable device integration
- [ ] Nutrition planning integration
- [ ] Advanced analytics and ML models
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for hackathon demonstration
- Inspired by modern fitness apps and adaptive learning systems
- Uses open-source libraries and tools from the React/Next.js ecosystem

## 📞 Support

For support, email support@fitadapt.com or create an issue on GitHub.

---

**Happy Training! 💪**
