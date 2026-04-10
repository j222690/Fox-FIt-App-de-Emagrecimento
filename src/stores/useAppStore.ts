import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  height: number;
  weight: number;
  goalWeight: number;
  deadline: number; // days
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  restrictions: string[];
  goal: 'lose' | 'gain';
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutExercise {
  id: string;
  name: string;
  duration: number; // seconds
  rest: number; // seconds
  illustration: string;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'intense';
  exercises: WorkoutExercise[];
  isPro: boolean;
  estimatedMinutes: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AppState {
  // Admin
  isAdmin: boolean;
  
  // Onboarding
  onboardingComplete: boolean;
  profile: UserProfile | null;
  nutritionPlan: NutritionSummary | null;

  // PRO
  isPro: boolean;
  lastProPopup: number;

  // Gamification
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];

  // Meals
  meals: MealEntry[];
  
  // Weight
  weightHistory: WeightEntry[];

  // Workout timer
  activeWorkoutId: string | null;
  currentExerciseIndex: number;
  timerState: 'idle' | 'running' | 'paused' | 'rest';
  timerStartTimestamp: number | null;
  timerElapsed: number;
  completedExercises: string[];

  // Weekly menu
  weeklyMenuCompleted: Record<string, boolean>;

  // Actions
  setProfile: (p: UserProfile) => void;
  setNutritionPlan: (n: NutritionSummary) => void;
  completeOnboarding: () => void;
  setPro: (v: boolean) => void;
  setLastProPopup: (t: number) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  addMeal: (m: MealEntry) => void;
  addWeight: (w: WeightEntry) => void;
  unlockBadge: (id: string) => void;
  setActiveWorkout: (id: string | null) => void;
  setCurrentExerciseIndex: (i: number) => void;
  setTimerState: (s: 'idle' | 'running' | 'paused' | 'rest') => void;
  setTimerStartTimestamp: (t: number | null) => void;
  setTimerElapsed: (e: number) => void;
  completeExercise: (id: string) => void;
  toggleWeeklyMenu: (day: string) => void;
}

const XP_PER_LEVEL = [0, 100, 300, 600, 1000, 1500, 2100];

const defaultBadges: Badge[] = [
  { id: 'first_workout', name: 'Primeiro Treino', description: 'Complete seu primeiro treino', icon: '💪', unlocked: false },
  { id: 'streak_3', name: '3 Dias Seguidos', description: 'Mantenha 3 dias de streak', icon: '🔥', unlocked: false },
  { id: 'streak_7', name: 'Semana Perfeita', description: '7 dias seguidos', icon: '⭐', unlocked: false },
  { id: 'streak_30', name: 'Mês de Ferro', description: '30 dias seguidos', icon: '🏆', unlocked: false },
  { id: 'first_meal', name: 'Primeira Refeição', description: 'Registre sua primeira refeição', icon: '🍽️', unlocked: false },
  { id: 'calorie_master', name: 'Mestre Calórico', description: 'Fique dentro da meta por 7 dias', icon: '🎯', unlocked: false },
  { id: 'level_2', name: 'Nível 2', description: 'Alcance o nível 2', icon: '⚡', unlocked: false },
  { id: 'level_3', name: 'Nível 3', description: 'Alcance o nível 3', icon: '🌟', unlocked: false },
  { id: 'level_4', name: 'Nível 4', description: 'Alcance o nível 4', icon: '💎', unlocked: false },
  { id: 'level_5', name: 'Nível 5', description: 'Alcance o nível 5', icon: '👑', unlocked: false },
  { id: 'level_6', name: 'Lenda Fitness', description: 'Alcance o nível máximo', icon: '🦊', unlocked: false },
  { id: '10_workouts', name: '10 Treinos', description: 'Complete 10 treinos', icon: '🏋️', unlocked: false },
  { id: '50_meals', name: '50 Refeições', description: 'Registre 50 refeições', icon: '🥗', unlocked: false },
  { id: 'weight_loss_1', name: '-1kg', description: 'Perca seu primeiro kg', icon: '📉', unlocked: false },
  { id: 'weight_loss_5', name: '-5kg', description: 'Perca 5kg', icon: '🎉', unlocked: false },
  { id: 'recipe_explorer', name: 'Explorador de Receitas', description: 'Veja 20 receitas', icon: '📖', unlocked: false },
  { id: 'early_bird', name: 'Madrugador', description: 'Treine antes das 7h', icon: '🌅', unlocked: false },
  { id: 'night_owl', name: 'Coruja Fitness', description: 'Treine depois das 21h', icon: '🌙', unlocked: false },
  { id: 'hydration', name: 'Hidratado', description: 'Registre água por 7 dias', icon: '💧', unlocked: false },
  { id: 'pro_member', name: 'Membro PRO', description: 'Assine o plano PRO', icon: '✨', unlocked: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      onboardingComplete: false,
      profile: null,
      nutritionPlan: null,
      isPro: false,
      lastProPopup: 0,
      streak: 0,
      xp: 0,
      level: 1,
      badges: defaultBadges,
      meals: [],
      weightHistory: [],
      activeWorkoutId: null,
      currentExerciseIndex: 0,
      timerState: 'idle',
      timerStartTimestamp: null,
      timerElapsed: 0,
      completedExercises: [],
      weeklyMenuCompleted: {},

      setProfile: (p) => set({ profile: p, isAdmin: p.name.trim().toLowerCase() === 'admim090' }),
      setNutritionPlan: (n) => set({ nutritionPlan: n }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setPro: (v) => set({ isPro: v }),
      setLastProPopup: (t) => set({ lastProPopup: t }),
      
      addXp: (amount) => {
        const { xp, level } = get();
        const newXp = xp + amount;
        let newLevel = level;
        for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
          if (newXp >= XP_PER_LEVEL[i]) {
            newLevel = i + 1;
            break;
          }
        }
        set({ xp: newXp, level: Math.min(newLevel, 6) });
      },

      incrementStreak: () => set((s) => ({ streak: s.streak + 1 })),
      
      addMeal: (m) => set((s) => ({ meals: [...s.meals, m] })),
      
      addWeight: (w) => set((s) => ({
        weightHistory: [...s.weightHistory.filter(e => e.date !== w.date), w].sort((a, b) => a.date.localeCompare(b.date))
      })),

      unlockBadge: (id) => set((s) => ({
        badges: s.badges.map(b => b.id === id ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b)
      })),

      setActiveWorkout: (id) => set({ activeWorkoutId: id, currentExerciseIndex: 0, timerState: 'idle', timerElapsed: 0, completedExercises: [] }),
      setCurrentExerciseIndex: (i) => set({ currentExerciseIndex: i }),
      setTimerState: (s) => set({ timerState: s }),
      setTimerStartTimestamp: (t) => set({ timerStartTimestamp: t }),
      setTimerElapsed: (e) => set({ timerElapsed: e }),
      completeExercise: (id) => set((s) => ({ completedExercises: [...s.completedExercises, id] })),
      toggleWeeklyMenu: (day) => set((s) => ({ weeklyMenuCompleted: { ...s.weeklyMenuCompleted, [day]: !s.weeklyMenuCompleted[day] } })),
    }),
    { name: 'seca30d-storage' }
  )
);

export function calculateNutrition(profile: UserProfile): NutritionSummary {
  const { sex, weight, height, age, activityLevel, goal } = profile;
  // TMB (Harris-Benedict)
  let tmb = sex === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  
  const factors: Record<string, number> = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
  };
  let tdee = tmb * factors[activityLevel];
  
  if (goal === 'lose') tdee -= 500;
  else tdee += 300;

  const calories = Math.round(tdee);
  const protein = Math.round(weight * (goal === 'gain' ? 2.2 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

  return { calories, protein, carbs, fat };
}

export function calculateBMI(weight: number, height: number): number {
  const h = height / 100;
  return Math.round((weight / (h * h)) * 10) / 10;
}

export function calculateBodyFat(bmi: number, age: number, sex: 'male' | 'female'): number {
  const bf = sex === 'male'
    ? (1.20 * bmi) + (0.23 * age) - 16.2
    : (1.20 * bmi) + (0.23 * age) - 5.4;
  return Math.round(bf * 10) / 10;
}
