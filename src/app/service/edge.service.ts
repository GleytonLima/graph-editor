import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Edge } from '../model/model';
import { Page, QueryBuilder } from '../model/pagination';

@Injectable({
  providedIn: 'root',
})
export class EdgeService {
  private baseURL = 'http://localhost:9000/api';
  private endpoint = 'edges';

  constructor(private httpClient: HttpClient) {}

  list(queryBuilder: QueryBuilder): Observable<Page<Edge>> {
    return this.httpClient
      .get<Edge[]>(
        `${this.baseURL}/${this.endpoint}?${queryBuilder.buildQueryString()}`,
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => Page.fromResponse(response) as Page<Edge>));
  }

  create(edge: Edge): Observable<Edge> {
    return this.httpClient.post<Edge>(`${this.baseURL}/${this.endpoint}`, edge);
  }

  findById(id: string): Observable<Edge> {
    return this.httpClient.get<Edge>(`${this.baseURL}/${this.endpoint}/${id}`);
  }

  update(edge: Edge): Observable<Edge> {
    return this.httpClient.put<Edge>(
      `${this.baseURL}/${this.endpoint}/${edge.id}`,
      edge
    );
  }

  delete(edge: Edge): Observable<{}> {
    return this.httpClient.delete(
      `${this.baseURL}/${this.endpoint}/${edge.id}`
    );
  }
}
