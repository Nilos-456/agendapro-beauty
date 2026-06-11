# AgendaPro Beauty

O AgendaPro Beauty é uma API REST desenvolvida para otimizar a gestão e o agendamento de serviços em estabelecimentos de beleza e estética. O ecossistema da aplicação foi projetado utilizando a arquitetura MVC (Model-View-Controller), implementado sobre o ambiente de execução Node.js com o framework Express, e utilizando o Sequelize como ORM para a camada de persistência de dados.

---

## Status do Projeto: Sprint 1 Finalizado

A arquitetura base de dados e os endpoints fundamentais para o fluxo de cadastro foram validados e homologados nesta etapa.

### Escopo Entregue (Sprint 1):
* **Arquitetura Base:** Estruturação do padrão de diretórios da API, isolando adequadamente as camadas de responsabilidade (`src/controllers`, `src/routes`, `models` e `migrations`).
* **Camada de Persistência:** Integração e configuração do banco de dados relacional via Sequelize ORM.
* **Módulo de Profissionais:** Modelagem de dados, execução de migrations e disponibilização dos endpoints para consulta e persistência de profissionais.
* **Módulo de Serviços:** Modelagem de dados, execução de migrations e implementação de rotas otimizadas para processamento de carga de dados em lote (`bulkCreate`).

---

## Stack Tecnológica
* **Node.js** - Ambiente de execução Javascript Server-side
* **Express** - Framework HTTP para roteamento e gerenciamento de middlewares
* **Sequelize** - Object-Relational Mapping (ORM) para abstração e manipulação do banco de dados



## Documentação da API (Endpoints)

### Serviços e Monitoramento
| Método | Endpoint | Descrição | Status |
| :--- | :--- | :--- | :--- |
| GET | `/health` | Verificação de integridade (Health Check) do servidor | Ativo |
| GET | `/services` | Recuperação do catálogo completo de serviços cadastrados | Ativo |
| POST | `/services` | Inserção massiva de novos serviços via payload JSON (Array) | Ativo |



## Instruções para Execução Local

### Pré-requisitos
Antes de iniciar, certifique-se de possuir o **Node.js** e um gerenciador de pacotes (como o **npm**) instalados em seu ambiente.

### Passo a Passo

1. Realize o clone do repositório para o seu ambiente local:
   ```bash
   git clone <URL_DO_REPOSITORIO>