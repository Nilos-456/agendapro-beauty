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
Após iniciar o servidor, abra seu navegador em `http://localhost:3000` para acessar o site de demonstração do sistema.

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

---

## 📖 Manual Técnico de Desenvolvimento (Bloco por Bloco)

Este manual detalha o funcionamento das engrenagens internas do **AgendaPro Beauty**, servindo como guia de manutenção para futuros desenvolvedores.

### 1. Autenticação e Segurança (Criptografia e Validação)

#### Criptografia de Senha no Cadastro
Arquivo: `src/controllers/authController.js`
```javascript
// Criptografar a senha do usuário com hash salt de 10 rounds antes de salvar
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = await User.create({
  name,
  email,
  password: hashedPassword,
  role: role || 'cliente'
});
```
* **O que faz:** Protege as credenciais dos usuários no banco de dados. Utiliza a biblioteca `bcrypt` para gerar um *salt* aleatório e computar o hash da senha enviada, impedindo o armazenamento em texto limpo.

#### Verificação de Sessão (Middleware JWT)
Arquivo: `src/middleware/authMiddleware.js`
```javascript
const token = req.headers['authorization']?.split(' ')[1];
if (!token) {
  return res.status(401).json({ success: false, error: 'Acesso negado. Token não fornecido.' });
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // Injeta os dados decodificados (id, email, role) na requisição
  next();
} catch (err) {
  return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
}
```
* **O que faz:** Intercepta as rotas protegidas da API, extrai o token JWT enviado no header `Authorization: Bearer <token>` e valida sua assinatura utilizando a chave `JWT_SECRET`. Se o token for válido, os dados decodificados (como a `role` e o `id` do usuário) são injetados no objeto `req.user` para uso posterior nos controladores.

---

### 2. Cadastro Automatizado de Expediente e Especialidade (Profissionais)

#### Criação com Semente Automática de Expediente e Serviço
Arquivo: `src/services/professionalService.js` (Método `create`)
```javascript
const professional = await Professional.create({
  nome,
  especialidade,
  telefone,
  ativo: ativo !== undefined ? ativo : true
});

// Cadastra automaticamente o expediente padrão: Segunda (1) a Sábado (6), das 08h às 18h
for (let day = 1; day <= 6; day++) {
  await HourWork.create({
    professional_id: professional.id,
    dia_semana: day,
    hora_inicio: '08:00',
    hora_fim: '18:00'
  });
}

// Se a especialidade não existir na tabela de Serviços, adiciona-a automaticamente
if (especialidade && especialidade.trim() !== '') {
  const allServices = await Service.findAll();
  const match = allServices.find(s => s.nome_servico.trim().toLowerCase() === especialidade.trim().toLowerCase());
  
  if (!match) {
    await Service.create({
      nome_servico: especialidade.trim(),
      preco: 50.00, // Preço padrão sugerido
      duracao: 30,  // Duração padrão sugerida (minutos)
      area_id: 1    // Área padrão (Geral)
    });
  }
}
```
* **O que faz:** Simplifica a entrada de novos profissionais no salão. Quando um novo registro é salvo, o sistema gera automaticamente 6 linhas na tabela `HourWorks` (expediente de segunda a sábado das 08:00 às 18:00). Além disso, verifica se a especialidade dele consta no catálogo de serviços; caso contrário, a insere como um novo serviço cadastrado.

---

### 3. Geração Dinâmica de Slots de Horários Livres

#### Cálculo de Janelas Disponíveis
Arquivo: `src/services/appointmentService.js` (Método `getAvailableSlots`)
```javascript
// 1. Converter limites de trabalho (ex: "08:00" e "18:00") em minutos do dia
const [startH, startM] = workHour.hora_inicio.split(':').map(Number);
const [endH, endM] = workHour.hora_fim.split(':').map(Number);
const inicioExpedienteMinutos = startH * 60 + startM;
const fimExpedienteMinutos = endH * 60 + endM;

const slots = [];
const duracaoServico = service.duracao;

// 2. Iterar em blocos de 30 minutos das 08h às 18h
for (let tempo = inicioExpedienteMinutos; tempo + duracaoServico <= fimExpedienteMinutos; tempo += 30) {
  const horaSlot = Math.floor(tempo / 60);
  const minutoSlot = tempo % 60;
  const stringHora = `${String(horaSlot).padStart(2, '0')}:${String(minutoSlot).padStart(2, '0')}`;
  
  const slotInicioDate = new Date(`${data}T${stringHora}:00`);
  const slotFimDate = new Date(slotInicioDate.getTime() + duracaoServico * 60000);

  // 3. Filtrar se coincide com agendamentos existentes ou com bloqueios manuais
  const conflitoAgendamento = appointments.some(app => {
    const appInicio = new Date(app.data_hora);
    const appFim = new Date(appInicio.getTime() + app.service.duracao * 60000);
    return (slotInicioDate < appFim && slotFimDate > appInicio);
  });

  const conflitoBloqueio = blockedHours.some(block => {
    const blockInicio = new Date(block.inicio);
    const blockFim = new Date(block.fim);
    return (slotInicioDate < blockFim && slotFimDate > blockInicio);
  });

  if (!conflitoAgendamento && !conflitoBloqueio && slotInicioDate > new Date()) {
    slots.push(stringHora);
  }
}
```
* **O que faz:** Monta a grade horária livre do profissional na data selecionada. O algoritmo divide a jornada de trabalho dele em pedaços (slots) de 30 em 30 minutos. Para cada slot gerado, ele valida se coincide com o intervalo de outro atendimento já confirmado (`conflitoAgendamento`) ou com bloqueios manuais cadastrados (`conflitoBloqueio`). Só são listados os horários verdadeiramente disponíveis.

---

### 4. Consistência e Regras contra Choque de Horários

#### Validação de Regras de Negócio na Reserva
Arquivo: `src/services/appointmentService.js` (Método `validateAppointmentRules`)
```javascript
const dataInicio = new Date(data_hora);
const dataFim = new Date(dataInicio.getTime() + service.duracao * 60000);

// Evitar agendamentos no passado
if (dataInicio < new Date()) {
  throw new Error('Não é possível criar ou alterar um agendamento para uma data ou horário passado');
}

// Verificar conflito de horários para o mesmo profissional
const conflict = await Appointment.findOne({
  where: {
    professional_id,
    status: { [Op.notIn]: ['cancelado'] },
    id: excludeAppointmentId ? { [Op.ne]: excludeAppointmentId } : { [Op.not]: null },
    data_hora: {
      [Op.between]: [
        new Date(dataInicio.getTime() - 12 * 60 * 60000), // margem de segurança
        new Date(dataInicio.getTime() + 12 * 60 * 60000)
      ]
    }
  },
  include: [{ model: Service, as: 'service' }]
});

if (conflict) {
  const appInicio = new Date(conflict.data_hora);
  const appFim = new Date(appInicio.getTime() + conflict.service.duracao * 60000);
  if (dataInicio < appFim && dataFim > appInicio) {
    throw new Error('O profissional selecionado já possui um agendamento conflitante neste horário');
  }
}
```
* **O que faz:** Garante a consistência do banco de dados na criação ou reagendamento de reservas. A lógica impede que reservas sejam salvas retroativamente (no passado) e verifica se o profissional já está encarregado de outro serviço ativo no intervalo calculado da reserva, prevenindo a sobreposição de horários (choque de agenda).

---

### 5. Controle Temporário de Cancelamentos e Superpoderes do Admin

#### Validação de Antecedência de 2 Horas e Bypass do Administrador
Arquivo: `src/services/appointmentService.js` (Método `cancel`)
```javascript
if (!isAdmin) {
  // Regra de Negócio: Validar cancelamento com antecedência mínima de 2 horas
  const agora = new Date();
  const dataHoraAgendamento = new Date(appointment.data_hora);

  if (dataHoraAgendamento < agora) {
    throw new Error('Não é possível cancelar um agendamento de uma data ou horário que já passou');
  }

  // Diferença em minutos
  const diferencaMinutos = (dataHoraAgendamento - agora) / (1000 * 60);

  if (diferencaMinutos < 120) { // 120 minutos = 2 horas
    throw new Error('Regra do Estabelecimento: Cancelamentos só são permitidos com no mínimo 2 horas de antecedência');
  }
}

await appointment.update({ status: 'cancelado' });
```
* **O que faz:** Clientes comuns são impedidos de cancelar ou reagendar compromissos se a hora de início estiver a menos de 2 horas do horário atual ou se o compromisso já passou. Entretanto, caso a requisição seja assinada por um token de administrador (`isAdmin === true`), a validação de prazo é completamente ignorada, permitindo que a recepção gerencie a agenda em casos excepcionais.

---

### 6. Agregados Estatísticos (Dashboard de Relatórios)

#### Consolidação e Métricas de Desempenho
Arquivo: `src/controllers/reportController.js` (Método `getDashboardStats`)
```javascript
// 1. Contagem total agrupada por status (agendado, confirmado, concluído, cancelado)
const statusStats = await Appointment.findAll({
  attributes: [
    'status',
    [fn('COUNT', col('id')), 'count']
  ],
  group: ['status']
});

// 2. Ranking de serviços mais solicitados (Top 5)
const serviceStats = await Appointment.findAll({
  attributes: [
    'service_id',
    [fn('COUNT', col('Appointment.id')), 'count']
  ],
  include: [{ model: Service, as: 'service', attributes: ['nome_servico'] }],
  group: ['service_id', 'service.id'],
  order: [[fn('COUNT', col('Appointment.id')), 'DESC']],
  limit: 5
});
```
* **O que faz:** Realiza a agregação matemática no banco de dados. Usa funções agregadoras do Sequelize (`COUNT`) combinadas com agrupamentos (`group` do SQL) e ordenações para extrair as principais estatísticas do salão (Top 5 Serviços e Profissionais) em uma única requisição.

---

### 7. Finalização de Atendimentos

#### Conclusão Logística de Agendamentos (Admin Only)
Arquivo: `src/services/appointmentService.js` (Método `complete`)
```javascript
async complete(id, isAdmin = false) {
  try {
    if (!isAdmin) {
      throw new Error('Acesso negado. Apenas administradores podem concluir atendimentos');
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    if (appointment.status === 'cancelado') {
      throw new Error('Não é possível concluir um agendamento cancelado');
    }

    if (appointment.status === 'concluido') {
      throw new Error('Este agendamento já foi concluído');
    }

    await appointment.update({ status: 'concluido' });
    return appointment;
  } catch (error) {
    throw new Error(error.message);
  }
}
```
* **O que faz:** Permite que o administrador dê baixa nos agendamentos. Quando o cliente paga no caixa, o administrador clica no botão "Concluir" no painel. O método valida o perfil de admin, a existência do registro e atualiza o status para `concluido` na base de dados.

---

### 8. Orquestração e Reatividade do Frontend (Single Page Application)

#### Seleção e Alternância de Abas
Arquivo: `public/app.js` (Método `switchAdminSubtab`)
```javascript
function switchAdminSubtab(type) {
  tabManageProfessionals.classList.remove('active');
  tabManageServices.classList.remove('active');
  tabManageAppointments.classList.remove('active');
  tabManageReports.classList.remove('active');

  panelProfessionals.classList.add('hidden');
  panelServices.classList.add('hidden');
  panelAppointments.classList.add('hidden');
  panelReports.classList.add('hidden');

  if (type === 'professionals') {
    tabManageProfessionals.classList.add('active');
    panelProfessionals.classList.remove('hidden');
  } else if (type === 'reports') {
    tabManageReports.classList.add('active');
    panelReports.classList.remove('hidden');
    loadAdminReports();
  }
  // ... outras abas
}
```
* **O que faz:** Controla a visibilidade dos painéis gerenciais no navegador. Ao alternar entre as abas, o script JavaScript remove as classes `active` dos botões e insere a classe utilitária `hidden` nos painéis inativos, ativando as requisições API correspondentes para manter a tela sempre atualizada.

