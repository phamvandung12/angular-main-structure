// File demo. Move the real file to core/services/.../

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UrlConstant } from '@constants/url.constant';
import { IPagedResults } from '@models/common/response-data.model';
import { Observable } from 'rxjs';
import { IAcademicRanks } from './DEMO-academic.model';

@Injectable({
  providedIn: 'root',
})
export class AcademicRanksService {
  private http = inject(HttpClient);


  private apiUrl = UrlConstant.API.DEMO_API;

  getAll(): Observable<IAcademicRanks[]> {
    return this.http.get<IAcademicRanks[]>(this.apiUrl);
  }

  getById(id: string): Observable<IAcademicRanks> {
    return this.http.get<IAcademicRanks>(this.apiUrl + `/${id}`);
  }

  getAllPaging(
    page: number,
    size: number,
    search?: string,
    sort?: string,
    column?: string,
  ): Observable<IPagedResults<IAcademicRanks>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('search', search ?? '')
      .set('sort', sort ?? '')
      .set('column', column ?? '');

    return this.http.get<IPagedResults<IAcademicRanks>>(this.apiUrl + '/filter', { params });
  }

  create(model: Partial<IAcademicRanks>): Observable<IAcademicRanks> {
    return this.http.post<IAcademicRanks>(this.apiUrl, model);
  }

  update(model: Partial<IAcademicRanks>, id: string): Observable<IAcademicRanks> {
    return this.http.put<IAcademicRanks>(this.apiUrl + `/${id}`, model);
  }

  delete(id: string): Observable<IAcademicRanks> {
    return this.http.delete<IAcademicRanks>(this.apiUrl + `/${id}`);
  }
}
