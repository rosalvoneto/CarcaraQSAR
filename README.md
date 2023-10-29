# CarcaraQSAR - Computational Algorithms to Relate Chemical Attributes with Respective Activities.

Essa aplicação busca facilitar a crição de modelos QSAR através de uma interação mais amigável e intuitiva para o usuário.

## O que é um modelo QSAR?

Um modelo QSAR (Quantitative Structure-Activity Relationship) é uma ferramenta na área de química e ciências farmacêuticas usada para prever ou estimar as propriedades biológicas, químicas ou toxicológicas de substâncias químicas com base em sua estrutura molecular. Esses modelos são particularmente úteis na área de design de fármacos, toxicologia, química ambiental e outras disciplinas relacionadas.

A ideia por trás dos modelos QSAR é que a atividade biológica ou química de uma substância está relacionada à sua estrutura molecular. Portanto, os cientistas usam técnicas estatísticas e matemáticas para estabelecer relações quantitativas entre a estrutura química de uma molécula e sua atividade biológica. Isso envolve a análise de conjuntos de dados experimentais que incluem informações sobre a estrutura e a atividade de várias substâncias químicas.

Para construir um modelo QSAR, você normalmente segue estes passos:

1. Coleta de dados: Reúna um conjunto de dados que inclua informações sobre a estrutura molecular das substâncias e suas atividades biológicas ou químicas.

2. Seleção de descritores: Identifique os descritores moleculares relevantes, como características da estrutura molecular, peso molecular, carga elétrica, grupos funcionais, entre outros, que podem afetar a atividade da substância.

3. Desenvolvimento do modelo: Utilize técnicas estatísticas, como regressão linear, análise de componentes principais, análise discriminante, ou algoritmos de aprendizado de máquina, para construir um modelo que relacione os descritores moleculares à atividade da substância.

4. Validação do modelo: Avalie a qualidade e a capacidade de previsão do modelo usando dados de validação que não foram usados na construção do modelo.

5. Aplicação do modelo: Use o modelo QSAR para prever a atividade de substâncias químicas desconhecidas ou para otimizar o design de novas moléculas com propriedades desejadas.

Os modelos QSAR são extremamente úteis na triagem virtual de compostos químicos, economizando tempo e recursos na pesquisa de novos medicamentos e produtos químicos. Eles também desempenham um papel importante na avaliação de riscos de substâncias químicas e na regulamentação de produtos químicos em relação à segurança ambiental e humana.

## Aplicação

Página de Login

<img alt="Login" title="#Login" src="./assets/project/Login.png" />

Página principal

<img alt="Página principal" title="#MainPage" src="./assets/project/Página principal.png" />

Página de criação de novo projeto

<img alt="Projeto" title="#Project" src="./assets/project/Projeto.png" />

Página de Base de dados do Projeto

<img alt="Base de dados" title="#Database" src="./assets/project/Base de dados.png" />

Além dessas, o projeto tem outras páginas para treinamento de modelo QSAR e páginas auxiliares para a aplicação.

## Execução do projeto

Pré-requisitos para a execução do projeto:
- Docker
- Docker compose

Execute os seguintes comandos no terminal:

```bash
# Clone este repositório
$ git clone https://github.com/rosalvoneto/CarcaraQSAR

# Acesse a pasta do projeto no terminal/cmd
$ cd CarcaraQSAR
```

Você deve visualizar o arquivo ‘docker-compose.yaml’ na raíz do projeto. Este é um arquivo que especifica como configurar a imagem do projeto CarcaraQSAR e especifica também a execução de um container dessa imagem. Para executá-lo, digite no terminal:

```bash
$ docker-compose up
```

Depois de terminar a execução, no terminal deve aparecer os seguintes links da aplicação:
- Local: http://localhost:5173/
- Network: http://172.26.0.2:5173/

OBS.: O link "Network" pode ser diferente da URL acima.

Execute o link "Network" em seu navegador. Se tudo correr bem, no navegador você deve visualizar a página de Login da aplicação.

<img alt="Login" title="#Login" src="./assets/project/Login.png" />
