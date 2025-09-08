# Front-RelatorioBonsae
Aplicação frontend para consumir a API de emissão e gerenciamento de relatórios da Bonsae. Interface desenvolvida para apresentar e testar as funcionalidades do microsserviço em C#

# Guia de Branch, Commit, Pull Request e Padrão de Código – Projeto Bonsae

Este guia define como a equipe deve trabalhar no projeto Bonsae para manter o código limpo, organizado e fácil de revisar.

---

## 1️⃣ Branches do Projeto

### Principais
| Branch | Função |
|--------|--------|
| `main` | Versão estável do projeto (nunca fazer commit direto). |
| `develop` | Integração das features antes de irem para `main`. |

### Individuais (cada dev)
| Tipo | Nome padrão | Exemplo |
|------|------------|---------|
| Feature | `feature/<nome-da-feature>` | `feature/gerar-relatorio-job` |
| Bugfix | `fix/<nome-do-bug>` | `fix/status-relatorio` |
| Refactor | `refactor/<nome-da-refatoracao>` | `refactor/domain-entities` |
| Test | `test/<nome-do-teste>` | `test/relatorio-load` |
| Chore | `chore/<tarefa-manual>` | `chore/dependencies` |

**Regra:** Cada membro deve criar sua própria branch e **nunca fazer commit direto em `develop` ou `main`**.


## 2️⃣ Padrão de Commit

Usaremos **Conventional Commits**:

### Tipos de commit
- `feat` → nova funcionalidade  
- `fix` → correção de bug  
- `docs` → documentação  
- `style` → ajustes de formatação/estilo  
- `refactor` → refatoração do código  
- `test` → adição/alteração de testes  
- `chore` → manutenção, dependências, setup  

### Exemplos

```
git add .
git commit -m "feat(relatorio): adiciona cabeçalho com data/hora"
git commit -m "fix(job): corrige status não atualizado após gerar relatório"
git commit -m "docs(readme): adiciona exemplos de requests/responses"
git commit -m "style(api): formata código e ajusta identação"
git commit -m "refactor(domain): reorganiza classes do domínio"
git commit -m "test(relatorio): cria teste para gerar relatório com 20k alunos"
git commit -m "chore(ci): adiciona workflow de build no GitHub Actions"
```

## 3️⃣ Como fazer commits

### Opção 1: Pelo Visual Studio

1. Abra o projeto no Visual Studio.

2. No canto inferior direito, clique no nome da branch atual.

3. Clique em New Branch.

4. Escolha o tipo e nome da branch:

• ``feature/nome-da-feature``

• `fix/nome-do-bug`

• `refactor/nome-da-refatoracao`


5. Base branch: `develop`

6. Clique Create Branch → você será automaticamente mudado para a nova branch.

### Fazendo commits no Visual Studio:

1. Vá em Git Changes (View > Git Changes).

2. Escreva a mensagem do commit seguindo o padrão Conventional Commits, ex:

`feat(relatorio): adiciona cabeçalho com data/hora`

3. Clique Commit All.

4. Clique em Push para enviar ao GitHub.

### Opção 2: Pelo Terminal

1. Certifique-se de estar na branch correta:

``git checkout feature/nome-da-feature``

2. Adicione os arquivos alterados:

`git add .`

3. Faça o commit:

``git commit -m "feat(relatorio): adiciona cabeçalho com data/hora"``

4. Envie para o repositório remoto:

``git push origin feature/nome-da-feature``


## 4️⃣ Pull Request (PR)

### Opção 1: Pelo Visual Studio

1. Com a branch selecionada, vá em Git > Manage Branches

2. Clique em Create Pull Request

3. Preencha base (develop), comparação (sua branch) e descrição

4. Adicione revisor (Vitória Maíra) e clique Create 
   
### Opção 2: Pelo GitHub

1. Vá no GitHub → Repositório → Compare & pull request

2. Base branch: ``develop``

3. Compare branch: sua branch individual ``(feature/nome-da-feature)``

4. Preencha:

• Título: resumo da feature/bug

• Descrição:

• O que foi feito
• Como testar
• Exemplos de input/output

5. Adicione revisor (Vitória Maíra)

6. Clique Create Pull Request

Regra: nunca abrir PR direto para ``main``.


## 5️⃣ Workflow da Equipe

1. Criar branch individual:

``git checkout -b feature/nome-da-feature``

2. Fazer alterações e commits seguindo o padrão

3. Subir branch para GitHub:

``git push origin feature/nome-da-feature``

4. Abrir Pull Request → base ``develop``

5. Revisão por pelo menos 1 colega (Vitória Maíra)

6. Merge em ``develop`` → depois merge em ``main`` quando estável

## 6️⃣ Benefícios deste padrão

• Evita conflitos e código quebrado

• Cada dev trabalha isolado, sem atrapalhar colegas

• Facilita revisão, testes e integração contínua

• Código limpo e uniforme
