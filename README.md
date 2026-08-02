# AgendaPro Beauty

O **AgendaPro Beauty** é um sistema completo e corporativo para gestão, agendamento de serviços e controle de catálogos em estabelecimentos do setor de beleza e estética. 

O projeto é estruturado sob o padrão arquitetural MVC (Model-View-Controller), composto por uma API REST robusta em Node.js (Express e Sequelize ORM) e uma interface web interativa (Frontend Single Page Application) projetada com foco em experiência do usuário e design moderno.

---

## Recursos Principais do Sistema

1. **Gestão de Catálogo (Profissionais e Serviços):**
   * CRUD completo de Profissionais e Serviços no painel administrativo.
   * Auto-cadastro de expediente padrão (Segunda a Sábado, 08:00 às 18:00) ao criar novos profissionais.
   * Auto-geração de novos serviços a partir da especialidade do profissional se esta ainda não constar no catálogo.
   * Controle de status (Ativo/Inativo) para profissionais, filtrando-os na tela do cliente.

2. **Lógica de Disponibilidade e Slots de Horários:**
   * Geração dinâmica de slots de tempo disponíveis com base na duração do serviço escolhido.
   * Exclusão automática de horários que coincidam com o expediente fora de serviço ou com bloqueios manuais cadastrados (`BlockedHour`).

3. **Validação de Agendamentos e Regras de Negócio:**
   * Proteção estrita contra reservas duplicadas (choque de horários para o mesmo profissional).
   * Bloqueio contra agendamento ou reagendamento para datas e horários passados.
   * Validação de antecedência mínima de 2 horas para cancelamento ou reagendamento por parte dos clientes.
   * **Bypass de Regras para Administradores:** O admin possui controle total na Agenda Geral, podendo reagendar ou cancelar compromissos a qualquer momento (inclusive no passado ou com menos de 2 horas de antecedência).

4. **Autenticação e Segurança:**
   * Cadastro de usuários com senhas criptografadas de forma segura com `bcrypt`.
   * Fluxo de Login gerando tokens de sessão JWT com validade de 24 horas.
   * Middlewares de segurança que limitam operações de escrita (POST/PUT/DELETE) e visualização de dados gerenciais apenas para administradores.

5. **Dashboard e Relatórios Estatísticos (Sprint 6):**
   * Endpoints de agregação de dados no backend que calculam métricas de performance do salão.
   * Aba de **Relatórios** no painel administrativo exibindo cards KPIs (Total de agendamentos por status) e gráficos de barra horizontal proporcionais detalhando o Top 5 de Serviços e Profissionais mais requisitados.
   * Atualização em tempo real dos dados estatísticos a cada alteração na agenda.

---

## Estrutura do Projeto

```text
agendapro-beauty/
├── config/               # Configuração de conexão do banco de dados (config.json)
├── models/               # Modelos de dados do Sequelize (User, Professional, Service, etc.)
├── migrations/           # Histórico de migrações estruturais do banco de dados
├── seeders/              # Povoamento inicial de tabelas do banco
├── public/               # Frontend (SPA) da aplicação
│   ├── index.html        # Estrutura HTML5 da interface
│   ├── app.js            # Regras de renderização, requisições API e estados
│   └── style.css         # Identidade visual (Tema Escuro, Glassmorphism, Responsividade)
└── src/
    ├── controllers/      # Controladores HTTP (Tratamento de requests e chamadas a services)
    ├── routes/           # Rotas da API REST protegidas por autenticação
    ├── services/         # Camada de lógica de negócio e regras de banco de dados
    ├── middleware/       # Tratamento global de erros e verificação de JWT/Permissões
    └── server.js         # Inicialização do servidor Express
```

---

## Stack Tecnológica

* **Runtime:** Node.js (v18+)
* **Framework Web:** Express
* **ORM:** Sequelize
* **Banco de Dados:** PostgreSQL (Dialeto configurado) / SQLite (para testes rápidos de desenvolvimento)
* **Criptografia & Segurança:** Bcrypt & JWT (JSON Web Tokens)
* **Documentação:** Swagger (exposto em `/api-docs`)

---

## Configuração do Ambiente

### 1. Instalar Dependências
No diretório raiz do projeto, execute:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:
```env
PORT=3000
NODE_ENV=development
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=agendapro_beauty
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=seu_secret_seguro_jwt
```

### 3. Rodar Migrações e Semeadores
Para estruturar o banco de dados e aplicar os registros iniciais (incluindo o administrador padrão `admin@beauty.com` / `AdminPassword123`), execute:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Inicializar a Aplicação
**Modo de Desenvolvimento (com live reload):**
```bash
npm run dev
```

**Modo de Produção:**
```bash
npm start
```
Após iniciar o servidor, abra seu navegador em `http://localhost:3000`. A documentação interativa das rotas da API pode ser visualizada no Swagger através de `http://localhost:3000/api-docs`.

---

## Documentação dos Principais Endpoints da API

### Autenticação (`/auth`)
* **POST `/auth/register`:** Criação de novo usuário.
* **POST `/auth/login`:** Login de usuário, retornando dados cadastrais e token JWT.
* **GET `/auth/me`:** Retorna os dados do usuário autenticado no token da requisição.

### Profissionais (`/professionals`)
* **GET `/professionals`:** Retorna profissionais ativos (para clientes).
* **GET `/professionals?ativo=all`:** Retorna todos os profissionais (para admins).
* **POST `/professionals`** `[Admin Only]`: Cadastra profissional (Gera expediente auto e cria serviço se for especialidade nova).
* **PUT `/professionals/:id`** `[Admin Only]`: Edita cadastro e status ativo/inativo.
* **DELETE `/professionals/:id`** `[Admin Only]`: Remove profissional.

### Serviços (`/services`)
* **GET `/services`:** Retorna todos os serviços disponíveis.
* **GET `/services/area/:area_id`:** Lista serviços de uma área específica.
* **POST `/services`** `[Admin Only]`: Cadastro de novos serviços (ou em lote via JSON Array).
* **PUT `/services/:id`** `[Admin Only]`: Edita serviço.
* **DELETE `/services/:id`** `[Admin Only]`: Remove serviço.

### Agenda de Horários (`/agenda`)
* **POST `/agenda/hours`** `[Admin Only]`: Define ou edita horários de expediente de trabalho.
* **POST `/agenda/blocked`** `[Admin Only]`: Cria bloqueio manual de horários para um profissional.
* **GET `/agenda/slots`:** Consulta horários livres de um profissional em determinada data e serviço.

### Agendamentos (`/appointments`)
* **GET `/appointments`** `[Admin Only]`: Retorna a Agenda Geral do salão com dados de clientes e profissionais.
* **GET `/appointments/my`:** Retorna os agendamentos do usuário autenticado.
* **POST `/appointments`:** Cria agendamento validando conflitos e horários.
* **POST `/appointments/:id/reschedule`:** Reagenda um horário (Valida prazo de 2h para clientes; bypass para admins).
* **POST `/appointments/:id/cancel`:** Cancela um horário (Valida prazo de 2h para clientes; bypass para admins).
* **POST `/appointments/:id/complete`** `[Admin Only]`: Conclui e finaliza um atendimento.

### Relatórios (`/reports`)
* **GET `/reports/dashboard`** `[Admin Only]`: Retorna os agregados estatísticos (Totais por status, Top 5 Serviços, Top 5 Profissionais).
