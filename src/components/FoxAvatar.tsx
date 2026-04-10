import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import foxMascot from '@/assets/fox-mascot.png';

// ─── POSE / EMOTION TYPES ───────────────────────────────────────────────
export type FoxPose =
  | 'idle' | 'idle_impatient' | 'walking' | 'running_light' | 'running_intense'
  | 'recovery' | 'squat' | 'jumping_jack' | 'running_in_place' | 'stretching'
  | 'warmup' | 'finish_workout'
  | 'pushup' | 'jumping' | 'wave' | 'flexing'
  | 'celebrating' | 'resting' | 'thinking'
  | 'motivating' | 'tired' | 'frustrated' | 'proud' | 'missing_you';

export type FoxEmotion = 'neutral' | 'happy' | 'excited' | 'tired' | 'sad' | 'proud' | 'encouraging';

interface EmotionalState {
  energy: number;      // 0-100
  motivation: number;  // 0-100
  engagement: number;  // 0-100
}

interface FoxAvatarProps {
  pose?: FoxPose;
  size?: number;
  className?: string;
  exerciseName?: string;
  showLabel?: boolean;
  emotion?: FoxEmotion;
  interactive?: boolean;
  userStreak?: number;
  userLevel?: number;
  lastActiveMinutes?: number;
  timerProgress?: number;
}

// ─── ANIMATION CONFIGS (Layered & Blended) ──────────────────────────────

const breathing = {
  scaleY: [1, 1.015, 1],
  scaleX: [1, 0.99, 1],
  transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
};

const tailWag = {
  rotate: [0, 3, -3, 2, -2, 0],
  transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
};

const earTwitch = {
  skewX: [0, 1, -1, 0.5, 0],
  transition: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 },
};

const poseAnimations: Record<FoxPose, any> = {
  idle: {
    y: [0, -3, 0],
    ...breathing,
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
  idle_impatient: {
    y: [0, -2, 0, -4, 0],
    rotate: [0, -2, 2, -3, 0],
    scale: [1, 1.02, 1, 1.03, 1],
    transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
  },
  walking: {
    y: [0, -4, 0, -4, 0],
    x: [0, 2, 0, -2, 0],
    rotate: [0, -2, 0, 2, 0],
    transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
  },
  running_light: {
    y: [0, -8, 0, -8, 0],
    x: [0, 3, 0, -3, 0],
    rotate: [0, -3, 0, 3, 0],
    scaleY: [1, 0.95, 1.05, 0.95, 1],
    transition: { repeat: Infinity, duration: 0.7, ease: 'easeInOut' },
  },
  running_intense: {
    y: [0, -12, 0, -12, 0],
    x: [0, 5, 0, -5, 0],
    rotate: [0, -5, 0, 5, 0],
    scaleY: [1, 0.9, 1.08, 0.9, 1],
    scaleX: [1, 1.05, 0.95, 1.05, 1],
    transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
  },
  recovery: {
    y: [0, 1, 0],
    scaleY: [1, 1.03, 1, 1.04, 1],
    opacity: [1, 0.9, 1],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
  squat: {
    y: [0, 15, 0],
    scaleY: [1, 0.78, 1],
    scaleX: [1, 1.12, 1],
    transition: { repeat: Infinity, duration: 1.6, ease: [0.42, 0, 0.58, 1] },
  },
  jumping_jack: {
    y: [0, -18, 0],
    scaleX: [1, 1.2, 1],
    scaleY: [1, 0.85, 1.05],
    rotate: [0, 0, 0],
    transition: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' },
  },
  running_in_place: {
    y: [0, -6, 0, -6, 0],
    rotate: [0, -2, 0, 2, 0],
    scaleY: [1, 0.94, 1.02, 0.94, 1],
    transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
  },
  stretching: {
    scaleY: [1, 1.1, 1],
    scaleX: [1, 0.95, 1],
    y: [0, -5, 0],
    rotate: [0, 3, 0, -3, 0],
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
  warmup: {
    rotate: [0, 8, -8, 5, -5, 0],
    y: [0, -3, 0],
    scale: [1, 1.03, 1],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  finish_workout: {
    y: [0, -25, 0],
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, -5, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeOut' },
  },
  pushup: {
    y: [0, 14, 0],
    scaleY: [1, 0.82, 1],
    scaleX: [1, 1.08, 1],
    rotate: [0, 2, 0],
    transition: { repeat: Infinity, duration: 1.4, ease: [0.42, 0, 0.58, 1] },
  },
  jumping: {
    y: [0, -22, 0],
    scale: [1, 1.12, 0.95, 1],
    transition: { repeat: Infinity, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
  wave: {
    rotate: [0, 12, -8, 12, 0],
    y: [0, -3, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
  flexing: {
    scale: [1, 1.1, 1],
    scaleX: [1, 1.08, 1],
    rotate: [0, -3, 3, 0],
    y: [0, -2, 0],
    transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
  },
  celebrating: {
    y: [0, -20, 0, -15, 0],
    rotate: [0, -15, 15, -10, 0],
    scale: [1, 1.18, 0.95, 1.1, 1],
    transition: { repeat: Infinity, duration: 1.2, ease: 'easeOut' },
  },
  resting: {
    y: [0, 2, 0],
    scaleY: [1, 1.025, 1, 1.035, 1],
    opacity: [1, 0.85, 1, 0.8, 1],
    transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
  },
  thinking: {
    rotate: [0, 5, 0, -5, 0],
    x: [0, 4, 0, -4, 0],
    y: [0, -2, 0],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
  motivating: {
    y: [0, -8, 0, -5, 0],
    scale: [1, 1.08, 1, 1.05, 1],
    rotate: [0, -5, 5, 0],
    transition: { repeat: Infinity, duration: 1.3, ease: 'easeInOut' },
  },
  tired: {
    y: [0, 3, 0],
    scaleY: [1, 0.96, 1, 0.94, 1],
    rotate: [0, 2, -1, 1, 0],
    opacity: [1, 0.75, 1, 0.7, 1],
    transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
  },
  frustrated: {
    x: [-2, 2, -2, 2, 0],
    rotate: [-1, 1, -1, 1, 0],
    transition: { repeat: Infinity, duration: 0.5, repeatDelay: 2 },
  },
  proud: {
    y: [0, -5, 0],
    scale: [1, 1.08, 1],
    scaleX: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
  missing_you: {
    y: [0, 1, 0, 2, 0],
    rotate: [0, -3, 0, 3, 0],
    opacity: [1, 0.8, 1, 0.75, 1],
    scale: [1, 0.98, 1],
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
};

// ─── EXERCISE → POSE MAPPING ────────────────────────────────────────────
const exerciseToPose: Record<string, FoxPose> = {
  // Push-up variants
  'flexão': 'pushup', 'flexão de braço': 'pushup', 'push-up': 'pushup',
  'diamond push-up': 'pushup', 'flexão diamante': 'pushup', 'flexão fechada': 'pushup',
  'flexão aberta': 'pushup', 'flexão pike': 'pushup', 'flexão archer': 'pushup',
  'flexão hindu': 'pushup', 'spiderman push-up': 'pushup', 'close grip push-up': 'pushup',
  'typewriter push-up': 'pushup', 'pike push-up': 'pushup',
  // Squats
  'agachamento': 'squat', 'agachamento salto': 'squat', 'squat': 'squat',
  'jump squat': 'squat', 'agachamento sumo': 'squat', 'pistol squat': 'squat',
  'cossack squat': 'squat', 'squat thrust': 'squat', 'sumo squat pulse': 'squat',
  'agachamento pistol': 'squat', 'wall sit': 'squat',
  // Jumping
  'burpee': 'jumping', 'burpee c/ flexão': 'jumping', 'burpee broad jump': 'jumping',
  'polichinelo': 'jumping_jack', 'salto estrela': 'jumping_jack',
  'tuck jump': 'jumping', 'box jump': 'jumping', 'pogo jump': 'jumping',
  'power skip': 'jumping', 'lateral hop': 'jumping',
  // Running
  'corrida no lugar': 'running_in_place', 'corrida alta': 'running_in_place',
  'sprint': 'running_intense', 'sprint parado': 'running_in_place',
  'high knees': 'running_in_place', 'sprint intervals': 'running_intense',
  'high knees sprint': 'running_intense',
  // Core / plank
  'mountain climber': 'running_in_place',
  'prancha': 'pushup', 'prancha lateral': 'pushup', 'prancha dinâmica': 'pushup',
  'prancha com toque': 'pushup', 'prancha com extensão': 'pushup',
  'commando plank': 'pushup', 'shoulder tap plank': 'pushup', 'planche lean': 'pushup',
  // Abs
  'abdominal': 'squat', 'abdominais': 'squat', 'crunch': 'squat', 'sit-up': 'squat',
  'v-up': 'squat', 'bicicleta': 'running_in_place', 'tesoura': 'running_in_place',
  'russian twist': 'squat', 'elevação de pernas': 'squat', 'toe touch': 'squat',
  'hollow body': 'pushup', 'dragon flag': 'pushup', 'l-sit': 'pushup',
  'ab wheel': 'pushup', 'ab rollout': 'pushup', 'windshield wiper': 'squat',
  'hanging leg raise': 'squat',
  // Glutes
  'ponte glútea': 'squat', 'hip thrust': 'squat', 'frog pump': 'squat',
  'kickback': 'flexing', 'donkey kick': 'flexing', 'fire hydrant': 'flexing',
  // Lunges
  'afundo': 'squat', 'afundo búlgaro': 'squat', 'jump lunge': 'jumping',
  'afundo salto': 'jumping', 'lunge': 'squat', 'curtsy lunge': 'squat',
  // Upper body
  'superman': 'stretching', 'superman avançado': 'stretching',
  'tríceps banco': 'pushup', 'tricep dips': 'pushup', 'extensão overhead': 'flexing',
  'elevação lateral': 'flexing', 'lateral raise iso': 'flexing',
  'remada invertida': 'flexing', 'bear crawl': 'running_in_place',
  'inchworm': 'stretching', 'crab walk': 'running_in_place',
  'turkish get-up': 'squat', 'wall walk': 'pushup',
  'handstand hold': 'flexing', 'chin-up hold': 'flexing',
  'single leg deadlift': 'squat',
  'elevação panturrilha': 'squat', 'single leg calf raise': 'squat',
  'caminhada na ponta': 'walking', 'lateral shuffle': 'running_light',
  'press de ombro parede': 'flexing', 'pseudo planche': 'pushup',
  'pallof press': 'flexing', 'side lying abduction': 'resting',
  'elevação de panturrilha': 'squat', 'passo lateral': 'walking',
  'grapevine': 'walking', 'mambo': 'walking', 'cha-cha': 'walking',
  'salto disco': 'jumping',
  // Stretching
  'alongamento cervical': 'stretching', 'torção espinhal': 'stretching',
  'borboleta': 'stretching', 'toque nos pés': 'stretching', 'cat-cow': 'stretching',
  'cachorro olhando p/ baixo': 'stretching',
  'guerreiro i': 'stretching', 'guerreiro ii': 'stretching', 'triângulo': 'stretching',
  'árvore': 'stretching', 'savasana': 'resting', 'happy baby': 'resting',
  'torção deitada': 'stretching', 'alongamento isquiotibiais': 'stretching',
  'rotação ombros': 'warmup', 'círculos quadril': 'warmup',
  'rotação tornozelo': 'warmup', 'mobilidade torácica': 'warmup',
};

export function getExercisePose(exerciseName: string): FoxPose {
  return exerciseToPose[exerciseName.toLowerCase()] || 'flexing';
}

// ─── POSE LABELS ────────────────────────────────────────────────────────
const poseLabels: Record<FoxPose, string> = {
  idle: '🦊 Pronto!',
  idle_impatient: '🦊 Vamos lá?!',
  walking: '🚶 Andando...',
  running_light: '🏃 Correndo!',
  running_intense: '🔥 Sprint!!',
  recovery: '😮‍💨 Recuperando...',
  squat: '🦵 Agacha!',
  jumping_jack: '⭐ Abre-fecha!',
  running_in_place: '🏃 Corre! Corre!',
  stretching: '🧘 Alongando...',
  warmup: '🔄 Aquecendo!',
  finish_workout: '🎉 ACABOU!',
  pushup: '💪 Vai! Vai!',
  jumping: '🔥 Pula!',
  wave: '👋 Oi!',
  flexing: '💪 Força!',
  celebrating: '🎉 Boa!',
  resting: '😮‍💨 Descanse...',
  thinking: '🤔 Hmm...',
  motivating: '📣 Bora!!',
  tired: '😰 Cansado...',
  frustrated: '😤 Volta aqui!',
  proud: '😎 Orgulhoso!',
  missing_you: '🥺 Saudades...',
};

// ─── BLINK SYSTEM ───────────────────────────────────────────────────────
function useBlinkCycle() {
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
      const next = 2000 + Math.random() * 4000;
      setTimeout(blink, next);
    };
    const id = setTimeout(blink, 1500 + Math.random() * 2000);
    return () => clearTimeout(id);
  }, []);
  return blinking;
}

// ─── IDLE TIMEOUT → IMPATIENT ───────────────────────────────────────────
function useIdleImpatience(pose: FoxPose, interactive: boolean) {
  const [impatient, setImpatient] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!interactive || pose !== 'idle') {
      setImpatient(false);
      return;
    }
    timerRef.current = setTimeout(() => setImpatient(true), 12000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pose, interactive]);

  // Reset on any click/touch
  useEffect(() => {
    if (!interactive) return;
    const reset = () => {
      setImpatient(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setImpatient(true), 12000);
    };
    window.addEventListener('pointerdown', reset);
    return () => window.removeEventListener('pointerdown', reset);
  }, [interactive]);

  return impatient;
}

// ─── EMOTIONAL STATE CALCULATOR ─────────────────────────────────────────
function computeEmotion(props: Pick<FoxAvatarProps, 'userStreak' | 'userLevel' | 'lastActiveMinutes'>): { emotion: FoxEmotion; state: EmotionalState } {
  const { userStreak = 0, userLevel = 1, lastActiveMinutes = 0 } = props;
  const energy = Math.min(100, userStreak * 10 + userLevel * 15);
  const motivation = Math.min(100, userStreak * 12 + (lastActiveMinutes < 60 ? 30 : 0));
  const engagement = lastActiveMinutes < 1440 ? 80 : lastActiveMinutes < 4320 ? 50 : 20;

  let emotion: FoxEmotion = 'neutral';
  if (energy > 70 && motivation > 70) emotion = 'excited';
  else if (energy > 50) emotion = 'happy';
  else if (engagement < 30) emotion = 'sad';
  else if (motivation > 60) emotion = 'encouraging';

  return { emotion, state: { energy, motivation, engagement } };
}

// ─── PARTICLE EFFECTS ───────────────────────────────────────────────────
const particleEmojis: Record<string, string[]> = {
  celebrating: ['✨', '🎉', '⭐', '🔥', '💪'],
  finish_workout: ['🏆', '🎊', '💥', '⭐', '✨'],
  proud: ['😎', '💪', '🔥'],
  motivating: ['💪', '🔥', '⚡'],
};

function Particles({ pose, size }: { pose: FoxPose; size: number }) {
  const emojis = particleEmojis[pose];
  if (!emojis) return null;

  return (
    <>
      {emojis.map((emoji, i) => {
        const angle = (i / emojis.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = size * 0.6;
        return (
          <motion.span
            key={`${pose}-${i}`}
            className="absolute text-sm pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              fontSize: Math.max(10, size * 0.14),
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos(rad) * dist * 0.5, Math.cos(rad) * dist],
              y: [0, Math.sin(rad) * dist * 0.5 - 10, Math.sin(rad) * dist - 20],
              opacity: [0, 1, 0],
              scale: [0.3, 1.2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </>
  );
}

// ─── GLOW AURA ──────────────────────────────────────────────────────────
function GlowAura({ pose, emotion }: { pose: FoxPose; emotion: FoxEmotion }) {
  const isActive = ['pushup', 'squat', 'jumping', 'jumping_jack', 'running_in_place',
    'running_light', 'running_intense', 'flexing', 'celebrating', 'finish_workout', 'motivating', 'proud'].includes(pose);
  if (!isActive) return null;

  const colorMap: Record<string, string> = {
    celebrating: 'from-yellow-500/30 via-orange-500/20 to-transparent',
    finish_workout: 'from-yellow-400/40 via-amber-500/20 to-transparent',
    motivating: 'from-blue-500/30 via-cyan-500/15 to-transparent',
    proud: 'from-purple-500/25 via-pink-500/15 to-transparent',
  };
  const gradient = colorMap[pose] || 'from-primary/25 via-primary/10 to-transparent';

  return (
    <motion.div
      className={`absolute inset-[-20%] rounded-full bg-gradient-radial ${gradient} blur-xl pointer-events-none`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    />
  );
}

// ─── SWEAT DROPS ────────────────────────────────────────────────────────
function SweatDrops({ show, size }: { show: boolean; size: number }) {
  if (!show) return null;
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.span
          key={`sweat-${i}`}
          className="absolute text-blue-400 pointer-events-none"
          style={{
            right: `${10 + i * 15}%`,
            top: `${15 + i * 8}%`,
            fontSize: Math.max(8, size * 0.1),
          }}
          animate={{
            y: [0, size * 0.3],
            opacity: [0.8, 0],
            scale: [1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: i * 0.4,
            ease: 'easeIn',
          }}
        >
          💧
        </motion.span>
      ))}
    </>
  );
}

// ─── PROGRESS SYNC RING ─────────────────────────────────────────────────
function ProgressRing({ progress, size }: { progress: number; size: number }) {
  if (progress <= 0) return null;
  const r = size * 0.52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(progress, 1));

  return (
    <svg
      className="absolute inset-0 -rotate-90 pointer-events-none"
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="hsl(var(--primary) / 0.15)"
        strokeWidth={3}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────
export default function FoxAvatar({
  pose = 'idle',
  size = 80,
  className = '',
  exerciseName,
  showLabel = true,
  emotion: emotionProp,
  interactive = true,
  userStreak = 0,
  userLevel = 1,
  lastActiveMinutes = 0,
  timerProgress = 0,
}: FoxAvatarProps) {
  const [tapped, setTapped] = useState(false);
  const blinking = useBlinkCycle();

  // Resolve final pose
  let activePose: FoxPose = exerciseName ? getExercisePose(exerciseName) : pose;
  const isImpatient = useIdleImpatience(activePose, interactive);
  if (isImpatient && activePose === 'idle') activePose = 'idle_impatient';

  // Emotional state
  const { emotion: computedEmotion } = useMemo(
    () => computeEmotion({ userStreak, userLevel, lastActiveMinutes }),
    [userStreak, userLevel, lastActiveMinutes]
  );
  const emotion = emotionProp || computedEmotion;

  // Tap interaction
  const handleTap = useCallback(() => {
    setTapped(true);
    setTimeout(() => setTapped(false), 600);
  }, []);

  const animation = poseAnimations[activePose] || poseAnimations.idle;
  const showSweat = ['tired', 'running_intense', 'recovery'].includes(activePose);
  const isExercising = ['pushup', 'squat', 'jumping', 'jumping_jack', 'running_in_place',
    'running_light', 'running_intense', 'warmup', 'stretching'].includes(activePose);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ width: size, height: size }}
        onTap={interactive ? handleTap : undefined}
        whileHover={interactive ? { scale: 1.05 } : undefined}
      >
        {/* Glow aura */}
        <GlowAura pose={activePose} emotion={emotion} />

        {/* Progress ring */}
        <ProgressRing progress={timerProgress} size={size} />

        {/* Main avatar */}
        <motion.div
          className="relative w-full h-full"
          animate={animation}
          key={activePose}
          initial={{ scale: 0.9, opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blink overlay */}
          <motion.div
            className="absolute inset-0 rounded-full bg-black/10 pointer-events-none z-10"
            animate={{ opacity: blinking ? 0.3 : 0 }}
            transition={{ duration: 0.08 }}
            style={{ clipPath: `ellipse(30% 8% at 50% ${size * 0.35}px)` }}
          />

          <motion.img
            src={foxMascot}
            alt="Mascote Raposa"
            className="w-full h-full object-contain drop-shadow-lg"
            animate={tapped ? {
              scale: [1, 1.2, 0.9, 1.05, 1],
              rotate: [0, -10, 10, -5, 0],
            } : {}}
            transition={tapped ? { duration: 0.6, ease: 'easeOut' } : {}}
            draggable={false}
          />
        </motion.div>

        {/* Sweat drops */}
        <SweatDrops show={showSweat} size={size} />

        {/* Particles */}
        <Particles pose={activePose} size={size} />

        {/* Exercise indicator */}
        {isExercising && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground text-[8px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {exerciseName || activePose}
          </motion.div>
        )}

        {/* Tap feedback */}
        <AnimatePresence>
          {tapped && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50 pointer-events-none"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      {showLabel && (
        <AnimatePresence mode="wait">
          <motion.span
            key={activePose}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-muted-foreground font-medium"
          >
            {poseLabels[activePose]}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
