import { Produto } from '../_models/Produto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

constructor(private http: HttpClient) {}

urlBase = 'http://localhost:62923/api/Produto';


ObterTodos(): Observable<Produto[]>  {
    return this.http.get<Produto[]>(this.urlBase);
  }

  ObterPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.urlBase}/${id}`);
  }

  ObterPorNome(nome: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.urlBase}/getByNome/${nome}`);
  }

  postProduto(produto: Produto) {
    return this.http.post(this.urlBase, produto);
  }

  putProduto(produto: Produto) {
    return this.http.put(`${this.urlBase}/${produto.id}`, produto);
  }

  deleteProduo(id: number) {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}




