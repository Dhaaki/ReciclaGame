// Pontos por tipo de material
const POINTS_BY_MATERIAL = {
  papel: 10,
  plástico: 15,
  metal: 20,
  vidro: 25
};

// Níveis baseados em pontuação
const LEVELS = [
  { name: 'iniciante', minPoints: 0, maxPoints: 100 },
  { name: 'consciente', minPoints: 101, maxPoints: 300 },
  { name: 'sustentável', minPoints: 301, maxPoints: 600 },
  { name: 'agente verde', minPoints: 601, maxPoints: Infinity }
];

/**
 * Calcula pontos baseado no tipo de material e quantidade
 */
const calculatePoints = (tipoMaterial, quantidade) => {
  const pointsPerUnit = POINTS_BY_MATERIAL[tipoMaterial.toLowerCase()] || 0;
  return pointsPerUnit * quantidade;
};

/**
 * Determina o nível baseado na pontuação total
 */
const getLevel = (pontosTotais) => {
  for (const level of LEVELS) {
    if (pontosTotais >= level.minPoints && pontosTotais <= level.maxPoints) {
      return level.name;
    }
  }
  return 'iniciante';
};

/**
 * Calcula pontos de quiz
 */
const getQuizPoints = () => {
  return 50;
};

module.exports = {
  calculatePoints,
  getLevel,
  getQuizPoints,
  POINTS_BY_MATERIAL,
  LEVELS
};
