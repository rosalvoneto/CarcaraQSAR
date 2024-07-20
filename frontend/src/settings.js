
export const NavigationBarWidth = 250;
export const delayTimeForGetProgress = 2000;

export const statesProgressBar = [
  {
    index: 0,
    name: "Base de dados",
    childs: [],
    href: '/database',
    stateToPass: {},
  },
  {
    index: 1,
    name: "Pré-processamento",
    childs: [
      {
        index: 0,
        name: "Estatística descritiva",
        childs: [],
        href: '/pre-processing',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Normalização dos dados",
        childs: [],
        href: '/pre-processing',
        stateToPass: { pageNumber: 1 },
      },
    ],
    href: '/pre-processing',
    stateToPass: { pageNumber: 0 },
  },
  {
    index: 2,
    name: "Seleção de Variáveis",
    childs: [
      {
        index: 0,
        name: "Remover variáveis",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Aplicar algoritmo Bioinspirado",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 1 },
      },
      {
        index: 2,
        name: "Remover linhas",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 2 },
      },
      {
        index: 3,
        name: "Histórico da base de dados",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 3 },
      },
    ],
    href: '/variables-selection',
    stateToPass: { pageNumber: 0 },
  },
  {
    index: 3,
    name: "Treinamento",
    childs: [
      {
        index: 0,
        name: "Algoritmo",
        childs: [],
        href: '/training',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Hiperparâmetros",
        childs: [],
        href: '/training',
        stateToPass: { pageNumber: 1 },
      },
    ],
    href: '/training',
    stateToPass: { pageNumber: 0 },
  },
  {
    index: 4,
    name: "Resultados",
    childs: [
      {
        index: 0,
        name: "Importância das variáveis",
        childs: [],
        href: '/results',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Leave One Out",
        childs: [],
        href: '/results',
        stateToPass: { pageNumber: 1 },
      },
      {
        index: 2,
        name: "K-Fold Cross Validation",
        childs: [],
        href: '/results',
        stateToPass: { pageNumber: 2 },
      },
      {
        index: 3,
        name: "Y-Scrambling",
        childs: [],
        href: '/results',
        stateToPass: { pageNumber: 3 },
      },
      {
        index: 4,
        name: "Bootstrap",
        childs: [],
        href: '/results',
        stateToPass: { pageNumber: 4 },
      },
    ],
    href: '/results',
    stateToPass: { pageNumber: 0 },
  },
  {
    index: 5,
    name: "Previsão",
    childs: [],
    href: '/prevision',
    stateToPass: {},
  },
];

