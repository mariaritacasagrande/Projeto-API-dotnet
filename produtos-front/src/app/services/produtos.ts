import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Produto } from '../models/produto';

interface ApiResponse<T> {
  sucesso: boolean;
  dados: T;
  mensagem: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private apiUrl = 'http://localhost:5277/api/Produtos';
  private http = inject(HttpClient);

  listarTodos(): Observable<Produto[]> {
    return this.http.get<ApiResponse<Produto[]>>(this.apiUrl)
      .pipe(map(r => r.dados));
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<ApiResponse<Produto>>(`${this.apiUrl}/${id}`)
      .pipe(map(r => r.dados));
  }

  criar(produto: { nome: string; preco: number }): Observable<Produto> {
    return this.http.post<ApiResponse<Produto>>(this.apiUrl, produto)
      .pipe(map(r => r.dados));
  }

  atualizar(id: number, produto: { nome: string; preco: number }): Observable<Produto> {
    return this.http.put<ApiResponse<Produto>>(`${this.apiUrl}/${id}`, produto)
      .pipe(map(r => r.dados));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}