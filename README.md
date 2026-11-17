# Nakaback – Jogo da Memória

## Sobre o projeto

O Nakaback é um jogo da memória desenvolvido como uma aplicação web, com o objetivo de proporcionar entretenimento por meio de desafios de concentração, atenção e memorização.

O jogo permite que os usuários escolham entre jogar individualmente ou em dupla, além de selecionar diferentes níveis de dificuldade.

## Funcionalidades

- Modo de jogo para 1 jogador.
- Modo de jogo para 2 jogadores.
- Três níveis de dificuldade: fácil, médio e difícil.
- Cartas embaralhadas a cada partida.
- Sistema de pontuação.
- Cronômetro para acompanhar o tempo de jogo.
- Contagem de jogadas.
- Tela de resultados ao finalizar uma partida.
- Cadastro de usuários.
- Login e autenticação utilizando Supabase.
- Confirmação de e-mail.
- Sistema de ranking com as melhores pontuações.
- Opções de personalização de tema e música.

## Tecnologias utilizadas

- React: desenvolvimento da interface.
- Vite: ferramenta de desenvolvimento e execução.
- JavaScript: implementação da lógica do jogo.
- CSS: estilização das páginas e componentes.
- Supabase: autenticação de usuários e armazenamento das pontuações.
- React Router DOM: navegação entre páginas.
- Lucide React: biblioteca de ícones.
- Zod: validação de formulários.

## Como executar o projeto

### 1. Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js
- npm

### 2. Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone URL_DO_REPOSITORIO
cd Nakaback/jogo-da-memoria
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as informações do Supabase:

```env
VITE_SUPABASE_URL=URL_DO_SEU_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

### 5. Execute o projeto

```bash
npm run dev
```

Após executar o comando, abra no navegador o endereço apresentado pelo Vite, geralmente:

http://localhost:5173

## Outros comandos

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar a versão de produção:

```bash
npm run preview
```

Para verificar problemas no código:

```bash
npm run lint
```

## Estrutura do projeto

```text
jogo-da-memoria/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── styles/
├── .env
├── .env.example
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Sistema de pontuação

No modo individual, o jogador recebe pontos pelos pares encontrados e perde pontos de acordo com a quantidade de jogadas realizadas.

No modo para dois jogadores, cada par encontrado vale um ponto. Os jogadores alternam suas jogadas, e vence aquele que encontrar mais pares.

## Banco de dados

O projeto utiliza o Supabase para realizar a autenticação dos usuários e armazenar as pontuações utilizadas no ranking.

## Melhorias futuras

- Implementação da recuperação de senha por e-mail.
- Melhorias na experiência do usuário.
- Implementação de novas funcionalidades e desafios.
- Aprimoramento do sistema de ranking.

---

**Projeto: Nakaback – Jogo da Memória**
