import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, Node } from '../model/model';
import { Page, QueryBuilder } from '../model/pagination';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private baseURL = 'http://localhost:9000/api';
  private endpoint = 'nodes';

  constructor(private httpClient: HttpClient) {}

  getAll(queryBuilder: QueryBuilder): Observable<Page<Node>> {
    return this.httpClient
      .get<Node[]>(
        `${this.baseURL}/${this.endpoint}?${queryBuilder.buildQueryString()}`,
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => Page.fromResponse(response) as Page<Node>));
  }

  getAllToExportByEvent(event: Event): Observable<Node[]> {
    return this.httpClient.get<Node[]>(
      `${this.baseURL}/${this.endpoint}/export?event_id=${event.id}`
    );
  }

  create(node: Node): Observable<Node> {
    return this.httpClient.post<Node>(`${this.baseURL}/${this.endpoint}`, node);
  }

  createConnected(nodeConnectedInput: {
    nodeTypeId: number;
    customId: string;
    nodeFromId: number;
  }): Observable<Node> {
    return this.httpClient.post<Node>(
      `${this.baseURL}/${this.endpoint}/connected`,
      nodeConnectedInput
    );
  }

  findById(id: number): Observable<Node> {
    return this.httpClient.get<Node>(`${this.baseURL}/${this.endpoint}/${id}`);
  }

  update(node: Node): Observable<Node> {
    return this.httpClient.put<Node>(
      `${this.baseURL}/${this.endpoint}/${node.id}`,
      node
    );
  }

  delete(node: Node): Observable<{}> {
    return this.httpClient.delete(
      `${this.baseURL}/${this.endpoint}/${node.id}`
    );
  }
}
