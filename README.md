# MinhaPrimeiraApi

CRUD de produtos com uma API em ASP.NET Core e um front-end em Angular.

## Tecnologias

**Back-end**
- ASP.NET Core Web API (.NET)
- Entity Framework Core com SQLite
- Swagger / OpenAPI
- Arquitetura em camadas: Controller → Service → Repository

**Front-end**
- Angular (componentes standalone e signals)
- HttpClient e RxJS
- FormsModule

## Estrutura

### API

| Pasta / Arquivo | Descrição |
|---|---|
| `Controllers/ProdutosController.cs` | Endpoints REST de produtos |
| `Services/` | Regras de negócio (`IProdutoService`, `ProdutoService`) |
| `Repositories/` | Acesso a dados (`IProdutoRepository`, `ProdutoRepository`) |
| `Data/AppDbContext.cs` | Contexto do Entity Framework |
| `Models/Produto.cs` | Entidade com validações |
| `Models/ApiResponses.cs` | Envelope padrão de resposta (`ApiResponse<T>`) |
| `Middlewares/ExceptionMiddleware.cs` | Tratamento global de exceções |
| `Program.cs` | Configuração dos serviços e do pipeline |

### Angular

| Arquivo | Descrição |
|---|---|
| `app/app.ts` | Componente principal com a lógica da tela |
| `app/services/produtos.ts` | Serviço que consome a API |
| `app/models/produto.ts` | Interface `Produto` |
| `app/app.config.ts` | Configuração da aplicação (`provideHttpClient`) |

## Como executar

### Pré-requisitos

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org) (já inclui o npm)
- Angular CLI: `npm install -g @angular/cli`
- Ferramenta do Entity Framework: `dotnet tool install --global dotnet-ef`

### 1. Baixar o projeto

```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>
```

### 2. Rodar a API

Abra um terminal na pasta da API (a que contém o arquivo `.csproj`) e execute:

```bash
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

A API fica disponível em `http://localhost:5277` e o Swagger em `http://localhost:5277/swagger`. Deixe este terminal aberto.

### 3. Rodar o Angular

Abra **outro terminal**, entre na pasta do Angular (a que contém o `package.json`) e execute:

```bash
npm install
ng serve
```

A aplicação abre em `http://localhost:4200`.

## Endpoints

Base: `http://localhost:5277/api/Produtos`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/Produtos` | Lista todos os produtos |
| GET | `/api/Produtos/{id}` | Busca um produto pelo ID |
| POST | `/api/Produtos` | Cria um produto |
| PUT | `/api/Produtos/{id}` | Atualiza um produto |
| DELETE | `/api/Produtos/{id}` | Remove um produto |

### Exemplo de corpo (POST / PUT)

```json
{
  "nome": "Teclado",
  "preco": 149.90
}
```

### Formato das respostas

Todas as respostas seguem o mesmo envelope:

```json
{
  "sucesso": true,
  "dados": { "id": 1, "nome": "Teclado", "preco": 149.9 },
  "mensagem": null
}
```

Em caso de erro, `sucesso` é `false`, `dados` é `null` e `mensagem` descreve o problema.

## Regras de validação

- **Nome:** obrigatório, até 100 caracteres.
- **Preço:** entre 0,01 e 1.000.
- **ID:** deve ser maior que zero nas buscas.

## CORS

A API libera apenas a origem `http://localhost:4200`. Se o Angular rodar em outra porta, ajuste o `WithOrigins` no `Program.cs`.

## Tratamento de erros

O `ExceptionMiddleware` captura exceções não tratadas e devolve o envelope padrão:

- `ArgumentException` → 400
- Demais exceções → 500 com mensagem genérica