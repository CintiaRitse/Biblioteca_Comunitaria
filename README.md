# Coma.livros — Sistema Integrado de Gestão de Biblioteca Comunitária

Solução tecnológica desenvolvida para modernizar, automatizar e democratizar o controle de acervos e empréstimos em bibliotecas comunitárias.

---

## 1. Sobre a Empresa

* **Nome:** Coma.livros Soluções em Tecnologia
* **Área de Atuação:** Desenvolvimento de Software, Gestão da Informação e Inovação para Organizações Comunitárias e Educacionais.
* **Proposta Geral:** Modernizar a infraestrutura operacional de acervos culturais e comunitários através de plataformas digitais acessíveis, escaláveis e eficientes.

---

## 2. O Problema

A biblioteca comunitária atende estudantes, moradores e visitantes, mas mantém o controle de circulação de forma manual (fichas, anotações e planilhas descentralizadas). 

### Principais Gargalos Operacionais:
* Falta de visibilidade em tempo real sobre livros emprestados e devoluções atrasadas.
* Dificuldade em identificar os títulos e áreas de conhecimento mais demandados pela comunidade.
* Sobrecarga no atendimento presencial e telefônico apenas para consulta de disponibilidade de exemplares.
* Risco de perda de dados cadastrais e histórico de circulação.

---

## 3. A Solução Proposta

Uma **Plataforma Web Integrada**, composta por uma aplicação SPA responsiva para usuários e administradores, conectada a uma API RESTful robusta com microsserviço de Inteligência Artificial para busca semântica e recomendação de leituras.

### Funcionalidades Centrais:
* **Consulta Online do Acervo:** Busca textual e semântica com status de disponibilidade imediata.
* **Módulo de Reservas e Empréstimos:** Gestão de transações em tempo real com controle de concorrência.
* **Notificações Automatizadas:** Alertas de vencimento e aviso de devoluções pendentes.
* **Recomendação Inteligente:** Sugestão personalizada de títulos com base no histórico de leitura.
* **Painel Administrativo:** Relatórios de circulação, livros em atraso e predição de demanda para aquisições.

---

## 4. Equipe e Papéis Profissionais

| Integrante | Papel no Projeto | Foco Técnico Principal |
| :--- | :--- | :--- |
| **Joerlândio Filho** | Analista de Requisitos | Elicitação de regras de negócio, Casos de Uso e priorização de backlog. |
| **Cíntia Ritse** | Front-end & Banco de Dados | Interface responsiva (SPA) e modelagem relacional de tabelas de catálogo. |
| **Jucian Oliveira** | Back-end & Banco de Dados | API RESTful, transações ACID de empréstimos e integridade de dados. |
| **Witoria** | Back-end | Serviços em background, controle de prazos/multas e mensageria. |
| **Sillas Gabriel** | Engenheiro de IA | Motor de recomendação, busca semântica e clusterização de demanda. |

> Detalhes sobre competências, justificativas dos papéis e interdependências estão disponíveis em [`docs/04-papeis-e-justificativas.md`](docs/04-papeis-e-justificativas.md).

---

## 5. Segurança, Privacidade e Acessibilidade

* **LGPD / Privacidade:** Coleta mínima de dados cadastrais dos leitores e anonimização de histórico para treino de modelos preditivos.
* **Integridade Transacional:** Prevenção de inconsistências em reservas simultâneas via transações atômicas no banco de dados.
* **Acessibilidade:** Interface construída com base nas diretrizes WCAG (HTML semântico, alto contraste e navegabilidade por teclado).

---

## 6. Estrutura da Documentação

A documentação detalhada deste projeto está organizada na pasta `docs/`:

Consulte a [Documentação](https://docs.google.com/document/d/1MrUB2aqi5TYtPy7JLxFCwTWUy5JrZ4oGbWMR7UhRzMM/edit?usp=drivesdk) para mais detalhes.

* [`01-apresentacao-empresa.md`](docs/01-apresentacao-empresa.md) — Missão, visão e posicionamento institucional.
* [`02-especificacao-problema.md`](docs/02-especificacao-problema.md) — Diagnóstico aprofundado dos processos manuais.
* [`03-proposta-solucao.md`](docs/03-proposta-solucao.md) — Arquitetura de software, fluxo de telas e roadmap de entrega.
* [`04-papeis-e-justificativas.md`](docs/04-papeis-e-justificativas.md) — Fichas técnicas dos papéis e análise de risco da equipe.
* [`05-seguranca-privacidade.md`](docs/05-seguranca-privacidade.md) — Tratamento de dados pessoais e integridade.
* [`06-organizacao-e-decisoes.md`](docs/06-organizacao-e-decisoes.md) — Metodologia de trabalho e atas de decisões técnicas.
* [`07-postagens-linkedin.md`](docs/07-postagens-linkedin.md) — Publicações técnicas individuais dos 5 integrantes.
