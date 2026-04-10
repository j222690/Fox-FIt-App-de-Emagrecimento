import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import OnboardingFlow from '@/components/OnboardingFlow';
import DashboardHome from '@/components/DashboardHome';
import WorkoutsScreen from '@/components/WorkoutsScreen';
import MealsScreen from '@/components/MealsScreen';
import LessonsScreen from '@/components/LessonsScreen';
import ProfileScreen from '@/components/ProfileScreen';
import BottomNav from '@/components/BottomNav';
import ProPopup from '@/components/ProPopup';

const Index = () => {
  const { onboardingComplete, isPro, lastProPopup, setLastProPopup, timerState } = useAppStore();
  const [activeTab, setActiveTab] = useState('home');
  const [showProPopup, setShowProPopup] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);

    // Show PRO popup on tab change (max once per 60s, not during active workout or onboarding)
    if (!isPro && timerState === 'idle') {
      const now = Date.now();
      if (now - lastProPopup > 60000) {
        setShowProPopup(true);
        setLastProPopup(now);
      }
    }
  }, [isPro, lastProPopup, timerState, setLastProPopup]);

  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome />;
      case 'workouts': return <WorkoutsScreen />;
      case 'meals': return <MealsScreen />;
      case 'lessons': return <LessonsScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background safe-top">
      {renderScreen()}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      <ProPopup show={showProPopup} onClose={() => setShowProPopup(false)} />
    </div>
  );
};

export default Index;
