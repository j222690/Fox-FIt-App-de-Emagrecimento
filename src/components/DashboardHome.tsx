import { motion } from 'framer-motion';
import { useAppStore, calculateBMI, calculateBodyFat } from '@/stores/useAppStore';
import { Flame, Zap, Trophy, TrendingDown, Dumbbell, UtensilsCrossed, Target, Shield } from 'lucide-react';
import FoxAvatar from '@/components/FoxAvatar';
import type { FoxPose } from '@/components/FoxAvatar';

const motivationalMessages = [
  "Cada treino te aproxima do seu objetivo! 💪",
  "Consistência vence intensidade! 🔥",
  "Seu corpo é seu templo, cuide dele! 🦊",
  "Você é mais forte do que pensa! ⚡",
  "O resultado está mais perto do que imagina! 🎯",
  "Não desista, o melhor está por vir! 🌟",
  "Hoje é dia de evolução! 🚀",
];

export default function DashboardHome() {
  const { profile, nutritionPlan, streak, xp, level, meals, weightHistory, badges, completedExercises, timerState, isAdmin } = useAppStore();
  
  if (!profile || !nutritionPlan) return null;

  const bmi = calculateBMI(profile.weight, profile.height);
  const bodyFat = calculateBodyFat(bmi, profile.age, profile.sex);
  const todayMeals = meals.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const todayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const caloriePercent = Math.min((todayCalories / nutritionPlan.calories) * 100, 100);
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.weight;
  const weightDiff = latestWeight - profile.weight;
  const motivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  // Determine fox pose based on user activity
  let foxPose: FoxPose = 'idle';
  if (timerState === 'running') foxPose = 'pushup';
  else if (timerState === 'rest') foxPose = 'resting';
  else if (completedExercises.length > 0 && timerState === 'idle') foxPose = 'celebrating';
  else if (todayCalories >= nutritionPlan.calories * 0.9) foxPose = 'celebrating';
  else if (streak >= 3) foxPose = 'flexing';

  const levelNames = ['', 'Iniciante', 'Guerreiro', 'Atleta', 'Campeão', 'Mestre', 'Lenda'];
  const xpForNext = [0, 100, 300, 600, 1000, 1500, 2100];
  const currentLevelXp = xpForNext[level - 1] || 0;
  const nextLevelXp = xpForNext[level] || xpForNext[xpForNext.length - 1];
  const xpProgress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Olá,</p>
            {isAdmin && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                <Shield size={10} className="text-red-400" />
                <span className="text-[10px] font-bold text-red-400">ADMIN</span>
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{profile.name} 👋</h1>
        </div>
        <FoxAvatar pose={foxPose} size={56} userStreak={streak} userLevel={level} interactive />
      </div>

      {/* Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary rounded-xl p-3 border border-border"
      >
        <p className="text-sm text-foreground">🦊 <span className="text-fox font-medium">Magrão IA:</span> {motivation}</p>
      </motion.div>

      {/* Streak + Level + XP */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div whileTap={{ scale: 0.95 }} className="bg-secondary rounded-xl p-3 border border-border flex flex-col items-center">
          <Flame className="text-streak mb-1" size={22} />
          <p className="font-display text-xl font-bold text-streak">{streak}</p>
          <p className="text-[10px] text-muted-foreground">Streak</p>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} className="bg-secondary rounded-xl p-3 border border-border flex flex-col items-center">
          <Zap className="text-xp mb-1" size={22} />
          <p className="font-display text-xl font-bold text-xp">{xp}</p>
          <p className="text-[10px] text-muted-foreground">XP</p>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} className="bg-secondary rounded-xl p-3 border border-border flex flex-col items-center">
          <Trophy className="text-pro-gold mb-1" size={22} />
          <p className="font-display text-xl font-bold text-pro-gold">{unlockedBadges}</p>
          <p className="text-[10px] text-muted-foreground">Badges</p>
        </motion.div>
      </div>

      {/* Level bar */}
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Nível {level} — {levelNames[level]}</span>
          <span className="text-xs text-muted-foreground">{xp}/{nextLevelXp} XP</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full gradient-xp rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(xpProgress, 100)}%` }} />
        </div>
      </div>

      {/* Calories ring */}
      <div className="bg-secondary rounded-xl p-5 border border-border">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray={`${caloriePercent}, 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-lg font-bold text-foreground">{todayCalories}</p>
              <p className="text-[10px] text-muted-foreground">kcal</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-display font-bold text-foreground">Calorias hoje</p>
            <p className="text-xs text-muted-foreground">Meta: {nutritionPlan.calories} kcal</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: 'P', val: todayMeals.reduce((s, m) => s + m.protein, 0).toFixed(0), color: 'text-fox' },
                { label: 'C', val: todayMeals.reduce((s, m) => s + m.carbs, 0).toFixed(0), color: 'text-streak' },
                { label: 'G', val: todayMeals.reduce((s, m) => s + m.fat, 0).toFixed(0), color: 'text-xp' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className={`font-bold text-sm ${m.color}`}>{m.val}g</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-neon" />
            <span className="text-xs text-muted-foreground">IMC</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{bmi}</p>
          <p className="text-xs text-muted-foreground">
            {bmi < 18.5 ? 'Abaixo' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obeso'}
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-neon" />
            <span className="text-xs text-muted-foreground">Peso</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{latestWeight}kg</p>
          <p className={`text-xs ${weightDiff <= 0 ? 'text-neon' : 'text-destructive'}`}>
            {weightDiff <= 0 ? `${weightDiff}kg` : `+${weightDiff}kg`}
          </p>
        </div>
      </div>

      {/* Body fat */}
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground mb-1">% Gordura corporal (estimado)</p>
        <div className="flex items-end gap-2">
          <p className="font-display text-3xl font-bold text-foreground">{bodyFat}%</p>
          <p className="text-xs text-muted-foreground pb-1">
            {profile.sex === 'male' ? (bodyFat < 15 ? 'Atlético' : bodyFat < 25 ? 'Normal' : 'Acima') : (bodyFat < 22 ? 'Atlético' : bodyFat < 32 ? 'Normal' : 'Acima')}
          </p>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
          <div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min(bodyFat, 50) * 2}%` }} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileTap={{ scale: 0.95 }} className="gradient-primary rounded-xl p-4 shadow-neon cursor-pointer">
          <Dumbbell size={24} className="text-primary-foreground mb-2" />
          <p className="font-display font-bold text-primary-foreground">Treinar agora</p>
          <p className="text-xs text-primary-foreground/70">40+ treinos</p>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} className="gradient-fox rounded-xl p-4 shadow-fox cursor-pointer">
          <UtensilsCrossed size={24} className="text-fox-foreground mb-2" />
          <p className="font-display font-bold text-fox-foreground">Registrar refeição</p>
          <p className="text-xs text-fox-foreground/70">Calorias + macros</p>
        </motion.div>
      </div>
    </div>
  );
}
