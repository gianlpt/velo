# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Testes E2E** | Playwright (Chromium) |
| **Qualidade de código** | ESLint e Prettier |

---

## Instalação

```bash
# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn dev
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

> Encontre essas informações em: **Project Settings → API**

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
yarn add supabase -D

# Login e vincular projeto
yarn supabase login
yarn supabase link --project-ref vurfzpobkuejoghhgztc

# Aplicar migrações (cria tabelas e RLS)
yarn supabase db push

# Deploy das Edge Functions
yarn supabase functions deploy
```

Pronto! O banco e as functions estarão configurados.

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — pending, approved, rejected, analysis

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Scripts

```bash
yarn dev           # Desenvolvimento
yarn build         # Build de produção
yarn build:dev     # Build em modo de desenvolvimento
yarn preview       # Visualizar o build localmente
yarn test          # Executar os testes E2E
yarn lint          # Verificar código com ESLint
yarn format        # Formatar o projeto com Prettier
yarn format:check  # Verificar formatação sem alterar arquivos
```

## Testes E2E com Playwright

Os testes ficam em `playwright/e2e`, com configuração em `playwright.config.ts`, e executam no Chromium.

Após instalar as dependências, instale o navegador:

```bash
yarn playwright install chromium
```

Com o `.env` configurado, inicie a aplicação em um terminal e mantenha o servidor rodando:

```bash
yarn dev
```

A aplicação deve estar disponível em `http://localhost:5173`. O Playwright não inicia o servidor automaticamente na configuração atual.

Em outro terminal, execute:

```bash
# Todos os testes
yarn test

# Somente os testes de consulta de pedidos
yarn test playwright/e2e/pedidos.spec.ts

# Executar com o navegador visível
yarn test --headed

# Abrir a interface interativa do Playwright
yarn test --ui

# Listar os testes sem executá-los
yarn test --list

# Abrir o relatório HTML da última execução
yarn playwright show-report
```

Os cenários atuais verificam a disponibilidade da aplicação, a consulta de um pedido aprovado e a mensagem para um pedido inexistente.
O teste de pedido aprovado depende do pedido `VLO-3NEBZS` com status aprovado no Supabase configurado. Para usar outro pedido, ajuste
o `orderId` e o `getByTestId` correspondente em `playwright/e2e/pedidos.spec.ts`.

O relatório HTML é gerado em `playwright-report/`, e os artefatos dos testes ficam em `test-results/`. Traces são mantidos em caso de falha.

## Formatação com Prettier

No VS Code, instale ou habilite a extensão **Prettier - Code formatter** (`esbenp.prettier-vscode`), recomendada pelo projeto.
O arquivo `.vscode/settings.json` define o Prettier como formatador padrão e ativa a formatação ao salvar.

As regras em `.prettierrc.json` usam aspas simples, dispensam ponto e vírgula e definem uma largura preferencial de 145 caracteres.
O arquivo `.prettierignore` exclui dependências, builds, relatórios e arquivos de lock da formatação.

Para formatar manualmente, use `yarn format`. Para apenas verificar, use `yarn format:check`.
