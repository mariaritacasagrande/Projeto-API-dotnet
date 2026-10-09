import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from './services/produtos';
import { Produto } from './models/produto';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private service = inject(ProdutosService);

  produtos = signal<Produto[]>([]);
  produtoBuscado = signal<Produto | null>(null);
  editandoId = signal<number | null>(null);
  mensagem = signal<string>('');

  buscaId = 0;
  novoNome = '';
  novoPreco = 0;
  editNome = '';
  editPreco = 0;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listarTodos().subscribe({
      next: data => this.produtos.set(data),
      error: err => this.mensagem.set('Erro ao listar: ' + err.message)
    });
  }

  buscarPorId() {
    this.service.buscarPorId(this.buscaId).subscribe({
      next: data => this.produtoBuscado.set(data),
      error: () => {
        this.produtoBuscado.set(null);
        this.mensagem.set('Produto não encontrado.');
      }
    });
  }

  criar() {
    this.service.criar({ nome: this.novoNome, preco: this.novoPreco }).subscribe({
      next: () => {
        this.novoNome = '';
        this.novoPreco = 0;
        this.carregar();
      },
      error: err => this.mensagem.set('Erro ao criar: ' + err.message)
    });
  }

  iniciarEdicao(p: Produto) {
    this.editandoId.set(p.id);
    this.editNome = p.nome;
    this.editPreco = p.preco;
  }

  cancelarEdicao() {
    this.editandoId.set(null);
  }

  salvarEdicao(id: number) {
    this.service.atualizar(id, { nome: this.editNome, preco: this.editPreco }).subscribe({
      next: () => {
        this.editandoId.set(null);
        this.carregar();
      },
      error: err => this.mensagem.set('Erro ao atualizar: ' + err.message)
    });
  }

  remover(id: number) {
    this.service.remover(id).subscribe({
      next: () => this.carregar(),
      error: err => this.mensagem.set('Erro ao remover: ' + err.message)
    });
  }
}