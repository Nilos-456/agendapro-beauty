Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
PROJETO INTEGRADOR – AGENDAPRO BEAUTY
Apresentação do desafio
A partir de 01/06, vocês iniciarão uma nova etapa da formação: o Projeto Integrador, que será
desenvolvido ao longo de 3 meses. Neste projeto, o desafio será atuar como uma equipe de
desenvolvimento Back-end, responsável por construir a base lógica, funcional e estrutural de um
sistema web chamado AgendaPro Beauty.
O AgendaPro Beauty simula uma demanda real de mercado: um salão de beleza e estética que
deseja digitalizar seus agendamentos. Atualmente, muitos estabelecimentos ainda fazem esse
controle manualmente, por WhatsApp, telefone ou anotações. Isso pode gerar conflitos de
horários, retrabalho, esquecimentos e dificuldade para organizar os atendimentos.
A proposta geral do produto é criar um sistema que permita o agendamento online de serviços
de beleza e estética. No entanto, nesta etapa do Projeto Integrador, vocês não desenvolverão
as telas do sistema nem a interface visual para o usuário. O foco da turma será construir o
Back-end, ou seja, a parte responsável por processar as informações, aplicar as regras de
negócio, organizar os dados e disponibilizar uma API para que, futuramente, outra equipe possa
desenvolver o Front-end.
Objetivo do Projeto Integrador
O objetivo principal deste Projeto Integrador é desenvolver a API Back-end do sistema
AgendaPro Beauty. Essa API deverá permitir que, em uma etapa posterior, uma equipe Front-end
consiga criar as telas do sistema e consumir os dados fornecidos pelo Back-end.
Vocês serão responsáveis por desenvolver recursos como cadastro de usuários, autenticação,
controle de profissionais, serviços, horários disponíveis, agendamentos, cancelamentos, status
dos atendimentos e regras de disponibilidade.
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
Escopo do Back-end a ser desenvolvido
Durante os 3 meses de projeto, a equipe deverá desenvolver a API Back-end do AgendaPro
Beauty, contemplando as funcionalidades essenciais do sistema.
A API deverá permitir, no mínimo:
● cadastro e login de usuários;
● autenticação e controle básico de acesso;
● cadastro, listagem, edição e exclusão de profissionais;
● cadastro, listagem, edição e exclusão de serviços;
● organização dos serviços por áreas do salão, como cabelo, manicure, estética facial,
estética corporal ou massagens;
● definição dos horários de trabalho de cada profissional;
● bloqueio manual de horários;
● consulta de horários disponíveis;
● criação de agendamentos;
● cancelamento ou reagendamento de horários, conforme regras definidas;
● controle de status dos agendamentos, como Confirmado, Cancelado e Concluído;
● geração de dados básicos para um futuro painel administrativo, como total de
agendamentos, serviços mais solicitados e profissionais mais requisitados.
Essas funcionalidades deverão ser disponibilizadas por meio de endpoints da API REST.
Regras de negócio
A API deverá implementar regras importantes para que o sistema funcione corretamente.
O Back-end deverá:
● impedir conflito de horários para o mesmo profissional;
● considerar a duração de cada serviço ao calcular a disponibilidade da agenda;
● impedir agendamentos em horários bloqueados;
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
● permitir cancelamento apenas dentro de uma antecedência mínima definida;
● controlar o status de cada agendamento;
● garantir que apenas usuários autorizados acessem determinadas funcionalidades;
● validar os dados recebidos antes de salvar informações no banco de dados.
Essas regras são fundamentais porque aproximam o projeto de uma situação real de
desenvolvimento profissional. Um sistema de agendamento não pode apenas salvar
informações: ele precisa tomar decisões corretas com base nas regras do negócio.
Banco de dados
A equipe deverá modelar e implementar um banco de dados relacional para armazenar as
informações do sistema.
Esse banco deverá contemplar entidades como, por exemplo:
● usuários;
● profissionais;
● serviços;
● áreas do salão;
● horários de trabalho;
● horários bloqueados;
● agendamentos;
● status dos agendamentos.
A modelagem do banco de dados será uma parte essencial do projeto, pois uma boa estrutura
facilita a organização da API, a criação das regras de negócio e a futura integração com o
Front-end.
Abaixo segue um diagrama ER para ser usado como referência:
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
OBS:
● STATUS_AGENDAMENTO: foi criada como tabela separada em vez de um campo enum
diretamente em AGENDAMENTOS para facilitar a adição de novos status no futuro (como
"Aguardando confirmação") sem mexer na estrutura da tabela.
● HORARIOS_TRABALHO: usa dia_semana como inteiro (0 = domingo, 6 = sábado) com
hora_inicio e hora_fim, permitindo que um profissional tenha horários distintos por dia da
semana.
● AGENDAMENTOS: guarda data_hora_fim calculada no momento da criação (início +
duração do serviço), o que simplifica bastante as queries de verificação de conflito de
horário — basta checar se algum agendamento existente se sobrepõe ao intervalo
pedido.
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
Tecnologias sugeridas
Para o desenvolvimento do Back-end, recomenda-se utilizar tecnologias relacionadas aos
conteúdos já estudados na trilha, como:
● JavaScript;
● Node.js;
● Express.js;
● banco de dados relacional, como PostgreSQL ou MySQL;
● ORM, não é obrigatório;
● API REST;
● Git e GitHub para versionamento;
● ferramentas para teste de API, como REST Client, Insomnia ou Postman.
A escolha final das tecnologias deverá seguir as orientações dos professores e a organização da
equipe.
Cronograma e entregas
O projeto será organizado com base em boas práticas do framework de gerenciamento de
projetos Scrum. O desenvolvimento está organizado em sprints que terão duração de 15 dias.
Durante esse tempo vocês deverão desenvolver as atividades previstas para o período
estipulado, conforme o cronograma abaixo.
Importante:
* Ao final de cada sprint vocês deverão fazer uma entrega, conforme descrito em cada sprint.
* Esse cronograma será utilizado como referência para acompanhamento das atividades durante
o projeto integrador, por isso, você deverá tentar segui-lo de forma mais rigorosa possível, tendo
em vista que uma das habilidades trabalhadas nesta atividade é a capacidade de entregas e
cumprimento do cronograma.
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
Sprint 1 Ambiente, banco de dados e
configuração do projetor: 01/06 – 15/06
Material de referência
git Criar o repositório no GitHub e definir a
estrutura de pastas do projeto
link
servidor Criar e configurar a estrutura básica do
projeto baseada nas boas práticas de
criação de APIs
link
banco Criar o banco de dados e as respectivas
tabelas e relacionamentos de acordo com
o modelo ER
link
docs Escrever o README inicial com descrição
do projeto
Entrega: Servidor respondendo na porta local + banco criado com as primeiras tabelas + diagrama
ER revisado (postar no Moodle)
Sprint 2 CRUD simples — profissionais e
serviços - 16/06 – 30/06
Material de referência
CRUD Endpoints GET, POST, PUT, DELETE para
profissionais
link
CRUD Endpoints GET, POST, PUT, DELETE para
serviços (com duração e preço)
link
filtro Listagem de serviços filtrada por área do
salão
link
validação Validação básica dos dados recebidos
(campos obrigatórios, tipos)
link
HTTP Retorno de erros com status HTTP
corretos (400, 404, 500)
link
teste Testar todas as rotas com REST Client,
Insomnia ou Postman
link
Entrega: CRUD de profissionais e serviços funcionando, testado
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
Sprint 3 Horários de trabalho e
disponibilidade - 16/07 – 31/07
Material de referência
agenda Cadastro dos horários de trabalho de cada
profissional (dias da semana, hora
início/fim)
link
agenda Endpoint para bloqueio manual de
horários específicos
link
lógica Lógica para gerar os slots livres
considerando a duração do serviço
escolhido
link
API Endpoint de consulta: "quais horários
estão disponíveis para X profissional em Y
data?"
link
lógica Ignorar slots que caem em horários
bloqueados
link
teste Testar cenários-limite: feriado bloqueado,
duração maior que o expediente restante
link
Entrega: Endpoint de disponibilidade retornando slots corretos em diferentes cenários de teste
Sprint 4 Agendamentos e regras de negócio
01/08 – 15/08
Material de referência
regra Endpoint de criação de agendamento —
valida disponibilidade antes de salvar
regra Impedir duplo agendamento: checar
conflito de horário no banco antes de
inserir
status Controle de status: Confirmado →
Concluído / Cancelado
regra Cancelamento com validação de
antecedência mínima (ex: mínimo 2h
antes)
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
regra Reagendamento: cancela o atual e cria um
novo respeitando todas as regras
API Listagem de agendamentos por usuário e
por profissional com filtro de status
Entrega: Fluxo completo de agendamento funcionando — criar, listar, cancelar e reagendar com todas
as regras aplicadas
Sprint 5 Usuários, senhas e autenticação
JWT
01/07 – 15/07
Material de referência
segurança Endpoint de cadastro de usuário com
hash de senha via bcrypt
link
JWT Endpoint de login que valida credenciais
e retorna token JWT
link
middleware Middleware de autenticação que verifica
o token em rotas protegidas
link
perfis Controle de perfil básico: cliente pode
ver, admin pode criar/editar/excluir
link
middleware Proteger os endpoints de escrita das
sprints anterior com o middleware
link
teste Testar fluxo completo: cadastrar → logar →
acessar rota protegida
link
Entrega: Sistema de autenticação funcionando — rotas protegidas retornam 401 sem token válido
Sprint 6 Relatórios, qualidade e entrega final
16/08 – 31/08
Material de referência
relatório Endpoints de relatórios: total de
agendamentos, serviços mais solicitados,
profissionais mais requisitados
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
qualidade Revisão geral: validações faltantes,
mensagens de erro claras, segurança
docs Documentação de todos os endpoints:
rota, método, parâmetros e exemplos de
resposta
docs README final com instruções de
instalação, variáveis de ambiente e como
rodar
git Organização do repositório: histórico de
commits limpo, branches organizadas
demo Demonstração completa no REST Client,
Insomnia ou Postman, cobrindo todos os
fluxos
Entrega: API completa, documentada, testada e pronta para ser consumida por um Front-end
Por que este projeto é importante?
Este projeto será uma oportunidade para aplicar, em um desafio realista, os conhecimentos
estudados nos primeiros meses da Trilha Back-end.
Vocês irão perceber que desenvolver Back-end envolve muito mais do que criar rotas. Será
necessário compreender o problema, planejar o banco de dados, organizar o código,
implementar regras, testar respostas, corrigir erros, documentar a API e trabalhar em equipe.
Como programadores iniciantes, é natural que surjam dúvidas e dificuldades. Isso faz parte do
processo. O objetivo do Projeto Integrador não é apenas entregar uma API pronta, mas
desenvolver a capacidade de pensar como desenvolvedores: analisar problemas, buscar
soluções, colaborar, testar e melhorar continuamente.
Entregas esperadas ao final dos 3 meses
Ao final do Projeto Integrador, espera-se que a equipe entregue:
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
● uma API REST funcional para o sistema AgendaPro Beauty;
● banco de dados relacional modelado e implementado;
● autenticação e controle básico de acesso;
● regras de agendamento implementadas;
● endpoints para gestão de usuários, profissionais, serviços, horários e agendamentos;
● código organizado e versionado em repositório Git;
● README com orientações básicas do projeto;
● documentação dos principais endpoints da API;
● instruções para instalação e execução do Back-end;
● demonstração do funcionamento da API utilizando ferramenta de teste, como Insomnia
ou Postman.
A entrega não precisa conter uma interface visual completa, pois o desenvolvimento do
Front-end será realizado posteriormente por outra equipe.
Compromisso durante o projeto
Para que o projeto avance de forma consistente, será fundamental que cada estudante participe
ativamente.
Durante esta etapa, espera-se que vocês:
● participem das decisões técnicas da equipe;
● utilizem o Git de forma organizada;
● registrem o progresso do projeto;
● testem as funcionalidades criadas;
● peçam ajuda quando necessário;
● compartilhem descobertas com os colegas;
● documentem o que foi desenvolvido;
● mantenham o foco no escopo Back-end do desafio.
Programa de Residência Tecnológica em
Desenvolvimento de Software:
Bolsa Futuro Digital
Curso: Desenvolvedor Back-End
O Projeto Integrador é uma experiência de aprendizagem prática. Cada erro corrigido, cada rota
criada, cada tabela modelada e cada regra implementada representa um passo importante na
formação de vocês como futuros desenvolvedores e desenvolvedoras Back-end.