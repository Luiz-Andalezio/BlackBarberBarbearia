---
name: Template Geral
about: Template em branco para relatar problemas, sugerir melhorias ou discutir ideias
  relacionadas ao projeto Black Barber.
title: ''
labels: ''
assignees: ''

---

name: Template Geral
description: Template em branco para relatar problemas, sugerir melhorias ou discutir ideias relacionadas ao projeto Black Barber.
title: "[TÍTULO] - Descreva brevemente o assunto aqui"
labels: ["triagem"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Obrigado por contribuir com o projeto **Black Barber Barbearia**!  
        Por favor, preencha as informações abaixo com clareza para facilitar o acompanhamento do seu pedido ou relato.

  - type: input
    id: contexto
    attributes:
      label: Contexto
      description: Onde e como esse problema ou sugestão foi identificado?
      placeholder: Ex: Página de login, dashboard do cliente, etc.
    validations:
      required: true

  - type: textarea
    id: descricao
    attributes:
      label: Descrição Detalhada
      description: Descreva o problema, sugestão ou discussão com o máximo de detalhes possível.
      placeholder: Explique o que está acontecendo ou o que poderia ser melhorado.
    validations:
      required: true

  - type: dropdown
    id: tipo
    attributes:
      label: Tipo de Issue
      description: Escolha a categoria mais adequada.
      options:
        - Bug (erro no sistema)
        - Melhoria (otimização de algo existente)
        - Nova funcionalidade (sugestão de algo novo)
        - Dúvida
        - Documentação
        - Outro
    validations:
      required: true

  - type: textarea
    id: passos
    attributes:
      label: Passos para Reproduzir (se aplicável)
      description: Se for um bug, descreva como reproduzir o problema.
      placeholder: |
        1. Vá até '...'
        2. Clique em '...'
        3. Veja o erro em '...'

  - type: textarea
    id: ambiente
    attributes:
      label: Ambiente ou Ferramentas
      description: Em qual sistema, navegador ou versão você observou isso? (Opcional)
      placeholder: Ex: Chrome, Windows 10, PostgreSQL, versão 1.0.0, etc.

  - type: textarea
    id: extras
    attributes:
      label: Informações adicionais
      description: Se houver prints, logs ou ideias extras, coloque aqui.
