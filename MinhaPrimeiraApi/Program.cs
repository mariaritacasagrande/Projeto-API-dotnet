using MinhaPrimeiraApi.Data;
using Microsoft.EntityFrameworkCore;
using MinhaPrimeiraApi.Repositories;
using MinhaPrimeiraApi.Services;
using MinhaPrimeiraApi.Middlewares;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=minhaapi.db"));
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// CORS precisa vir primeiro, para que até as respostas de erro e
// de redirecionamento carreguem os cabeçalhos de CORS.
app.UseCors("PermitirAngular");

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Em desenvolvimento o Angular usa http://localhost:5027,
    // então o redirecionamento para HTTPS fica só em produção.
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();