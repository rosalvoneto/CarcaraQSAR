
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
        index: 1.1,
        name: "Estatística descritiva",
        childs: [],
        href: '/pre-processing',
      },
      {
        index: 1.2,
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
        index: 3.1,
        name: "Algoritmo",
        childs: [],
        href: '/training',
      },
      {
        index: 3.2,
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
        index: 4.1,
        name: "Importância das variáveis",
        childs: [],
        href: '/results',
      },
      {
        index: 4.2,
        name: "Leave One Out",
        childs: [],
        href: '/results',
      },
      {
        index: 4.3,
        name: "K-Fold Cross Validation",
        childs: [],
        href: '/results',
      },
      {
        index: 4.4,
        name: "Y-Scrambling",
        childs: [],
        href: '/results',
      },
      {
        index: 4.5,
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