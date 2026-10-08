using Microsoft.AspNetCore.Mvc;

namespace MinhaPrimeiraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private static readonly string[] Produtos = new[]
    {
        "Caderno", "Lápis", "Borracha", "Caneta", "Mochila", "Estojo", "Apontador", "Régua", "Tesoura", "Cola"
    };

    [HttpGet("{id}")]
    public IActionResult BuscarPorId(int id)
    {
        if(id <= 0)
        {
            return BadRequest("O id do produto deve ser maior que zero.");
        }
        return Ok(Produtos[id - 1]);
    }

    [HttpPost]
    public IActionResult Criar([FromBody] string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            return BadRequest("O nome do produto não pode estar vazio.");
        }
        
        return Ok($"Produto '{nome}' criado com sucesso!");
    }

    // Versão com model 
    // [HttpPost]
    // public IActionResult Criar([FromBody] Produto produto)
    // {
    //     return Ok(produto);
    // }
}