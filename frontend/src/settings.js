
export const NavigationBarWidth = 250;
export const projectName = "Novo Projeto";

export const userName = "USERNAME";

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
    childs: [],
    href: '/variables-selection',
    stateToPass: {},
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
    name: "Outliers",
    childs: [],
    href: '/outliers',
    stateToPass: {},
  },
];

export const variablesNames = [
  "Variável 1",
  "Variável 2",
  "Variável 3",
  "Variável 4",
  "Variável 5",
  "Variável 6",
  "Variável 7",
  "Variável 8",
  "Variável 9",
  "Variável 10",
  "Variável 11",
  "Variável 12",
  "Variável 13",
  "Variável 14",
  "Variável 15",
  "Variável 16",
  "Variável 17",
  "Variável 18",
  "Variável 19",
  "Variável 20",
];

export const registers = [
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
];
