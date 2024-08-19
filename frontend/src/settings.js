
export const NavigationBarWidth = 250;
export const delayTimeForGetProgress = 2000;

export const statesProgressBar = [
  {
    index: 0,
    name: "Database",
    childs: [],
    href: '/database',
    stateToPass: {},
  },
  {
    index: 1,
    name: "Pre-processing",
    childs: [
      {
        index: 0,
        name: "Descriptive statistics",
        childs: [],
        href: '/pre-processing',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Normalization",
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
    name: "Variables selection",
    childs: [
      {
        index: 0,
        name: "Remove variables",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 0 },
      },
      {
        index: 1,
        name: "Apply Bioinspired algorithm",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 1 },
      },
      {
        index: 2,
        name: "Remove rows",
        childs: [],
        href: '/variables-selection',
        stateToPass: { pageNumber: 2 },
      },
      {
        index: 3,
        name: "Database history",
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
    name: "Training",
    childs: [],
    href: '/training',
    stateToPass: {},
  },
  {
    index: 4,
    name: "Results",
    childs: [
      {
        index: 0,
        name: "Variables Importance",
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
    name: "Prevision",
    childs: [],
    href: '/prevision',
    stateToPass: {},
  },
];

