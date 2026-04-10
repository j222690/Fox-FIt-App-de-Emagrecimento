import { Home, Dumbbell, UtensilsCrossed, BookOpen, User, Crown } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'workouts', icon: Dumbbell, label: 'Treinos' },
  { id: 'meals', icon: UtensilsCrossed, label: 'Refeições' },
  { id: 'lessons', icon: BookOpen, label: 'Aulas' },
  { id: 'profile', icon: User, label: 'Perfil' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { isPro } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLessons = tab.id === 'lessons';
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isLessons && !isPro && (
                <Crown size={10} className="absolute -top-0.5 right-1 text-pro-gold" />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
