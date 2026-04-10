import { Workout } from '@/stores/useAppStore';

const exercises = (names: string[], dur = 40, rest = 15): Workout['exercises'] =>
  names.map((name, i) => ({
    id: `ex-${name.replace(/\s/g, '-').toLowerCase()}-${i}`,
    name,
    duration: dur,
    rest,
    illustration: '🏋️',
    completed: false,
  }));

export const workouts: Workout[] = [
  // FREE workouts (20)
  { id: 'w1', name: 'Queima Total Iniciante', category: 'Cardio', difficulty: 'easy', exercises: exercises(['Polichinelo', 'Corrida no lugar', 'Agachamento', 'Abdominais', 'Prancha']), isPro: false, estimatedMinutes: 15 },
  { id: 'w2', name: 'Core Básico', category: 'Abdômen', difficulty: 'easy', exercises: exercises(['Prancha', 'Abdominal', 'Bicicleta', 'Elevação de pernas', 'Superman']), isPro: false, estimatedMinutes: 12 },
  { id: 'w3', name: 'Pernas Express', category: 'Pernas', difficulty: 'easy', exercises: exercises(['Agachamento', 'Afundo', 'Elevação de panturrilha', 'Ponte glútea']), isPro: false, estimatedMinutes: 10 },
  { id: 'w4', name: 'Braços Sem Peso', category: 'Braços', difficulty: 'easy', exercises: exercises(['Flexão de braço', 'Flexão diamante', 'Tríceps banco', 'Prancha lateral']), isPro: false, estimatedMinutes: 10 },
  { id: 'w5', name: 'Cardio Moderado', category: 'Cardio', difficulty: 'medium', exercises: exercises(['Burpee', 'Mountain climber', 'Salto estrela', 'Corrida alta', 'Agachamento salto'], 45, 15), isPro: false, estimatedMinutes: 18 },
  { id: 'w6', name: 'Full Body Básico', category: 'Full Body', difficulty: 'easy', exercises: exercises(['Agachamento', 'Flexão', 'Prancha', 'Afundo', 'Abdominais', 'Ponte']), isPro: false, estimatedMinutes: 15 },
  { id: 'w7', name: 'Alongamento Matinal', category: 'Flexibilidade', difficulty: 'easy', exercises: exercises(['Alongamento cervical', 'Torção espinhal', 'Borboleta', 'Toque nos pés', 'Cat-cow'], 30, 10), isPro: false, estimatedMinutes: 8 },
  { id: 'w8', name: 'HIIT 10 Minutos', category: 'HIIT', difficulty: 'medium', exercises: exercises(['Burpee', 'Polichinelo', 'Mountain climber', 'Sprint parado', 'Agachamento salto'], 30, 10), isPro: false, estimatedMinutes: 10 },
  { id: 'w9', name: 'Glúteos de Aço', category: 'Glúteos', difficulty: 'medium', exercises: exercises(['Ponte glútea', 'Agachamento sumo', 'Kickback', 'Afundo búlgaro', 'Fire hydrant']), isPro: false, estimatedMinutes: 14 },
  { id: 'w10', name: 'Peito e Costas', category: 'Superior', difficulty: 'medium', exercises: exercises(['Flexão', 'Flexão aberta', 'Superman', 'Remada invertida', 'Flexão pike']), isPro: false, estimatedMinutes: 14 },
  { id: 'w11', name: 'Tabata Flash', category: 'HIIT', difficulty: 'medium', exercises: exercises(['Sprint', 'Burpee', 'Polichinelo', 'Mountain climber'], 20, 10), isPro: false, estimatedMinutes: 8 },
  { id: 'w12', name: 'Yoga Flow', category: 'Flexibilidade', difficulty: 'easy', exercises: exercises(['Cachorro olhando p/ baixo', 'Guerreiro I', 'Guerreiro II', 'Triângulo', 'Árvore'], 45, 10), isPro: false, estimatedMinutes: 12 },
  { id: 'w13', name: 'Ombros de Pedra', category: 'Ombros', difficulty: 'medium', exercises: exercises(['Flexão pike', 'Elevação lateral', 'Prancha com toque', 'Press de ombro parede']), isPro: false, estimatedMinutes: 10 },
  { id: 'w14', name: 'Cardio Dance', category: 'Cardio', difficulty: 'easy', exercises: exercises(['Passo lateral', 'Grapevine', 'Mambo', 'Cha-cha', 'Salto disco'], 45, 10), isPro: false, estimatedMinutes: 12 },
  { id: 'w15', name: 'Tríceps Destruidor', category: 'Braços', difficulty: 'medium', exercises: exercises(['Tríceps banco', 'Flexão fechada', 'Extensão overhead', 'Prancha com extensão']), isPro: false, estimatedMinutes: 10 },
  { id: 'w16', name: 'Abdômen Definido', category: 'Abdômen', difficulty: 'medium', exercises: exercises(['Prancha', 'Crunch', 'Bicicleta', 'Tesoura', 'V-up', 'Prancha lateral'], 35, 12), isPro: false, estimatedMinutes: 14 },
  { id: 'w17', name: 'Mobilidade Articular', category: 'Flexibilidade', difficulty: 'easy', exercises: exercises(['Rotação ombros', 'Círculos quadril', 'Rotação tornozelo', 'Mobilidade torácica'], 30, 10), isPro: false, estimatedMinutes: 8 },
  { id: 'w18', name: 'Circuito Metabólico', category: 'Full Body', difficulty: 'medium', exercises: exercises(['Agachamento', 'Flexão', 'Polichinelo', 'Abdominal', 'Burpee'], 40, 15), isPro: false, estimatedMinutes: 14 },
  { id: 'w19', name: 'Panturrilha Power', category: 'Pernas', difficulty: 'easy', exercises: exercises(['Elevação panturrilha', 'Pogo jump', 'Caminhada na ponta', 'Single leg calf raise'], 35, 10), isPro: false, estimatedMinutes: 8 },
  { id: 'w20', name: 'Relaxamento Noturno', category: 'Flexibilidade', difficulty: 'easy', exercises: exercises(['Alongamento isquiotibiais', 'Happy baby', 'Torção deitada', 'Savasana'], 45, 10), isPro: false, estimatedMinutes: 10 },

  // PRO workouts (20+)
  { id: 'wp1', name: 'HIIT Inferno 🔥', category: 'HIIT', difficulty: 'intense', exercises: exercises(['Burpee', 'Sprint', 'Mountain climber', 'Tuck jump', 'Squat thrust', 'High knees', 'Box jump'], 40, 10), isPro: true, estimatedMinutes: 20 },
  { id: 'wp2', name: 'Destruidor de Gordura', category: 'Cardio', difficulty: 'hard', exercises: exercises(['Burpee', 'Polichinelo', 'Corrida alta', 'Salto estrela', 'Agachamento salto', 'Mountain climber'], 45, 12), isPro: true, estimatedMinutes: 22 },
  { id: 'wp3', name: 'Full Body Extremo', category: 'Full Body', difficulty: 'intense', exercises: exercises(['Burpee c/ flexão', 'Agachamento pistol', 'Prancha dinâmica', 'Afundo salto', 'Superman avançado', 'Pike push-up', 'Tuck jump'], 45, 15), isPro: true, estimatedMinutes: 25 },
  { id: 'wp4', name: 'Abdômen de Aço', category: 'Abdômen', difficulty: 'hard', exercises: exercises(['Dragon flag', 'V-up', 'L-sit', 'Ab wheel', 'Toe touch', 'Hollow body', 'Russian twist'], 40, 12), isPro: true, estimatedMinutes: 20 },
  { id: 'wp5', name: 'Pernas Mortais', category: 'Pernas', difficulty: 'intense', exercises: exercises(['Pistol squat', 'Jump lunge', 'Wall sit', 'Single leg deadlift', 'Cossack squat', 'Box jump'], 45, 15), isPro: true, estimatedMinutes: 22 },
  { id: 'wp6', name: 'Upper Body Beast', category: 'Superior', difficulty: 'hard', exercises: exercises(['Flexão archer', 'Pike push-up', 'Flexão hindu', 'Pseudo planche', 'Diamond push-up', 'Typewriter push-up'], 40, 15), isPro: true, estimatedMinutes: 20 },
  { id: 'wp7', name: 'Guerreiro EMOM', category: 'HIIT', difficulty: 'intense', exercises: exercises(['Burpee', 'Squat', 'Push-up', 'Sit-up', 'Lunge', 'Mountain climber'], 50, 10), isPro: true, estimatedMinutes: 25 },
  { id: 'wp8', name: 'Glúteos PRO', category: 'Glúteos', difficulty: 'hard', exercises: exercises(['Hip thrust', 'Sumo squat pulse', 'Donkey kick', 'Side lying abduction', 'Frog pump', 'Curtsy lunge'], 45, 12), isPro: true, estimatedMinutes: 18 },
  { id: 'wp9', name: 'Cardio Brutal', category: 'Cardio', difficulty: 'intense', exercises: exercises(['Sprint intervals', 'Burpee broad jump', 'High knees sprint', 'Lateral shuffle', 'Tuck jump', 'Power skip'], 35, 10), isPro: true, estimatedMinutes: 18 },
  { id: 'wp10', name: 'Tabata PRO', category: 'HIIT', difficulty: 'intense', exercises: exercises(['Burpee', 'Sprint', 'Jump squat', 'Mountain climber', 'Tuck jump', 'High knees', 'Power skip', 'Lateral hop'], 20, 10), isPro: true, estimatedMinutes: 16 },
  { id: 'wp11', name: 'Core Avançado', category: 'Abdômen', difficulty: 'hard', exercises: exercises(['Planche lean', 'Hanging leg raise', 'Ab rollout', 'Windshield wiper', 'Pallof press'], 40, 15), isPro: true, estimatedMinutes: 16 },
  { id: 'wp12', name: 'Resistência Total', category: 'Full Body', difficulty: 'hard', exercises: exercises(['Bear crawl', 'Inchworm', 'Spiderman push-up', 'Crab walk', 'Turkish get-up', 'Burpee'], 50, 15), isPro: true, estimatedMinutes: 22 },
  { id: 'wp13', name: 'Ombros de Titânio', category: 'Ombros', difficulty: 'hard', exercises: exercises(['Handstand hold', 'Pike push-up', 'Lateral raise iso', 'Wall walk', 'Shoulder tap plank'], 40, 15), isPro: true, estimatedMinutes: 16 },
  { id: 'wp14', name: 'Braços de Ferro', category: 'Braços', difficulty: 'hard', exercises: exercises(['Diamond push-up', 'Chin-up hold', 'Tricep dips', 'Commando plank', 'Close grip push-up'], 40, 15), isPro: true, estimatedMinutes: 16 },
  { id: 'wp15', name: 'Power Yoga', category: 'Flexibilidade', difficulty: 'hard', exercises: exercises(['Chaturanga flow', 'Crow pose', 'Wheel pose', 'Headstand prep', 'Pigeon pose'], 50, 15), isPro: true, estimatedMinutes: 18 },
  { id: 'wp16', name: 'Circuito Spartano', category: 'Full Body', difficulty: 'intense', exercises: exercises(['Burpee', 'Bear crawl', 'Sprint', 'Agachamento salto', 'Flexão explosiva', 'Mountain climber', 'Star jump', 'Prancha dinâmica'], 35, 10), isPro: true, estimatedMinutes: 22 },
  { id: 'wp17', name: 'Desafio 100 Reps', category: 'Full Body', difficulty: 'hard', exercises: exercises(['Agachamento', 'Flexão', 'Abdominal', 'Afundo', 'Prancha'], 60, 20), isPro: true, estimatedMinutes: 20 },
  { id: 'wp18', name: 'Queima Noturna', category: 'Cardio', difficulty: 'hard', exercises: exercises(['Shadow boxing', 'Jump rope', 'High knees', 'Lateral shuffle', 'Jumping jack'], 45, 12), isPro: true, estimatedMinutes: 16 },
  { id: 'wp19', name: 'Mobilidade Avançada', category: 'Flexibilidade', difficulty: 'medium', exercises: exercises(['World greatest stretch', 'Scorpion', 'Thread the needle', 'Bretzel', 'Couch stretch'], 50, 10), isPro: true, estimatedMinutes: 14 },
  { id: 'wp20', name: 'Método Seca Final', category: 'HIIT', difficulty: 'intense', exercises: exercises(['Burpee', 'Pistol squat', 'Handstand push-up', 'Tuck planche', 'L-sit', 'Dragon flag', 'Sprint', 'Muscle-up prep'], 40, 10), isPro: true, estimatedMinutes: 25 },
];
