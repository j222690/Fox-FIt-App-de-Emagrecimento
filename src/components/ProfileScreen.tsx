import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, calculateBMI, calculateBodyFat } from '@/stores/useAppStore';
import { Crown, Settings, Trophy, Flame, Zap, Target, ChevronRight, Shield } from 'lucide-react';
import FoxAvatar from '@/components/FoxAvatar';

export default function ProfileScreen() {
  const { profile, nutritionPlan, isPro, streak, xp, level, badges, weightHistory, isAdmin } = useAppStore();
  const [showBadges, setShowBadges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!profile || !nutritionPlan) return null;

  const bmi = calculateBMI(profile.weight, profile.height);
  const bodyFat = calculateBodyFat(bmi, profile.age, profile.sex);
  const levelNames = ['', 'Iniciante', 'Guerreiro', 'Atleta', 'Campeão', 'Mestre', 'Lenda'];
  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : profile.weight;

  if (showBadges) {
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
        <button onClick={() => setShowBadges(false)} className="text-sm text-muted-foreground">← Voltar</button>
        <h2 className="font-display text-2xl font-bold text-foreground">Conquistas 🏆</h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => (
            <motion.div key={b.id} whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border ${b.unlocked ? 'bg-secondary border-primary/30' : 'bg-muted/50 border-border opacity-50'}`}>
              <p className="text-3xl mb-2">{b.icon}</p>
              <p className="font-display font-bold text-sm text-foreground">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.description}</p>
              {b.unlocked && <p className="text-[10px] text-neon mt-1">✅ Desbloqueado</p>}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
        <button onClick={() => setShowSettings(false)} className="text-sm text-muted-foreground">← Voltar</button>
        <h2 className="font-display text-2xl font-bold text-foreground">Configurações ⚙️</h2>
        {[
          { label: 'Notificações', action: () => {} },
          { label: 'Unidades de medida', action: () => {} },
          { label: 'Idioma', action: () => {} },
          { label: 'Sobre o app', action: () => {} },
          { label: 'Política de privacidade', action: () => {} },
          { label: 'Termos de uso', action: () => {} },
        ].map(s => (
          <button key={s.label} onClick={s.action}
            className="w-full p-4 rounded-xl bg-secondary border border-border text-left flex items-center justify-between">
            <span className="text-sm text-foreground">{s.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
        <button onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          Resetar dados do app
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Perfil</h1>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl bg-secondary border border-border">
          <Settings size={20} className="text-foreground" />
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-secondary rounded-2xl p-5 border border-border relative overflow-hidden">
        {(isPro || isAdmin) && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {isAdmin && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                <Shield size={12} className="text-red-400" />
                <span className="text-[10px] font-bold text-red-400">ADMIN</span>
              </span>
            )}
            {isPro && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full gradient-pro">
                <Crown size={12} className="text-pro-foreground" />
                <span className="text-[10px] font-bold text-pro-foreground">PRO</span>
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-4">
          <FoxAvatar pose={isAdmin ? 'flexing' : 'wave'} size={64} />
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">Nível {level} — {levelNames[level]}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary rounded-xl p-3 border border-border text-center">
          <Flame className="mx-auto text-streak" size={20} />
          <p className="font-display font-bold text-foreground">{streak}</p>
          <p className="text-[10px] text-muted-foreground">Streak</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 border border-border text-center">
          <Zap className="mx-auto text-xp" size={20} />
          <p className="font-display font-bold text-foreground">{xp}</p>
          <p className="text-[10px] text-muted-foreground">XP</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 border border-border text-center">
          <Trophy className="mx-auto text-pro-gold" size={20} />
          <p className="font-display font-bold text-foreground">{badges.filter(b => b.unlocked).length}/{badges.length}</p>
          <p className="text-[10px] text-muted-foreground">Badges</p>
        </div>
      </div>

      {/* Body stats */}
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <p className="font-display font-bold text-foreground mb-3">Dados corporais</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Peso atual', value: `${latestWeight} kg` },
            { label: 'Peso objetivo', value: `${profile.goalWeight} kg` },
            { label: 'Altura', value: `${profile.height} cm` },
            { label: 'IMC', value: `${bmi}` },
            { label: '% Gordura', value: `${bodyFat}%` },
            { label: 'Idade', value: `${profile.age} anos` },
          ].map(s => (
            <div key={s.label} className="flex justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-xs font-medium text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition plan */}
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <p className="font-display font-bold text-foreground mb-3">Plano nutricional</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { l: 'Cal', v: nutritionPlan.calories, c: 'text-neon' },
            { l: 'Prot', v: `${nutritionPlan.protein}g`, c: 'text-fox' },
            { l: 'Carb', v: `${nutritionPlan.carbs}g`, c: 'text-streak' },
            { l: 'Gord', v: `${nutritionPlan.fat}g`, c: 'text-xp' },
          ].map(m => (
            <div key={m.l}>
              <p className={`font-bold ${m.c}`}>{m.v}</p>
              <p className="text-[10px] text-muted-foreground">{m.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges button */}
      <button onClick={() => setShowBadges(true)}
        className="w-full p-4 rounded-xl bg-secondary border border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-pro-gold" />
          <span className="text-sm font-medium text-foreground">Ver todas as conquistas</span>
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      {/* PRO upsell */}
      {!isPro && (
        <a href="https://pay.kirvano.com/d7d92575-11b3-4135-bb20-c834c5765f1b" target="_blank" rel="noopener noreferrer"
          className="block w-full p-4 rounded-xl gradient-pro shadow-pro text-center">
          <p className="font-display font-bold text-pro-foreground">Seja PRO ✨</p>
          <p className="text-xs text-pro-foreground/80">7 dias grátis · R$ 19,90/mês</p>
        </a>
      )}
    </div>
  );
}
