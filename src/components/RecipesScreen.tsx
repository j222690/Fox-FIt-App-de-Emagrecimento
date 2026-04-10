import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { recipes, type Recipe } from '@/data/recipes';
import { Crown, Clock, ChefHat, ChevronLeft, Lock, Search } from 'lucide-react';

export default function RecipesScreen() {
  const { isPro } = useAppStore();
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r => {
    if (filter === 'free' && r.isPro) return false;
    if (filter === 'pro' && !r.isPro) return false;
    if (filter !== 'all' && filter !== 'free' && filter !== 'pro' && r.category !== filter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selected) {
    const locked = selected.isPro && !isPro;
    return (
      <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-muted-foreground">
          <ChevronLeft size={18} /> Voltar
        </button>
        <h2 className="font-display text-2xl font-bold text-foreground">{selected.name}</h2>
        {selected.isPro && <span className="text-xs gradient-pro text-pro-foreground px-2 py-0.5 rounded-full font-bold inline-block">PRO</span>}

        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>🔥 {selected.calories} kcal</span>
          <span><Clock size={14} className="inline" /> {selected.prepTime} min</span>
          <span><ChefHat size={14} className="inline" /> {selected.difficulty}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { l: 'Cal', v: selected.calories, c: 'text-neon' },
            { l: 'Prot', v: `${selected.protein}g`, c: 'text-fox' },
            { l: 'Carb', v: `${selected.carbs}g`, c: 'text-streak' },
            { l: 'Gord', v: `${selected.fat}g`, c: 'text-xp' },
          ].map(m => (
            <div key={m.l} className="bg-secondary rounded-xl p-3 border border-border text-center">
              <p className={`font-bold ${m.c}`}>{m.v}</p>
              <p className="text-[10px] text-muted-foreground">{m.l}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {selected.benefits.map(b => (
            <span key={b} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">{b}</span>
          ))}
        </div>

        {locked && (
          <div className="bg-secondary rounded-xl p-6 border border-border text-center space-y-3">
            <Lock size={32} className="mx-auto text-muted-foreground" />
            <p className="text-foreground font-medium">Receita exclusiva PRO</p>
            <a href="https://pay.kirvano.com/d7d92575-11b3-4135-bb20-c834c5765f1b" target="_blank" rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-xl gradient-pro text-pro-foreground font-bold text-sm">
              Desbloquear PRO ✨
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">Receitas 🍲</h1>
      <p className="text-sm text-muted-foreground">{recipes.length}+ receitas saudáveis</p>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar receita..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['all', 'free', 'pro', 'café', 'almoço', 'jantar', 'lanche', 'sobremesa'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
            {f === 'all' ? 'Todas' : f === 'free' ? 'Grátis' : f === 'pro' ? '⭐ PRO' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 30).map(r => (
          <motion.button key={r.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(r)}
            className="w-full p-4 rounded-xl bg-secondary border border-border text-left flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-fox flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate text-sm">{r.name}</p>
                {r.isPro && <Crown size={12} className="text-pro-gold flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground">{r.calories} kcal · {r.prepTime}min · {r.difficulty}</p>
            </div>
          </motion.button>
        ))}
        {filtered.length > 30 && <p className="text-xs text-muted-foreground text-center">+{filtered.length - 30} receitas</p>}
      </div>
    </div>
  );
}
