# AgendaPro Beauty

O AgendaPro Beauty é uma API REST desenvolvida para otimizar a gestão e o agendamento de serviços em estabelecimentos de beleza e estética. O ecossistema da aplicação foi projetado utilizando a arquitetura MVC (Model-View-Controller), implementado sobre o ambiente de execução Node.js com o framework Express, e utilizando o Sequelize como ORM para a camada de persistência de dados.



## Status do Projeto: Sprint 1 Finalizado 

A arquitetura de banco de dados e os endpoints fundamentais para o fluxo de gestão de profissionais foram validados, testados e homologados com sucesso.

### Escopo Entregue (Sprint 1):
* **Arquitetura Base:** Estruturação do padrão de diretórios da API, isolando adequadamente as camadas de responsabilidade (`src/controllers`, `src/services`, `src/routes`, `models` e `migrations`).
* **Camada de Persistência:** Integração, configuração e conectividade com o banco de dados relacional via Sequelize ORM.
* **Módulo de Profissionais (CRUD Completo):** Modelagem de dados, execução de migrations e disponibilização de rotas completas para criação individual/em lote (`bulkCreate`), leitura, atualização (`PUT`) e exclusão (`DELETE`) de registros, contando com validações robustas contra campos nulos.



## Stack Tecnológica
* **Node.js** - Ambiente de execução Javascript Server-side
* **Express** - Framework HTTP para roteamento e gerenciamento de middlewares
* **Sequelize** - Object-Relational Mapping (ORM) para abstração e manipulação de banco de dados relacional



## Documentação da API (Endpoints)

### Módulo de Profissionais
| Método | Endpoint | Descrição | Status |
| :--- | :--- | :--- | :--- |
| GET | `/professionals` | Recuperação do catálogo completo de profissionais cadastrados |Ativo |
| POST | `/professionals` | Inserção massiva/em lote de novos profissionais via payload JSON (Array) | Ativo |
| PUT | `/professionals/:id` | Atualização de dados cadastrais (ex: especialidade) filtrado por ID | Ativo |
| DELETE | `/professionals/:id` | Remoção/Exclusão física de um profissional do banco de dados por ID | Ativo |



## Validação e Testes da API 

Todos os endpoints desenvolvidos foram rigorosamente testados e homologados utilizando o cliente HTTP **Thunder Client**, garantindo a integridade das operações e a correta persistência no banco de dados:

* **Teste de POST (Cadastro em Lote):** Validada a inserção em lote (`bulkCreate`) de múltiplos profissionais simultaneamente, contendo sanitização de dados e tratamento contra campos nulos.
* **Teste de GET (Listagem Geral):** Validada a busca e o retorno estruturado em formato JSON de todos os registros armazenados na tabela do banco de dados.
* **Teste de PUT (Atualização Cadastral):** Validada a alteração dinâmica de atributos específicos (como especialidade do profissional) com base no parâmetro de ID, alterando com sucesso o timestamp de atualização (`updatedAt`).
* **Teste de DELETE (Exclusão):** Validada a remoção física de registros do banco de dados através da identificação por ID.


## Instruções para Execução Local

### Pré-requisitos
Antes de iniciar, certifique-se de possuir o **Node.js**, o banco de dados configurado e um gerenciador de pacotes (como o **npm**) instalados em seu ambiente.

### Passo a Passo

1. Realize o clone do repositório para o seu ambiente local:
   ```bash
   git clone [https://github.com/Nilos-456/agendapro-beauty.git](https://github.com/Nilos-456/agendapro-beauty.git)