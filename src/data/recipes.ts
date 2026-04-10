export interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  benefits: string[];
  ingredients: string[];
  instructions: string[];
  isPro: boolean;
  category: 'café' | 'almoço' | 'jantar' | 'lanche' | 'sobremesa';
}

const r = (id: string, name: string, cal: number, prot: number, carb: number, fat: number, prep: number, diff: Recipe['difficulty'], cat: Recipe['category'], isPro: boolean, benefits: string[]): Recipe => ({
  id, name, calories: cal, protein: prot, carbs: carb, fat, prepTime: prep, difficulty: diff, category: cat, isPro,
  benefits, ingredients: ['Ingredientes incluídos na versão completa'], instructions: ['Modo de preparo disponível no app'],
});

export const recipes: Recipe[] = [
  // FREE (20)
  r('r1', 'Omelete Proteico', 280, 25, 5, 18, 10, 'fácil', 'café', false, ['Rico em proteínas', 'Baixo carboidrato']),
  r('r2', 'Smoothie Verde Detox', 180, 8, 30, 4, 5, 'fácil', 'café', false, ['Desintoxicante', 'Rico em fibras']),
  r('r3', 'Frango Grelhado c/ Batata', 420, 38, 35, 12, 25, 'fácil', 'almoço', false, ['Alto em proteína', 'Energia sustentada']),
  r('r4', 'Salada Caesar Fitness', 350, 30, 15, 18, 15, 'fácil', 'almoço', false, ['Nutritiva', 'Baixa caloria']),
  r('r5', 'Wrap de Frango', 380, 32, 28, 14, 10, 'fácil', 'almoço', false, ['Prático', 'Equilibrado']),
  r('r6', 'Arroz c/ Feijão e Frango', 450, 35, 50, 10, 20, 'fácil', 'almoço', false, ['Tradicional', 'Completo']),
  r('r7', 'Salmão c/ Legumes', 380, 35, 15, 20, 25, 'médio', 'jantar', false, ['Ômega 3', 'Anti-inflamatório']),
  r('r8', 'Sopa de Legumes', 180, 8, 25, 5, 20, 'fácil', 'jantar', false, ['Leve', 'Hidratante']),
  r('r9', 'Banana c/ Pasta de Amendoim', 250, 8, 30, 12, 5, 'fácil', 'lanche', false, ['Energia rápida', 'Pré-treino']),
  r('r10', 'Iogurte c/ Granola', 220, 12, 30, 6, 5, 'fácil', 'lanche', false, ['Probiótico', 'Prático']),
  r('r11', 'Panqueca de Aveia', 300, 18, 35, 10, 15, 'fácil', 'café', false, ['Fibras', 'Saciedade']),
  r('r12', 'Tapioca Proteica', 260, 20, 30, 8, 10, 'fácil', 'café', false, ['Sem glúten', 'Rápida']),
  r('r13', 'Peito de Peru c/ Salada', 280, 28, 10, 14, 10, 'fácil', 'jantar', false, ['Low carb', 'Leve']),
  r('r14', 'Ovo Mexido c/ Torrada', 310, 20, 25, 15, 10, 'fácil', 'café', false, ['Rápido', 'Nutritivo']),
  r('r15', 'Mix de Nuts', 200, 6, 8, 16, 2, 'fácil', 'lanche', false, ['Gorduras boas', 'Saciedade']),
  r('r16', 'Batata Doce c/ Frango', 400, 35, 40, 8, 20, 'fácil', 'almoço', false, ['Carboidrato complexo', 'Massa muscular']),
  r('r17', 'Açaí Fitness', 350, 10, 50, 12, 5, 'fácil', 'lanche', false, ['Antioxidante', 'Energia']),
  r('r18', 'Crepioca', 280, 18, 22, 12, 10, 'fácil', 'café', false, ['Sem glúten', 'Proteica']),
  r('r19', 'Salada de Atum', 300, 28, 10, 16, 10, 'fácil', 'jantar', false, ['Ômega 3', 'Prática']),
  r('r20', 'Shake Pós-treino', 320, 30, 35, 8, 5, 'fácil', 'lanche', false, ['Recuperação', 'Proteína rápida']),

  // PRO (100+)
  ...Array.from({ length: 100 }, (_, i) => {
    const names = [
      'Bowl Proteico Tropical', 'Risoto de Quinoa', 'Steak de Tofu', 'Moqueca Fit', 'Lasanha Low Carb',
      'Hambúrguer de Grão-de-Bico', 'Sushi de Quinoa', 'Pizza Proteica', 'Pad Thai Fit', 'Curry de Lentilha',
      'Bolo de Caneca Proteico', 'Pudim Fit', 'Brownie de Batata Doce', 'Mousse de Abacate', 'Sorvete de Banana',
      'Pão de Queijo Fit', 'Coxinha Fit', 'Empada de Frango Light', 'Bolinho de Espinafre', 'Chips de Batata Doce',
      'Tilápia Grelhada', 'Camarão ao Alho', 'Frango Teriyaki', 'Costela no Forno', 'Pernil Desfiado',
      'Torta de Legumes', 'Quiche Low Carb', 'Wraps Asiáticos', 'Tacos Fitness', 'Burrito Bowl',
      'Smoothie Bowl Açaí', 'Parfait de Frutas', 'Overnight Oats', 'Granola Caseira', 'Energy Balls',
      'Salada Mediterrânea', 'Tabule Fit', 'Couscous Marroquino', 'Pasta de Abobrinha', 'Espaguete de Palmito',
      'Nhoque de Batata Doce', 'Ravióli de Espinafre', 'Cannelloni Fit', 'Panqueca Salgada', 'Crepe de Frango',
      'Escondidinho Fit', 'Bobó de Camarão Light', 'Vatapá Fit', 'Acarajé no Forno', 'Cuscuz Nordestino Fit',
      'Frango Xadrez', 'Yakisoba Fit', 'Guioza no Forno', 'Tempurá no Airfryer', 'Spring Roll Fresh',
      'Hummus Caseiro', 'Guacamole Proteico', 'Patê de Atum', 'Antepasto de Berinjela', 'Bruschetta Fit',
      'Mingau Proteico', 'Waffle Fit', 'French Toast Proteica', 'Muffin de Banana', 'Scone de Aveia',
      'Ceviche de Peixe', 'Tartare de Salmão', 'Poke Bowl', 'Chirashi Fit', 'Temaki de Quinoa',
      'Strogonoff Fit', 'Picadinho de Carne', 'Kafta no Forno', 'Almôndega de Peru', 'Isca de Frango',
      'Legumes Assados', 'Purê de Couve-flor', 'Brócolis Gratinado', 'Abobrinha Recheada', 'Berinjela à Parmegiana',
      'Vitamina de Abacate', 'Suco Verde Detox', 'Chá Termogênico', 'Água Saborizada', 'Leite Dourado',
      'Snack de Grão-de-Bico', 'Chips de Couve', 'Pipoca Gourmet Fit', 'Barra de Cereal Caseira', 'Trufa Fit',
      'Refogado Oriental', 'Curry Verde', 'Dhal de Lentilha', 'Falafel Assado', 'Shakshuka',
      'Baião de Dois Fit', 'Galinhada Fit', 'Feijoada Light', 'Arroz de Pato Fit', 'Paella Fit',
      'Torta de Maçã Fit', 'Cheesecake Fit', 'Brigadeiro Fit', 'Pavê Fit', 'Romeu e Julieta Fit',
    ];
    const cats: Recipe['category'][] = ['café', 'almoço', 'jantar', 'lanche', 'sobremesa'];
    const n = names[i % names.length];
    const cal = 200 + Math.round(Math.random() * 400);
    return r(`rp${i+1}`, n, cal, Math.round(cal*0.08), Math.round(cal*0.1), Math.round(cal*0.03), 10 + Math.round(Math.random()*30),
      ['fácil', 'médio', 'difícil'][Math.floor(Math.random()*3)] as Recipe['difficulty'],
      cats[i % 5], true, ['Saudável', 'Nutritivo']);
  }),
];
