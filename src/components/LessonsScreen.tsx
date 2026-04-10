import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { Lock, CheckCircle2, BookOpen, Crown } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  phase: number;
  duration: string;
}

const phases = [
  { name: '🧹 Desintoxicação', description: 'Eliminar toxinas e preparar o corpo' },
  { name: '🔥 Emagrecimento', description: 'Queima de gordura acelerada' },
  { name: '🍎 Reeducação', description: 'Novos hábitos alimentares' },
  { name: '🏆 Manutenção', description: 'Manter os resultados para sempre' },
];

const lessons: Lesson[] = [
  { id: 'l1', title: 'O que é desintoxicação corporal', description: 'Entenda como toxinas afetam seu metabolismo', phase: 0, duration: '8 min' },
  { id: 'l2', title: 'Alimentos que inflamam', description: 'Lista dos principais vilões da sua dieta', phase: 0, duration: '10 min' },
  { id: 'l3', title: 'Protocolo 3 dias detox', description: 'Plano prático de desintoxicação', phase: 0, duration: '12 min' },
  { id: 'l4', title: 'Hidratação estratégica', description: 'Quando e quanto beber para desintoxicar', phase: 0, duration: '6 min' },
  { id: 'l5', title: 'O segredo do déficit calórico', description: 'Como perder gordura sem passar fome', phase: 1, duration: '10 min' },
  { id: 'l6', title: 'Jejum intermitente na prática', description: 'Protocolos simples e eficazes', phase: 1, duration: '15 min' },
  { id: 'l7', title: 'Treino em jejum: sim ou não?', description: 'A ciência por trás do debate', phase: 1, duration: '8 min' },
  { id: 'l8', title: 'Acelerando o metabolismo', description: 'Estratégias comprovadas', phase: 1, duration: '12 min' },
  { id: 'l9', title: 'Montando seu prato ideal', description: 'Proporções e escolhas inteligentes', phase: 2, duration: '10 min' },
  { id: 'l10', title: 'Substituições inteligentes', description: 'Troque sem sentir falta', phase: 2, duration: '8 min' },
  { id: 'l11', title: 'Lendo rótulos como um PRO', description: 'Descubra o que está comendo', phase: 2, duration: '12 min' },
  { id: 'l12', title: 'Comendo fora de casa', description: 'Estratégias para restaurantes', phase: 2, duration: '8 min' },
  { id: 'l13', title: 'Evitando o efeito sanfona', description: 'Por que as dietas falham', phase: 3, duration: '10 min' },
  { id: 'l14', title: 'Mindset do fitness', description: 'Psicologia da mudança corporal', phase: 3, duration: '12 min' },
  { id: 'l15', title: 'Planejamento semanal', description: 'Organize sua semana fitness', phase: 3, duration: '8 min' },
  { id: 'l16', title: 'Seu plano para os próximos 90 dias', description: 'Estratégia de longo prazo', phase: 3, duration: '15 min' },
];

export default function LessonsScreen() {
  const { isPro } = useAppStore();
  const [activePhase, setActivePhase] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  if (!isPro) {
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full gradient-pro flex items-center justify-center shadow-pro">
          <Crown size={40} className="text-pro-foreground" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-foreground">Aulas Exclusivas PRO</h2>
        <p className="text-muted-foreground max-w-xs">
          4 fases completas com 16 aulas práticas para sua transformação total
        </p>
        <a href="https://pay.kirvano.com/d7d92575-11b3-4135-bb20-c834c5765f1b" target="_blank" rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-xl gradient-pro text-pro-foreground font-display font-bold shadow-pro">
          Desbloquear Aulas ✨
        </a>
      </div>
    );
  }

  const phaseLessons = lessons.filter(l => l.phase === activePhase);

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">Aulas 📚</h1>

      {/* Phase tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {phases.map((p, i) => (
          <button key={i} onClick={() => setActivePhase(i)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activePhase === i ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border">
        <p className="font-display font-bold text-foreground">{phases[activePhase].name}</p>
        <p className="text-sm text-muted-foreground">{phases[activePhase].description}</p>
      </div>

      <div className="space-y-3">
        {phaseLessons.map(l => {
          const done = completedLessons.includes(l.id);
          return (
            <motion.button key={l.id} whileTap={{ scale: 0.98 }}
              onClick={() => setCompletedLessons(prev => prev.includes(l.id) ? prev.filter(x => x !== l.id) : [...prev, l.id])}
              className="w-full p-4 rounded-xl bg-secondary border border-border text-left flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'gradient-primary' : 'bg-muted'}`}>
                {done ? <CheckCircle2 size={20} className="text-primary-foreground" /> : <BookOpen size={20} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${done ? 'text-foreground' : 'text-foreground'}`}>{l.title}</p>
                <p className="text-xs text-muted-foreground">{l.description} · {l.duration}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
