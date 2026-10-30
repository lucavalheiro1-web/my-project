# 🐄 Fazenda LV - Sistema de Gestão de Bois

Sistema completo e moderno para gestão de rebanho bovino, desenvolvido com **HTML5**, **CSS3**, **JavaScript** e **Supabase**.

## 📋 Funcionalidades

### 🐄 Bois
- ✅ Cadastro de novos animais
- ✅ Listagem com filtros
- ✅ Exclusão de registros
- ✅ Dados: nome, identificação, peso, raça, data de nascimento

### 💊 Cuidado
- ✅ Registro de vacinas
- ✅ Registro de vermífugos
- ✅ Observações de saúde
- ✅ Histórico de pesos
- ✅ Visualização de histórico por animal

### 🛒 Compra
- ✅ Registrar compra de bois
- ✅ Dados: boi, fornecedor, preço, data, observações
- ✅ Listagem de todas as compras

### 💰 Venda
- ✅ Registrar venda de bois
- ✅ Dados: boi, comprador, preço, data, observações
- ✅ Listagem de todas as vendas

### 👶 Criação (Reprodução)
- ✅ Registrar cobertura (macho + fêmea)
- ✅ Registrar nascimento de bezerros
- ✅ Associar bezerro aos pais (genealogia)
- ✅ Visualizar histórico de reprodução

### 📊 Dashboard
- ✅ Total de bois cadastrados
- ✅ Peso médio do rebanho
- ✅ Total de compras realizadas
- ✅ Total de vendas realizadas

## 🎨 Design

- **Layout Responsivo**: Mobile, Tablet e Desktop
- **Tema Fazenda LV**: Verde, marrom e dourado
- **Interface Moderna**: Cards, tabelas e botões estilizados
- **Animações Suaves**: Transições elegantes
- **Sistema de Notificações**: Toast messages para feedback

## 🚀 Como Começar

### 1️⃣ Pré-requisitos
- Conta no [Supabase](https://supabase.com)
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (Python, Node.js ou similar)

### 2️⃣ Configurar Banco de Dados no Supabase

#### a) Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados e clique em "Create new project"
4. Aguarde a inicialização

#### b) Executar SQL
1. Vá para **SQL Editor** no dashboard
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `database.sql`
4. Clique em **Run** para criar as tabelas
5. Você verá as 7 tabelas criadas: `bois`, `saude`, `pesos`, `compras`, `vendas`, `reproducao`, `nascimentos`

### 3️⃣ Obter Credenciais do Supabase

1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL** (SUPABASE_URL)
   - **anon public key** (SUPABASE_ANON_KEY)

### 4️⃣ Configurar app.js

Abra o arquivo `app.js` e substitua linhas 8-9:

```javascript
const SUPABASE_URL = 'https://seu-url-real.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-real-aqui';
```

**Exemplo real:**
```javascript
const SUPABASE_URL = 'https://abcdef123.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5️⃣ Rodar Localmente

#### Opção A: Python 3
```bash
python -m http.server 8000
```

#### Opção B: Node.js
```bash
npx http-server
```

#### Opção C: VS Code Live Server
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

### 6️⃣ Acessar Aplicativo

Abra no navegador:
```
http://localhost:8000
```

## 📁 Estrutura de Arquivos

```
fazendalv/
├── index.html          # Interface completa
├── app.js             # Lógica e integração Supabase
├── style.css          # Estilos e design responsivo
├── database.sql       # Schema do banco de dados
├── README.md          # Este arquivo
└── .gitignore         # Arquivos ignorados pelo Git
```

## 🗄️ Banco de Dados

### Tabelas

**bois** - Animais cadastrados
- `id` (UUID) - Identificador único
- `nome` (TEXT) - Nome do animal
- `identificacao` (TEXT) - Código único do animal
- `peso` (NUMERIC) - Peso em kg
- `raca` (TEXT) - Raça (Nelore, Angus, etc)
- `data_nascimento` (DATE) - Data de nascimento
- `criado_em` (TIMESTAMP) - Data de criação do registro

**saude** - Histórico de saúde
- `id` (UUID)
- `boi_id` (UUID) - Referência ao boi
- `tipo` (TEXT) - vacina, vermifugo ou observacao
- `descricao` (TEXT) - Descrição do cuidado
- `data` (DATE) - Data do cuidado

**pesos** - Histórico de pesos
- `id` (UUID)
- `boi_id` (UUID) - Referência ao boi
- `peso` (NUMERIC) - Peso em kg
- `data` (DATE) - Data da medição

**compras** - Registros de compra
- `id` (UUID)
- `boi_id` (UUID) - Referência ao boi
- `fornecedor` (TEXT) - Nome do fornecedor
- `preco` (NUMERIC) - Valor em R$
- `data` (DATE) - Data da compra
- `observacoes` (TEXT) - Anotações opcionais

**vendas** - Registros de venda
- `id` (UUID)
- `boi_id` (UUID) - Referência ao boi
- `comprador` (TEXT) - Nome do comprador
- `preco` (NUMERIC) - Valor em R$
- `data` (DATE) - Data da venda
- `observacoes` (TEXT) - Anotações opcionais

**reproducao** - Coberturas (cruzamentos)
- `id` (UUID)
- `macho_id` (UUID) - Referência ao touro
- `femea_id` (UUID) - Referência à vaca
- `data_cobertura` (DATE) - Data do cruzamento

**nascimentos** - Genealogia
- `id` (UUID)
- `bezerro_id` (UUID) - Referência ao bezerro
- `macho_id` (UUID) - Referência ao pai
- `femea_id` (UUID) - Referência à mãe
- `data_nascimento` (DATE) - Data do nascimento

## 🔧 Troubleshooting

### ❌ Erro: "SUPABASE_URL is undefined"
**Solução:** Configure corretamente as variáveis em `app.js` linhas 8-9

### ❌ Erro: "Cannot read property 'data'" do Supabase
**Solução:** Verifique se as tabelas foram criadas (execute `database.sql` novamente)

### ❌ CORS Error
**Solução:** O Supabase permite requisições de qualquer origem por padrão. Se erro persistir, verifique URL do Supabase

### ❌ Dados não aparecem na tabela
**Solução:** 
1. Verifique console do navegador (F12)
2. Confirme que inseriu dados nos formulários
3. Recarregue a página (F5)

### ❌ Formulário não envia dados
**Solução:** 
1. Verifique se SUPABASE_URL e SUPABASE_ANON_KEY estão corretos
2. Abra DevTools (F12) e veja mensagens de erro
3. Certifique-se de que as tabelas existem no Supabase

## 📱 Responsividade

O sistema é completamente responsivo:

- **Desktop (1200px+)**: Layout completo com sidebar fixo
- **Tablet (768px - 1199px)**: Navegação horizontal, grid adaptado
- **Mobile (até 767px)**: Menu em linha, tabelas horizontais, botões full-width

## 🔐 Segurança

⚠️ **IMPORTANTE**: Esta versão usa `anon_key` (pública) do Supabase. Para produção:

1. Implemente autenticação de usuários
2. Configure RLS (Row Level Security) no Supabase
3. Use variáveis de ambiente `.env` (não commite chaves!)
4. Adicione validações backend
5. Implemente rate limiting

## 📝 Licença

Fazenda LV © 2026 - Código aberto para uso pessoal

## 👨‍💻 Desenvolvido por

**Fazenda LV** - Gestão Inteligente de Rebanho

---

**Precisa de ajuda?** Consulte a documentação do Supabase: https://supabase.com/docs
