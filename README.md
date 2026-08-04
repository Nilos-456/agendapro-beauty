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

## 📖 Manual de Desenvolvimento Completo (Arquivo por Arquivo)

Este manual descreve detalhadamente cada arquivo contido no projeto **AgendaPro Beauty**, apresentando o código centralizado e explicando o que cada bloco faz.

---

### 📂 Diretório `models/` (Modelagem de Banco de Dados)

#### 📄 `models/index.js` (Inicialização e Associações do Sequelize)
* **Objetivo:** Conecta o Sequelize ORM ao banco de dados relacional e carrega dinamicamente todos os outros arquivos de modelo desta pasta, aplicando as relações (`associate`) definidas.
* **Código e Funcionamento:**
```javascript
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
```
* **Explicação:**
  1. Carrega as credenciais e o dialeto correspondentes ao ambiente (`development`, `production`).
  2. Instancia a conexão do Sequelize.
  3. Varre o diretório `models/`, ignorando arquivos ocultos e o próprio `index.js`, para instanciar cada modelo (`User`, `Professional`, `Service`, etc.) e armazená-los no objeto exportado `db`.
  4. Executa os métodos `associate` em cada modelo mapeado para amarrar as chaves estrangeiras entre tabelas.

#### 📄 `models/user.js` (Entidade Usuário)
* **Objetivo:** Representa os usuários (Clientes e Administradores) cadastrados no sistema.
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'cliente' }
  });
  User.associate = (models) => {
    User.hasMany(models.Appointment, { foreignKey: 'user_id', as: 'appointments' });
  };
  return User;
};
```
* **Explicação:** Define a estrutura da tabela `Users`. Obriga o uso de e-mail exclusivo (`unique`) para evitar cadastros duplicados. Possui associação `hasMany` com agendamentos, indicando que um cliente pode reservar múltiplos atendimentos.

#### 📄 `models/professional.js` (Entidade Profissional)
* **Objetivo:** Representa os prestadores de serviços do estabelecimento.
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Professional = sequelize.define('Professional', {
    nome: { type: DataTypes.STRING, allowNull: false },
    especialidade: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  Professional.associate = (models) => {
    Professional.hasMany(models.HourWork, { foreignKey: 'professional_id', as: 'workingHours' });
    Professional.hasMany(models.BlockedHour, { foreignKey: 'professional_id', as: 'blockedHours' });
    Professional.hasMany(models.Appointment, { foreignKey: 'professional_id', as: 'appointments' });
  };
  return Professional;
};
```
* **Explicação:** Mapeia a tabela `Professionals`. Contém o campo booleano `ativo` que controla se o profissional está visível para agendamento. Possui associações `hasMany` com expedientes (`HourWork`), bloqueios manuais (`BlockedHour`) e agendamentos.

#### 📄 `models/service.js` (Entidade Serviço)
* **Objetivo:** Representa as especialidades e serviços oferecidos no salão.
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    nome_servico: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duracao: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 }, // minutos
    area_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  });
  Service.associate = (models) => {
    Service.hasMany(models.Appointment, { foreignKey: 'service_id', as: 'appointments' });
  };
  return Service;
};
```
* **Explicação:** Mapeia a tabela `Services`. Define o tempo de atendimento do serviço em minutos (`duracao`) para a lógica de geração de slots. O atributo `area_id` categoriza o serviço (ex: 1 = Cabelo, 2 = Unha).

#### 📄 `models/hourwork.js` (Entidade Expediente de Trabalho)
* **Objetivo:** Define os horários de entrada e saída padrão de cada profissional para cada dia da semana.
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const HourWork = sequelize.define('HourWork', {
    professional_id: { type: DataTypes.INTEGER, allowNull: false },
    dia_semana: { type: DataTypes.INTEGER, allowNull: false }, // 0 = Domingo, 6 = Sábado
    hora_inicio: { type: DataTypes.STRING, allowNull: false }, // "HH:MM"
    hora_fim: { type: DataTypes.STRING, allowNull: false }     // "HH:MM"
  });
  HourWork.associate = (models) => {
    HourWork.belongsTo(models.Professional, { foreignKey: 'professional_id', as: 'professional' });
  };
  return HourWork;
};
```
* **Explicação:** Registra os dias da semana (`dia_semana`) em que o profissional trabalha e seu expediente. A associação `belongsTo` vincula cada expediente a um único profissional.

#### 📄 `models/blockedhour.js` (Entidade Bloqueios de Agenda)
* **Objetivo:** Representa datas e horários bloqueados manualmente para eventos extraordinários (reunião, almoço, atestado).
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const BlockedHour = sequelize.define('BlockedHour', {
    professional_id: { type: DataTypes.INTEGER, allowNull: false },
    inicio: { type: DataTypes.DATE, allowNull: false },
    fim: { type: DataTypes.DATE, allowNull: false },
    motivo: { type: DataTypes.STRING, allowNull: true }
  });
  BlockedHour.associate = (models) => {
    BlockedHour.belongsTo(models.Professional, { foreignKey: 'professional_id', as: 'professional' });
  };
  return BlockedHour;
};
```
* **Explicação:** Guarda faixas completas de data e hora (`inicio` e `fim`) em que um profissional estará indisponível.

#### 📄 `models/appointment.js` (Entidade Agendamento / Reserva)
* **Objetivo:** Centraliza os agendamentos registrados no salão de beleza.
* **Mapeamento:**
```javascript
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    data_hora: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'agendado' }, // agendado, confirmado, concluido, cancelado
    observacoes: { type: DataTypes.TEXT, allowNull: true },
    professional_id: { type: DataTypes.INTEGER, allowNull: false },
    service_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true }
  });
  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Professional, { foreignKey: 'professional_id', as: 'professional' });
    Appointment.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    Appointment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };
  return Appointment;
};
```
* **Explicação:** Vincula um horário (`data_hora`) a um profissional, um serviço e um cliente (usuário). Controla o estado de ciclo de vida da reserva através do campo `status`.

---

### 📂 Diretório `src/services/` (Regras de Negócio Centrais)

#### 📄 `src/services/professionalService.js` (Lógica Cadastral de Profissionais)
* **Objetivo:** Gerencia as regras de negócio ao salvar profissionais no banco.
* **Método `create`:**
```javascript
async create(data) {
  const { nome, especialidade, telefone, ativo } = data;

  if (!nome || !especialidade || !telefone) {
    throw new Error('Nome, especialidade e telefone são obrigatórios');
  }

  const professional = await Professional.create({
    nome,
    especialidade,
    telefone,
    ativo: ativo !== undefined ? ativo : true
  });

  // Expediente padrão auto-gerado
  for (let day = 1; day <= 6; day++) {
    await HourWork.create({
      professional_id: professional.id,
      dia_semana: day,
      hora_inicio: '08:00',
      hora_fim: '18:00'
    });
  }

  // Auto-geração de novos serviços
  if (especialidade && especialidade.trim() !== '') {
    const allServices = await Service.findAll();
    const match = allServices.find(s => s.nome_servico.trim().toLowerCase() === especialidade.trim().toLowerCase());
    
    if (!match) {
      await Service.create({
        nome_servico: especialidade.trim(),
        preco: 50.00,
        duracao: 30,
        area_id: 1
      });
    }
  }

  return professional;
}
```
* **Explicação:** Ao persistir o profissional, cria seu expediente de trabalho semanal básico (Segunda a Sábado, 08h às 18h). Também varre o catálogo de serviços: caso a especialidade do profissional seja inédita, cria um serviço associado a ela de R$ 50,00 e 30 minutos de duração.

#### 📄 `src/services/agendaService.js` (Gestão de Disponibilidade e Bloqueios)
* **Objetivo:** Controla bloqueios na agenda de profissionais e computa horários disponíveis.
* **Método `getAvailability`:**
```javascript
async getAvailability(professionalId, dateString, serviceId) {
  const service = await Service.findByPk(serviceId);
  const professional = await Professional.findByPk(professionalId);
  
  const parts = dateString.split('-');
  const queryDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const diaSemana = queryDate.getDay();

  const workingHours = await HourWork.findAll({
    where: { professional_id: professionalId, dia_semana: diaSemana }
  });

  const startOfDay = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  const endOfDay = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);

  // Busca agendamentos e bloqueios na data solicitada
  const appointments = await Appointment.findAll({
    where: { professional_id: professionalId, status: { [Op.notIn]: ['cancelado'] }, data_hora: { [Op.between]: [startOfDay, endOfDay] } },
    include: [{ model: Service, as: 'service' }]
  });

  const blockedHours = await BlockedHour.findAll({
    where: { professional_id: professionalId, [Op.or]: [
      { inicio: { [Op.between]: [startOfDay, endOfDay] } },
      { fim: { [Op.between]: [startOfDay, endOfDay] } },
      { inicio: { [Op.lte]: startOfDay }, fim: { [Op.gte]: endOfDay } }
    ]}
  });

  const availableSlots = [];
  const serviceDurationMs = service.duracao * 60 * 1000;

  for (const work of workingHours) {
    const [sh, sm] = work.hora_inicio.split(':');
    const [eh, em] = work.hora_fim.split(':');
    const shiftStart = new Date(parts[0], parts[1] - 1, parts[2], parseInt(sh), parseInt(sm), 0, 0);
    const shiftEnd = new Date(parts[0], parts[1] - 1, parts[2], parseInt(eh), parseInt(em), 0, 0);

    let slotStart = new Date(shiftStart);
    const now = new Date();

    while (true) {
      const slotEnd = new Date(slotStart.getTime() + serviceDurationMs);
      if (slotEnd > shiftEnd) break;

      if (slotStart >= now || queryDate.toDateString() !== now.toDateString()) {
        let hasOverlap = false;

        // Validar conflitos com agendamentos existentes
        for (const app of appointments) {
          const appStart = new Date(app.data_hora);
          const appEnd = new Date(appStart.getTime() + app.service.duracao * 60 * 1000);
          if (slotStart < appEnd && slotEnd > appStart) { hasOverlap = true; break; }
        }

        // Validar conflitos com bloqueios manuais
        if (!hasOverlap) {
          for (const block of blockedHours) {
            const blockStart = new Date(block.inicio);
            const blockEnd = new Date(block.fim);
            if (slotStart < blockEnd && slotEnd > blockStart) { hasOverlap = true; break; }
          }
        }

        if (!hasOverlap) {
          const formattedTime = slotStart.toTimeString().split(' ')[0].substring(0, 5);
          availableSlots.push({ time: formattedTime, dateTime: slotStart.toISOString() });
        }
      }
      slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
    }
  }
  return availableSlots;
}
```
* **Explicação:** Esse algoritmo calcula em tempo de execução os slots vazios de um profissional:
  1. Localiza a jornada de trabalho dele para o dia da semana consultado.
  2. Varre o dia de 30 em 30 minutos gerando os slots com base na duração do serviço.
  3. Checa a sobreposição: se o slot começar antes de um agendamento/bloqueio terminar e terminar depois de o agendamento/bloqueio começar, há conflito e o horário é descartado.
  4. Também descarta horários do dia atual que já passaram do momento de consulta (`slotStart >= now`).

#### 📄 `src/services/appointmentService.js` (Regras de Negócio e Estados dos Compromissos)
* **Objetivo:** Executa as validações, regras de antecedência de 2 horas e modificações transacionais dos atendimentos.
* **Método `validateAppointmentRules`:**
```javascript
async validateAppointmentRules(professional_id, service_id, data_hora, excludeAppointmentId = null) {
  const professional = await Professional.findByPk(professional_id);
  const service = await Service.findByPk(service_id);

  const dataInicio = new Date(data_hora);
  const dataFim = new Date(dataInicio.getTime() + service.duracao * 60000);

  if (dataInicio < new Date()) {
    throw new Error('Não é possível criar ou alterar um agendamento para uma data ou horário passado');
  }

  // Verifica concorrência de horários
  const conflict = await Appointment.findOne({
    where: {
      professional_id,
      status: { [Op.notIn]: ['cancelado'] },
      id: excludeAppointmentId ? { [Op.ne]: excludeAppointmentId } : { [Op.not]: null },
      data_hora: { [Op.between]: [new Date(dataInicio.getTime() - 12*60*60000), new Date(dataInicio.getTime() + 12*60*60000)] }
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
  return { dataInicio, dataFim };
}
```
* **Explicação:** Centraliza as checagens críticas de segurança. Lança exceções caso o agendamento seja marcado retroativamente ou caso o profissional já tenha compromisso agendado que coincida com a faixa de tempo calculada (início e término).
* **Método `reschedule` (Reagendamento Transacional):**
```javascript
async reschedule(id, data, isAdmin = false) {
  const transaction = await Appointment.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(id);
    if (appointment.status === 'cancelado') throw new Error('Não é possível reagendar um agendamento já cancelado');

    if (!isAdmin) {
      // Regra de antecedência de 2h para clientes normais
      const agora = new Date();
      const appDate = new Date(appointment.data_hora);
      if ((appDate - agora) / (1000 * 60) < 120) {
        throw new Error('Regra do Estabelecimento: Reagendamentos só são permitidos com no mínimo 2 horas de antecedência');
      }
    }

    // Altera o agendamento antigo para cancelado na transação
    await appointment.update({ status: 'cancelado' }, { transaction });

    const newAppointment = await Appointment.create({
      professional_id: data.professional_id || appointment.professional_id,
      service_id: data.service_id || appointment.service_id,
      user_id: appointment.user_id,
      data_hora: data.data_hora,
      status: 'agendado'
    }, { transaction });

    await transaction.commit();
    return newAppointment;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
}
```
* **Explicação:** Executa o reagendamento de forma atômica utilizando transações do Sequelize. Se a reserva antiga for cancelada mas a nova falhar por conflito de horários na validação, o banco desfaz as alterações (`rollback`), garantindo que o cliente não perca o horário dele original em caso de falha. O administrador ignora a validação das 2h de antecedência via parâmetro `isAdmin`.

---

### 📂 Diretório `src/controllers/` (Controladores HTTP)

#### 📄 `src/controllers/authController.js` (Registro e Autenticação de Usuários)
* **Objetivo:** Responsável pelos processos de login e cadastro na aplicação.
```javascript
async register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, error: 'E-mail já cadastrado.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword, role: role || 'cliente' });
    return res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) { next(err); }
}
```
* **Explicação:**
  * O método `register` encripta a senha com `bcrypt` antes de salvá-la no banco.
  * O método `login` (não listado acima) valida se o e-mail existe, compara a senha usando `bcrypt.compare` e, se correto, assina um token JWT contendo `id`, `email` e `role` com validade de 24 horas.

#### 📄 `src/controllers/reportController.js` (Agregador Estatístico do Dashboard)
* **Objetivo:** Consolida os dados e métricas em um endpoint para o painel do administrador.
```javascript
async getDashboardStats(req, res, next) {
  try {
    const statusStats = await Appointment.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status']
    });

    const serviceStats = await Appointment.findAll({
      attributes: ['service_id', [fn('COUNT', col('Appointment.id')), 'count']],
      include: [{ model: Service, as: 'service', attributes: ['nome_servico'] }],
      group: ['service_id', 'service.id'],
      order: [[fn('COUNT', col('Appointment.id')), 'DESC']],
      limit: 5
    });

    // Retorna os dados agrupados e formatados em formato JSON
    return res.status(200).json({
      success: true,
      data: { totals, topServices, topProfessionals }
    });
  } catch (error) { next(error); }
}
```
* **Explicação:** Utiliza agregadores do Sequelize (`COUNT`) combinados a cláusulas `GROUP BY` e `ORDER BY` para compilar o totalizador de atendimentos por status (ativos, cancelados, concluídos) e a lista do Top 5 Serviços e Profissionais do salão.

#### 📄 `src/controllers/ProfessionalController.js` (Gerenciador do CRUD de Profissionais)
* **Objetivo:** Trata requisições para listar, buscar, cadastrar, atualizar ou apagar profissionais.
```javascript
async index(req, res, next) {
  try {
    const filters = req.query; // Captura query parameters (ex: ?ativo=all)
    const professionals = await professionalService.listAll(filters);
    return res.status(200).json({ success: true, count: professionals.length, data: professionals });
  } catch (error) { next(error); }
}
```
* **Explicação:** Mapeia os métodos REST aos métodos correspondentes em `professionalService`. Trata query parameters (ex: `ativo=all` para retornar inativos na tela gerencial).

#### 📄 `src/controllers/ServiceController.js` (Gerenciador de Serviços e Inserção Massiva)
* **Objetivo:** Controla o catálogo de serviços do salão.
```javascript
async storeBulk(req, res, next) {
  try {
    const servicesData = req.body;
    if (!Array.isArray(servicesData)) {
      return res.status(400).json({ success: false, error: 'O corpo da requisição deve ser um array de serviços.' });
    }
    const createdServices = await Service.bulkCreate(servicesData);
    return res.status(201).json({ success: true, message: 'Serviços cadastrados com sucesso!', data: createdServices });
  } catch (error) { next(error); }
}
```
* **Explicação:** Contém a lógica de escrita de novos serviços. Suporta o cadastro individual e cadastro massivo em lote (`bulkCreate`) a partir de uma lista JSON no método `storeBulk`.

#### 📄 `src/controllers/appointmentController.js` (Gerenciador de Atendimentos)
* **Objetivo:** Trata requisições HTTP para agendar, reagendar, cancelar e concluir serviços.
```javascript
async cancel(req, res, next) {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'administrador');
    const appointment = await appointmentService.cancel(id, isAdmin);
    return res.status(200).json({ success: true, message: 'Agendamento cancelado com sucesso!', data: appointment });
  } catch (error) { next(error); }
}
```
* **Explicação:** Intermedeia as ações de escrita da agenda. Detecta se a requisição é assinada por um administrador decodificando o token no middleware e repassa `isAdmin` aos serviços para aplicar ou contornar as validações de limite de 2h.

---

### 📂 Diretório `src/middleware/` (Processamento de Requisições)

#### 📄 `src/middleware/authMiddleware.js` (Verificador de Sessão JWT)
* **Objetivo:** Valida se a requisição possui um token JWT válido e descriptografa o perfil do usuário.
* **Explicação:** *(Detalhado na seção 1 do manual anterior)*. Exige header `Authorization: Bearer <JWT>`.

#### 📄 `src/middleware/adminMiddleware.js` (Restrição para Perfil Admin)
* **Objetivo:** Protege rotas críticas (como alteração de serviços e relatórios) para perfis administrativos.
```javascript
module.exports = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'administrador')) {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Acesso negado. Esta operação exige privilégios de administrador.' });
  }
};
```
* **Explicação:** Verifica se a chave `role` injetada em `req.user` é igual a `admin`. Se for, autoriza a passagem; se não, bloqueia a chamada retornando `403 Forbidden`.

#### 📄 `src/middleware/errorHandler.js` (Tratamento Global de Exceções)
* **Objetivo:** Captura qualquer erro lançado nas rotas da API e envia um JSON amigável ao cliente.
```javascript
module.exports = (err, req, res, next) => {
  console.error('🚨 Erro Capturado:', err.stack || err.message);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: err.message || 'Ocorreu um erro interno no servidor.'
  });
};
```
* **Explicação:** Centraliza o tratamento de erros. Garante que erros de validação ou de banco de dados não quebrem a aplicação inteira e que a resposta enviada ao frontend seja padronizada e legível.

---

### 📂 Diretório `src/` (Inicialização e Roteamento)

#### 📄 `src/server.js` (Configuração Central da Aplicação)
* **Objetivo:** Constrói e executa o servidor da aplicação.
```javascript
const app = express();

// Servir a pasta estática /public para o frontend
app.use(express.static('public'));
app.use(express.json());

// Registrar rotas
app.use('/auth', authRoutes);
app.use('/professionals', professionalRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/reports', reportRoutes);
app.use(agendaRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```
* **Explicação:**
  1. Instancia o Express.
  2. Declara o middleware estático `express.static('public')` para servir o frontend diretamente no caminho raiz (`/`).
  3. Habilita o parse de JSON nas payloads das requisições (`express.json()`).
  4. Encaminha as requisições aos arquivos de rotas correspondentes.
  5. Adiciona o middleware global de tratamento de erros ao final.
  6. Inicia o escutador de eventos do servidor Express na porta 3000.

---

### 📂 Diretório `public/` (Frontend SPA)

#### 📄 `public/index.html` (Interface Gráfica)
* **Objetivo:** Contém a casca HTML5 estrutural da aplicação.
* **Explicação:**
  * Utiliza uma única página (Single Page Application) com seções alternáveis.
  * Possui a tela de boas-vindas e formulário de Login / Registro.
  * Possui a visão do cliente com cards dinâmicos para agendar serviços.
  * Possui o **Painel do Administrador** com sub-abas para gerenciar profissionais, serviços, tabela da agenda geral e o painel de Relatórios.

#### 📄 `public/app.css` (Identidade Visual e Efeitos Glow)
* **Objetivo:** Define o visual, cores e responsividade do sistema.
* **Explicação:**
  * Define um tema escuro (Dark Theme) contemporâneo.
  * Implementa **Glassmorphism** nos cartões e formulários (painéis com efeito translúcido usando `backdrop-filter: blur`).
  * Estiliza as **barras de progresso horizontais com gradiente** para representar a popularidade estatística dos serviços e profissionais mais solicitados.

#### 📄 `public/app.js` (Lógica de Tela, Requisições e Renderização)
* **Objetivo:** Orquestra toda a reatividade do sistema no navegador do usuário.
* **Estrutura de Gerenciamento de Abas:**
```javascript
function switchAdminSubtab(type) {
  // Remove classes ativas de todas as sub-abas e oculta todos os painéis do admin
  tabManageProfessionals.classList.remove('active');
  tabManageServices.classList.remove('active');
  tabManageAppointments.classList.remove('active');
  tabManageReports.classList.remove('active');

  panelProfessionals.classList.add('hidden');
  panelServices.classList.add('hidden');
  panelAppointments.classList.add('hidden');
  panelReports.classList.add('hidden');

  // Mostra o painel correto e chama sua respectiva API de carregamento de dados
  if (type === 'professionals') {
    tabManageProfessionals.classList.add('active');
    panelProfessionals.classList.remove('hidden');
    loadAdminProfessionals();
  } else if (type === 'reports') {
    tabManageReports.classList.add('active');
    panelReports.classList.remove('hidden');
    loadAdminReports();
  }
  // ... outras abas
}
```
* **Explicação:**
  * Gerencia os estados de login: armazena o token JWT obtido no `localStorage` e o utiliza nos headers de autorização nas chamadas subsequentes à API.
  * Captura formulários (Cadastro de profissional, agendamento de slots) e envia requests `POST`/`PUT`/`DELETE` via fetch.
  * Renderiza dinamicamente as tabelas de listagem de dados.
  * Mantém o dashboard atualizado chamando `loadAdminReports()` sempre que modificações de reservas ocorrem de forma integrada.
