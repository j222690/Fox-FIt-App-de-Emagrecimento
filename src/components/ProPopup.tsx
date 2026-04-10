import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { Crown, X } from 'lucide-react';

interface ProPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function ProPopup({ show, onClose }: ProPopupProps) {
  const { isPro } = useAppStore();
  if (isPro) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-pro"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-full gradient-pro flex items-center justify-center shadow-pro"
              >
                <Crown className="text-pro-foreground" size={32} />
              </motion.div>

              <h3 className="font-display text-xl font-bold text-foreground">
                Desbloqueie o <span className="text-pro-gold">Plano PRO</span>
              </h3>

              <p className="text-sm text-muted-foreground">
                +100 receitas, +20 treinos intensos, cardápio com IA, aulas exclusivas e muito mais!
              </p>

              <div className="flex gap-3 w-full">
                <div className="flex-1 rounded-xl border border-border bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Mensal</p>
                  <p className="font-display font-bold text-foreground">R$ 19,90</p>
                  <p className="text-xs text-muted-foreground">/mês</p>
                </div>
                <div className="flex-1 rounded-xl border-2 border-pro bg-secondary p-3 relative">
                  <span className="absolute -top-2 right-2 text-[10px] bg-pro text-pro-foreground px-2 py-0.5 rounded-full font-bold">MELHOR</span>
                  <p className="text-xs text-muted-foreground">Anual</p>
                  <p className="font-display font-bold text-foreground">R$ 149,90</p>
                  <p className="text-xs text-muted-foreground">/ano</p>
                </div>
              </div>

              <a
                href="https://pay.kirvano.com/d7d92575-11b3-4135-bb20-c834c5765f1b"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl gradient-pro text-pro-foreground font-display font-bold text-center shadow-pro block"
              >
                Ver plano PRO ✨
              </a>

              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Agora não
              </button>

              <p className="text-xs text-muted-foreground">7 dias grátis para testar</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
