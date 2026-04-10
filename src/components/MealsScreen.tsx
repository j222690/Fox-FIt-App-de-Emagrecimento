import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type MealEntry } from '@/stores/useAppStore';
import { parseMealInput, calculateMacros } from '@/data/foodDatabase';
import { Plus, Search, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function MealsScreen() {
  const { meals, addMeal, nutritionPlan, weightHistory, addWeight, addXp, unlockBadge } = useAppStore();
  const [input, setInput] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [parsed, setParsed] = useState<ReturnType<typeof parseMealInput>>([]);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', grams: '' });
  const [weightInput, setWeightInput] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === today);
  const todayTotal = todayMeals.reduce((acc, m) => ({
    calories: acc.calories + m.calories, protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleParse = () => {
    const results = parseMealInput(input);
    setParsed(results);
  };

  const handleAddParsed = () => {
    parsed.forEach((p, i) => {
      if (p.grams <= 0) return;
      const macros = calculateMacros(p.food, p.grams);
      const entry: MealEntry = {
        id: `${Date.now()}-${i}`,
        name: p.food.name,
        grams: p.grams,
        ...macros,
        date: today,
        meal: selectedMeal,
      };
      addMeal(entry);
    });
    addXp(5);
    unlockBadge('first_meal');
    setInput('');
    setParsed([]);
  };

  const handleAddManual = () => {
    const entry: MealEntry = {
      id: `${Date.now()}`,
      name: manual.name || 'Alimento',
      grams: +manual.grams || 100,
      calories: +manual.calories || 0,
      protein: +manual.protein || 0,
      carbs: +manual.carbs || 0,
      fat: +manual.fat || 0,
      date: today,
      meal: selectedMeal,
    };
    addMeal(entry);
    addXp(5);
    setManual({ name: '', calories: '', protein: '', carbs: '', fat: '', grams: '' });
    setShowManual(false);
  };

  const handleAddWeight = () => {
    if (+weightInput > 0) {
      addWeight({ date: today, weight: +weightInput });
      setWeightInput('');
    }
  };

  const totalCalories = parsed.reduce((s, p) => s + (p.grams > 0 ? calculateMacros(p.food, p.grams).calories : 0), 0);
  const classify = totalCalories < 400 ? { label: '🟢 Leve', color: 'text-neon' } : totalCalories <= 700 ? { label: '🟡 Moderado', color: 'text-streak' } : { label: '🔴 Alto', color: 'text-destructive' };

  const mealLabels: Record<MealType, string> = { breakfast: '☀️ Café', lunch: '🍽️ Almoço', dinner: '🌙 Jantar', snack: '🍎 Lanche' };

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">Refeições 🍴</h1>

      {/* Today summary */}
      {nutritionPlan && (
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Hoje</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { l: 'Cal', v: todayTotal.calories, t: nutritionPlan.calories, c: 'text-neon' },
              { l: 'Prot', v: todayTotal.protein.toFixed(0), t: nutritionPlan.protein, c: 'text-fox' },
              { l: 'Carb', v: todayTotal.carbs.toFixed(0), t: nutritionPlan.carbs, c: 'text-streak' },
              { l: 'Gord', v: todayTotal.fat.toFixed(0), t: nutritionPlan.fat, c: 'text-xp' },
            ].map(m => (
              <div key={m.l}>
                <p className={`font-bold text-lg ${m.c}`}>{m.v}</p>
                <p className="text-[10px] text-muted-foreground">{m.l} / {m.t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal type selector */}
      <div className="flex gap-2">
        {(Object.entries(mealLabels) as [MealType, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setSelectedMeal(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedMeal === key ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Quick input */}
      <div className="bg-secondary rounded-xl p-4 border border-border space-y-3">
        <p className="text-sm font-medium text-foreground">Calcular calorias</p>
        <div className="flex gap-2">
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="ex: arroz 150g + frango 200g"
            className="flex-1 px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={handleParse} className="px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground">
            <Search size={18} />
          </button>
        </div>

        {parsed.length > 0 && (
          <div className="space-y-2">
            {parsed.map((p, i) => {
              const macros = p.grams > 0 ? calculateMacros(p.food, p.grams) : null;
              return (
                <div key={i} className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground font-medium capitalize">{p.food.name}</span>
                    <span className="text-muted-foreground">{p.grams}g</span>
                  </div>
                  {p.grams === 0 && (
                    <p className="text-xs text-destructive mt-1">⚠️ Informe a quantidade em gramas</p>
                  )}
                  {macros && (
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{macros.calories} kcal</span>
                      <span>P: {macros.protein}g</span>
                      <span>C: {macros.carbs}g</span>
                      <span>G: {macros.fat}g</span>
                    </div>
                  )}
                </div>
              );
            })}
            {totalCalories > 0 && (
              <div className="bg-muted rounded-lg p-3 flex justify-between items-center">
                <span className="font-bold text-foreground">Total: {totalCalories} kcal</span>
                <span className={`text-sm font-medium ${classify.color}`}>{classify.label}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle size={12} />
              <span>Valores aproximados baseados em tabela nutricional</span>
            </div>
            <button onClick={handleAddParsed} className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm">
              Adicionar refeição
            </button>
          </div>
        )}
      </div>

      {/* Manual add */}
      <button onClick={() => setShowManual(!showManual)} className="flex items-center gap-2 text-sm text-primary">
        <Plus size={16} /> Adicionar manualmente
      </button>

      {showManual && (
        <div className="bg-secondary rounded-xl p-4 border border-border space-y-3">
          {[
            { key: 'name', label: 'Nome', type: 'text' },
            { key: 'grams', label: 'Quantidade (g)', type: 'number' },
            { key: 'calories', label: 'Calorias (kcal)', type: 'number' },
            { key: 'protein', label: 'Proteínas (g)', type: 'number' },
            { key: 'carbs', label: 'Carboidratos (g)', type: 'number' },
            { key: 'fat', label: 'Gorduras (g)', type: 'number' },
          ].map(f => (
            <input key={f.key} type={f.type} placeholder={f.label}
              value={manual[f.key as keyof typeof manual]}
              onChange={e => setManual({ ...manual, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          ))}
          <button onClick={handleAddManual} className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm">
            Salvar
          </button>
        </div>
      )}

      {/* Weight tracking */}
      <div className="bg-secondary rounded-xl p-4 border border-border space-y-3">
        <p className="text-sm font-medium text-foreground">Registrar peso</p>
        <div className="flex gap-2">
          <input type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)}
            placeholder="Peso em kg"
            className="flex-1 px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button onClick={handleAddWeight} className="px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
            Salvar
          </button>
        </div>
      </div>

      {/* Weight chart */}
      {weightHistory.length > 1 && (
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <p className="text-sm font-medium text-foreground mb-3">Evolução do peso</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weightHistory}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} tickFormatter={d => d.split('-').slice(1).join('/')} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 12%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="weight" stroke="hsl(142 76% 46%)" strokeWidth={2} dot={{ fill: 'hsl(142 76% 46%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Today meals list */}
      {todayMeals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Refeições de hoje</p>
          {todayMeals.map(m => (
            <div key={m.id} className="bg-secondary rounded-xl p-3 border border-border flex items-center gap-3">
              <UtensilsCrossed size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground capitalize">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.grams}g · {m.calories} kcal</p>
              </div>
              <div className="text-xs text-muted-foreground">
                P:{m.protein.toFixed(0)} C:{m.carbs.toFixed(0)} G:{m.fat.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
