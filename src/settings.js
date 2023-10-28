
export const NavigationBarWidth = 250;
export const userName = "Daniel Alencar";
export const statesProgressBar = [
  {
    index: 0,
    name: "Base de Dados",
    childs: [],
    href: '/database',
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
      },
      {
        index: 1,
        name: "Normalização dos dados",
        childs: [],
        href: '/pre-processing',
      },
    ]
  },
  {
    index: 2,
    name: "Seleção de Variáveis",
    childs: [],
    href: '/variables-selection',
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
      },
      {
        index: 1,
        name: "Hiperparâmetros",
        childs: [],
        href: '/training',
      },
    ]
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
      },
      {
        index: 1,
        name: "Leave One Out",
        childs: [],
        href: '/results',
      },
      {
        index: 2,
        name: "K-Fold Cross Validation",
        childs: [],
        href: '/results',
      },
      {
        index: 3,
        name: "Y-Scrambling",
        childs: [],
        href: '/results',
      },
      {
        index: 4,
        name: "Bootstrap",
        childs: [],
        href: '/results',
      },
    ]
  },
  {
    index: 5,
    name: "Outliers",
    childs: [],
    href: '/outliers',
  },
];