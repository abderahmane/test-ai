import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, ItemRequest, InventoryStats } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/items';

  list(search?: string, category?: string, status?: string): Observable<Item[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);
    return this.http.get<Item[]>(this.baseUrl, { params });
  }

  get(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  create(request: ItemRequest): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, request);
  }

  update(id: number, request: ItemRequest): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteAll(): Observable<void> {
    return this.http.delete<void>(this.baseUrl);
  }

  stats(): Observable<InventoryStats> {
    return this.http.get<InventoryStats>(`${this.baseUrl}/stats/summary`);
  }

  categories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/meta/categories`);
  }
}