# AgendaPro Beauty

O AgendaPro Beauty é uma API REST corporativa desenvolvida para otimizar o fluxo de gestão, controle de catálogo e agendamento de serviços em estabelecimentos do setor de beleza e estética. 

A aplicação foi projetada sob o padrão arquitetural MVC (Model-View-Controller), implementada sobre o ecossistema Node.js com o framework Express, utilizando o Sequelize ORM para a abstraction, migração e persistência de dados em um banco de dados relacional.

---

## Status do Projeto: Sprint 3 (Marcos Concluídos)

A arquitetura do ecossistema, os mapeamentos relacionais e as regras estritas de consistência de agenda foram completamente validados, testados e homologados.

### Escopo Consolidado por Etapas:

* **Arquitetura Base (Sprint 1):** Estruturação do padrão de diretórios da API, garantindo o desacoplamento das camadas de responsabilidade (controllers, routes, models e migrations).
* **Camada de Persistência (Sprint 1 e 2):** Integração e configuração do Sequelize ORM. Transição e migração bem-sucedida para o banco de dados PostgreSQL, viabilizando maior robustez, paralelismo e integridade referencial.
* **Módulo de Profissionais (Sprint 1 e 3):** Modelagem de dados, execução de migrações e disponibilização de endpoints para operações completas de CRUD. Conta com validações estritas a nível de aplicação e banco de dados contra campos nulos (incluindo a obrigatoriedade retroativa do atributo telefone).
* **Módulo de Serviços (Sprint 2):** Implementação de mecanismos para povoamento massivo de catálogo via payload JSON (bulkCreate) e desenvolvimento de filtros customizados indexados por área de atendimento (area_id).
* **Módulo de Agendamentos e Regras de Negócio (Sprint 3):** Desenvolvimento de inteligência no backend para validação e consistência da agenda em tempo real, cobrindo:
  1. Validação de Vínculo: Verificação prévia da existência do Professional antes da reserva.
  2. Validação de Catálogo: Verificação prévia da existência do Service solicitado.
  3. Mecanismo Antichoque de Horário: Bloqueio automatizado que impede o agendamento concomitante (mesmo profissional na mesma data e hora), retornando status 400 Bad Request.

---

## Stack Tecnológica

* **Node.js** - Ambiente de execução Javascript Server-side
* **Express** - Framework HTTP para roteamento e gerenciamento de middlewares
* **PostgreSQL** - Sistema de Gerenciamento de Banco de Dados Relacional (SGBD)
* **Sequelize** - Object-Relational Mapping (ORM) para abstração e manipulação de dados

---

## Arquitetura do Projeto (Padrão MVC)

```text
agendapro-beauty/
├── models/               # Modelos do Sequelize (Abstração das Tabelas)
├── migrations/           # Histórico de Evolução do Banco de Dados
└── src/
    ├── config/           # Parâmetros de Conexão (PostgreSQL)
    ├── controllers/      # Lógica de Negócio e Validações
    ├── routes/           # Roteamento e Exposição dos Endpoints
    └── app.js            # Inicialização e Middlewares da API

    
    
    ## Documentação Técnico da API (Endpoints)

### Módulo de Profissionais

* **GET `/professionals`**
  * **Descrição:** Recuperação do catálogo completo de profissionais cadastrados.
  * **Resposta de Sucesso:** Status 200 (Array de objetos contendo id, nome, especialidade, telefone, createdAt e updatedAt).

* **POST `/professionals`**
  * **Descrição:** Inserção de um novo profissional no banco de dados.
  * **Payload Requerido (JSON):**
    ```json
    {
      "nome": "Nome do Profissional",
      "specialidade": "Especialidade",
      "telefone": "54999999999"
    }
    ```
  * **Resposta de Sucesso:** Status 201 (Objeto criado com ID gerado).

* **PUT `/professionals/:id`**
  * **Descrição:** Atualização dos dados cadastrais de um profissional específico indexado pelo ID.
  * **Payload Requerido (JSON):** Campos a serem modificados (ex: nome, especialidade ou telefone).
  * **Resposta de Sucesso:** Status 200.

* **DELETE `/professionals/:id`**
  * **Descrição:** Remoção física de um registro de profissional com base no ID fornecido por parâmetro.
  * **Resposta de Sucesso:** Status 200.

---

### Módulo de Serviços

* **POST `/services`**
  * **Descrição:** Inserção massiva e em lote de novos serviços para povoamento célere do catálogo.
  * **Payload Requerido (JSON - Array de Objetos):**
    ```json
    [
      {
        "nome": "Corte de Cabelo",
        "preco": 50.00,
        "area_id": 1
      },
      {
        "nome": "Manicure",
        "preco": 35.00,
        "area_id": 2
      }
    ]
    ```
  * **Resposta de Sucesso:** Status 201.

* **GET `/services/area/:area_id`**
  * **Descrição:** Recuperação e listagem filtrada de serviços vinculados a uma área de atendimento específica informada na URL.
  * **Resposta de Sucesso:** Status 200.

---

### Módulo de Agendamentos

* **GET `/appointments`**
  * **Descrição:** Recuperação de todos os registros de agendamentos armazenados no sistema.
  * **Resposta de Sucesso:** Status 200.

* **POST `/appointments`**
  * **Descrição:** Criação de um agendamento individual validado por regras de negócio e bloqueio de sobreposição de horários.
  * **Payload Requerido (JSON):**
    ```json
    {
      "professional_id": 1,
      "service_id": 1,
      "data_hora": "2026-06-25T14:00:00.000Z"
    }
    ```
  * **Resposta de Sucesso:** Status 201.
  * **Respostas de Erro Comuns:**
    * **Status 404:** Entidade de Profissional ou Serviço não encontrada.
    * **Status 400:** Conflito de agenda (Profissional ocupado no horário solicitado).

---

## Validação e Testes da API

Todos os endpoints e regras de consistência foram rigorosamente homologados utilizando o cliente HTTP Thunder Client, garantindo a integridade transacional:

* **Tratamento de Exceções (Campos Nulos):** Validação do comportamento do Sequelize frente a violações de nulidade (notNull Violation), garantindo o bloqueio de payloads malformados ou incompletos.
* **Homologação do Antichoque de Horário:** Testes de estresse simulando requisições concorrentes para o endpoint `/appointments`. O sistema demonstrou eficácia total ao processar com sucesso a primeira requisição (201 Created) e barrar imediatamente a requisição idêntica subsequente (400 Bad Request), mitigando qualquer possibilidade de sobreposição na agenda do profissional.

---

## Instruções para Execução Local

### Pré-requisitos
Antes de iniciar, certifique-se de possuir instalados:
* Node.js (Versão LTS recomendada)
* PostgreSQL ativo e com um banco de dados criado
* Gerenciador de pacotes npm

### Passo a Passo

1. **Clone o repositório para o seu ambiente local:**
   ```bash
   git clone [https://github.com/Nilos-456/agendapro-beauty.git](https://github.com/Nilos-456/agendapro-beauty.git)
   cd agendapro-beauty

   Instale as dependências do projeto:

Bash
npm install
Configure as credenciais de acesso ao PostgreSQL:
Abra o arquivo src/config/config.json e insira seu username, password e database locais.

Execute as migrações para estruturar as tabelas:

Bash
npx sequelize-cli db:migrate
Inicialize o servidor em modo de desenvolvimento (Nodemon):

Bash
npm run dev
O servidor ficará ativo e escutando requisições na porta 3000 (http://localhost:3000).