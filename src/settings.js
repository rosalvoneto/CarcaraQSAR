
export const NavigationBarWidth = 250;
export const userName = "Daniel Alencar";
export const projectName = "Novo Projeto"
export const statesProgressBar = [
  {
    index: 0,
    name: "Resultados",
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

// Registros da tabela
export const projects = [
  { 
    id: 1, 
    nome: 'Projeto de Descoberta', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 2, 
    nome: 'Projeto de Avaliação Ambiental', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 3, 
    nome: 'Projeto de Desenvolvimento de Produtos Cosméticos', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 4, 
    nome: 'Projeto de Análise de Alimentos', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 5, 
    nome: 'Projeto de Desenvolvimento de Materiais Poliméricos', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 6, 
    nome: 'Projeto de Segurança de Produtos Químicos Domésticos', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
  { 
    id: 7, 
    nome: 'Projeto de Avaliação Ambiental', 
    status: 'Resultados', 
    selecionado: false, 
    date: '10/10/2023' 
  },
];