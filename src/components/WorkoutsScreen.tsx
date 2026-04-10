import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { workouts } from '@/data/workouts';
import { Crown, Play, Lock, ChevronLeft, Timer, CheckCircle2, Pause, SkipForward } from 'lucide-react';
import { useEffect, useRef } from 'react';
import FoxAvatar from '@/components/FoxAvatar';

type View = 'list' | 'detail' | 'active';

export default function WorkoutsScreen() {
  const { isPro, activeWorkoutId, currentExerciseIndex, timerState, timerElapsed, completedExercises,
    setActiveWorkout, setCurrentExerciseIndex, setTimerState, setTimerElapsed, completeExercise, addXp, unlockBadge } = useAppStore();
  const [view, setView] = useState<View>(activeWorkoutId ? 'active' : 'list');
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(activeWorkoutId);
  const [filter, setFilter] = useState('all');
  const intervalRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);

  const workout = workouts.find(w => w.id === selectedWorkout);
  const available = workouts.filter(w => {
    if (filter === 'free') return !w.isPro;
    if (filter === 'pro') return w.isPro;
    return true;
  });

  const currentExercise = workout?.exercises[currentExerciseIndex];
  const isRest = timerState === 'rest';
  const targetDuration = isRest ? (currentExercise?.rest || 15) : (currentExercise?.duration || 40);

  // Timer logic using real timestamps
  useEffect(() => {
    if (timerState === 'running' || timerState === 'rest') {
      startTsRef.current = Date.now() - timerElapsed * 1000;
      intervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - (startTsRef.current || Date.now())) / 1000;
        setTimerElapsed(Math.floor(elapsed));

        if (elapsed >= targetDuration) {
          if (timerState === 'running' && currentExercise) {
            completeExercise(currentExercise.id);
            addXp(10);
            setTimerElapsed(0);
            setTimerState('rest');
          } else if (timerState === 'rest') {
            setTimerElapsed(0);
            if (workout && currentExerciseIndex < workout.exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              setTimerState('running');
            } else {
              setTimerState('idle');
              addXp(50);
              unlockBadge('first_workout');
            }
          }
        }
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerState, currentExerciseIndex, targetDuration]);

  const startWorkout = (id: string) => {
    setActiveWorkout(id);
    setSelectedWorkout(id);
    setTimerState('running');
    setView('active');
  };

  const togglePause = () => {
    if (timerState === 'running' || timerState === 'rest') {
      setTimerState('paused');
    } else if (timerState === 'paused') {
      setTimerState('running');
    }
  };

  const skipExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      if (currentExercise) completeExercise(currentExercise.id);
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimerElapsed(0);
      setTimerState('running');
    } else {
      setTimerState('idle');
      addXp(50);
    }
  };

  const progress = (timerElapsed / targetDuration) * 100;
  const allDone = workout && completedExercises.length >= workout.exercises.length;

  // Active workout view
  if (view === 'active' && workout && currentExercise && !allDone) {
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="flex flex-col items-center gap-6">
          <p className="text-xs text-muted-foreground">{workout.name}</p>
          <p className="text-sm text-muted-foreground">
            Exercício {currentExerciseIndex + 1}/{workout.exercises.length}
          </p>

          <motion.div
            key={currentExercise.id + timerState}
            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <FoxAvatar
              exerciseName={isRest ? undefined : currentExercise.name}
              pose={isRest ? 'resting' : undefined}
              size={120}
              timerProgress={progress / 100}
              interactive
            />
            <p className="font-display text-3xl font-bold text-foreground mt-2">
              {Math.max(targetDuration - timerElapsed, 0)}s
            </p>
          </motion.div>

          <h3 className="font-display text-xl font-bold text-foreground">
            {isRest ? 'Descanso' : currentExercise.name}
          </h3>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isRest ? 'bg-streak' : 'gradient-primary'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex gap-4">
            <button onClick={togglePause}
              className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center">
              {timerState === 'paused' ? <Play size={24} className="text-neon" /> : <Pause size={24} className="text-foreground" />}
            </button>
            <button onClick={skipExercise}
              className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center">
              <SkipForward size={24} className="text-foreground" />
            </button>
          </div>

          {/* Exercise list */}
          <div className="w-full space-y-2 mt-4">
            {workout.exercises.map((ex, i) => (
              <div key={ex.id} className={`flex items-center gap-3 p-3 rounded-xl ${i === currentExerciseIndex ? 'bg-primary/10 border border-primary/30' : 'bg-secondary border border-border'}`}>
                {completedExercises.includes(ex.id) ? (
                  <CheckCircle2 size={18} className="text-neon" />
                ) : i === currentExerciseIndex ? (
                  <Timer size={18} className="text-primary animate-pulse-neon" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border border-muted-foreground" />
                )}
                <span className={`text-sm ${i === currentExerciseIndex ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{ex.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{ex.duration}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Completion view
  if (view === 'active' && allDone) {
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto flex flex-col items-center gap-6 mt-12">
        <FoxAvatar pose="celebrating" size={100} />
        <h2 className="font-display text-2xl font-bold text-foreground">Treino Completo!</h2>
        <p className="text-muted-foreground text-center">Você ganhou <span className="text-xp font-bold">+50 XP</span></p>
        <button onClick={() => { setActiveWorkout(null); setView('list'); }}
          className="py-3 px-8 rounded-xl gradient-primary text-primary-foreground font-display font-bold">
          Voltar aos treinos
        </button>
      </div>
    );
  }

  // Detail view
  if (view === 'detail' && workout) {
    const locked = workout.isPro && !isPro;
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-foreground flex-1">{workout.name}</h2>
            {workout.isPro && <span className="text-xs gradient-pro text-pro-foreground px-2 py-0.5 rounded-full font-bold">PRO</span>}
          </div>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>📂 {workout.category}</span>
            <span>⏱️ {workout.estimatedMinutes} min</span>
            <span>🔥 {workout.difficulty}</span>
          </div>
          <div className="space-y-2">
            {workout.exercises.map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
                <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                <span className="text-sm text-foreground flex-1">{ex.name}</span>
                <span className="text-xs text-muted-foreground">{ex.duration}s + {ex.rest}s rest</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => !locked && startWorkout(workout.id)}
            disabled={locked}
            className={`w-full py-3.5 rounded-xl font-display font-bold flex items-center justify-center gap-2 ${locked ? 'bg-secondary text-muted-foreground' : 'gradient-primary text-primary-foreground shadow-neon'}`}
          >
            {locked ? <><Lock size={18} /> Desbloqueie com PRO</> : <><Play size={18} /> Iniciar treino</>}
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">Treinos 🏋️</h1>

      <div className="flex gap-2">
        {['all', 'free', 'pro'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
            {f === 'all' ? 'Todos' : f === 'free' ? 'Grátis' : '⭐ PRO'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {available.map(w => {
          const locked = w.isPro && !isPro;
          return (
            <motion.button
              key={w.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedWorkout(w.id); setView('detail'); }}
              className="w-full p-4 rounded-xl bg-secondary border border-border text-left flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-2xl flex-shrink-0">
                {locked ? '🔒' : '🏋️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-foreground truncate">{w.name}</p>
                  {w.isPro && <Crown size={14} className="text-pro-gold flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">{w.category} · {w.estimatedMinutes}min · {w.exercises.length} exercícios</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                w.difficulty === 'easy' ? 'bg-green-900/30 text-green-400' :
                w.difficulty === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                w.difficulty === 'hard' ? 'bg-orange-900/30 text-orange-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {w.difficulty === 'easy' ? 'Fácil' : w.difficulty === 'medium' ? 'Médio' : w.difficulty === 'hard' ? 'Difícil' : 'Intenso'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
