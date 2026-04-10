import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, calculateNutrition, type UserProfile } from '@/stores/useAppStore';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import foxMascot from '@/assets/fox-mascot.png';

const steps = [
  'welcome', 'name', 'basics', 'body', 'goal', 'activity', 'restrictions', 'summary'
] as const;

export default function OnboardingFlow() {
  const { setProfile, setNutritionPlan, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', age: 25, sex: 'male' as 'male' | 'female',
    height: 170, weight: 80, goalWeight: 70, deadline: 30,
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    restrictions: [] as string[], goal: 'lose' as 'lose' | 'gain',
  });

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const finish = () => {
    const profile: UserProfile = { ...data };
    setProfile(profile);
    setNutritionPlan(calculateNutrition(profile));
    completeOnboarding();
  };

  const nutrition = calculateNutrition(data as UserProfile);

  const restrictionOptions = ['Sem glúten', 'Sem lactose', 'Vegetariano', 'Vegano', 'Sem açúcar', 'Low carb'];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Progress */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'gradient-primary' : 'bg-secondary'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
        >
          {/* Welcome */}
          {steps[step] === 'welcome' && (
            <div className="flex flex-col items-center text-center gap-6">
              <motion.img
                src={foxMascot}
                alt="Raposa mascote"
                className="w-40 h-40"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                width={160}
                height={160}
              />
              <h1 className="font-display text-3xl font-black text-foreground">
                Método <span className="text-neon glow-neon">Seca 30D</span>
              </h1>
              <p className="text-muted-foreground">
                Seu programa de transformação corporal com IA. Resultados visíveis em 7 dias! 🔥
              </p>
            </div>
          )}

          {/* Name */}
          {steps[step] === 'name' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Como posso te chamar? 🦊</h2>
              <input
                type="text"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Basics */}
          {steps[step] === 'basics' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Informações básicas</h2>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Idade</label>
                <input type="number" value={data.age} onChange={e => setData({ ...data, age: +e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Sexo</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map(s => (
                    <button key={s} onClick={() => setData({ ...data, sex: s })}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${data.sex === s ? 'gradient-primary text-primary-foreground shadow-neon' : 'bg-secondary text-foreground border border-border'}`}>
                      {s === 'male' ? '♂️ Masculino' : '♀️ Feminino'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Body */}
          {steps[step] === 'body' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Medidas corporais</h2>
              {[
                { label: 'Altura (cm)', key: 'height', val: data.height },
                { label: 'Peso atual (kg)', key: 'weight', val: data.weight },
                { label: 'Peso objetivo (kg)', key: 'goalWeight', val: data.goalWeight },
                { label: 'Prazo (dias)', key: 'deadline', val: data.deadline },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-muted-foreground mb-1 block">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => setData({ ...data, [f.key]: +e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
            </div>
          )}

          {/* Goal */}
          {steps[step] === 'goal' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Qual seu objetivo? 🎯</h2>
              {([{ id: 'lose', label: '🔥 Emagrecer', desc: 'Perder gordura e definir' }, { id: 'gain', label: '💪 Ganhar massa', desc: 'Ganhar músculo e força' }] as const).map(g => (
                <button key={g.id} onClick={() => setData({ ...data, goal: g.id })}
                  className={`p-4 rounded-xl text-left transition-all ${data.goal === g.id ? 'gradient-primary text-primary-foreground shadow-neon' : 'bg-secondary border border-border'}`}>
                  <p className="font-display font-bold text-lg">{g.label}</p>
                  <p className={`text-sm ${data.goal === g.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{g.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Activity */}
          {steps[step] === 'activity' && (
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-2xl font-bold text-foreground">Nível de atividade</h2>
              {([
                { id: 'sedentary', label: '🛋️ Sedentário' },
                { id: 'light', label: '🚶 Leve' },
                { id: 'moderate', label: '🏃 Moderado' },
                { id: 'active', label: '🏋️ Ativo' },
                { id: 'very_active', label: '⚡ Muito ativo' },
              ] as const).map(a => (
                <button key={a.id} onClick={() => setData({ ...data, activityLevel: a.id })}
                  className={`p-3 rounded-xl text-left font-medium transition-all ${data.activityLevel === a.id ? 'gradient-primary text-primary-foreground shadow-neon' : 'bg-secondary border border-border text-foreground'}`}>
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {/* Restrictions */}
          {steps[step] === 'restrictions' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Restrições alimentares</h2>
              <div className="flex flex-wrap gap-2">
                {restrictionOptions.map(r => (
                  <button key={r} onClick={() => setData({ ...data, restrictions: data.restrictions.includes(r) ? data.restrictions.filter(x => x !== r) : [...data.restrictions, r] })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${data.restrictions.includes(r) ? 'gradient-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Selecione todas que se aplicam ou pule</p>
            </div>
          )}

          {/* Summary */}
          {steps[step] === 'summary' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-neon" size={24} />
                <h2 className="font-display text-2xl font-bold text-foreground">Seu plano, {data.name}!</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Calorias', value: `${nutrition.calories} kcal`, color: 'text-neon' },
                  { label: 'Proteínas', value: `${nutrition.protein}g`, color: 'text-fox' },
                  { label: 'Carboidratos', value: `${nutrition.carbs}g`, color: 'text-streak' },
                  { label: 'Gorduras', value: `${nutrition.fat}g`, color: 'text-xp' },
                ].map(m => (
                  <motion.div key={m.label} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className={`font-display text-xl font-bold ${m.color}`}>{m.value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Estratégia</p>
                <p className="text-foreground font-medium">
                  {data.goal === 'lose' ? `Déficit calórico de 500 kcal/dia para perder ~${((data.weight - data.goalWeight) / (data.deadline / 7)).toFixed(1)}kg por semana` : `Superávit de 300 kcal/dia para ganho de massa muscular sustentável`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 w-full max-w-sm">
        {step > 0 && (
          <button onClick={prev} className="px-6 py-3 rounded-xl bg-secondary border border-border text-foreground font-medium">
            <ChevronLeft size={20} />
          </button>
        )}
        <button
          onClick={step === steps.length - 1 ? finish : next}
          disabled={steps[step] === 'name' && !data.name.trim()}
          className="flex-1 py-3.5 rounded-xl gradient-primary text-primary-foreground font-display font-bold shadow-neon disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {step === steps.length - 1 ? 'Começar! 🚀' : 'Continuar'}
          {step < steps.length - 1 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
