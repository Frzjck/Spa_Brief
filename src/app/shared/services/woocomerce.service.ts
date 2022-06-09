import { Injectable } from '@angular/core';
import { ApiConfig } from '../models/api-config';
import { HttpClient } from '@angular/common/http';
import { catchError, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WoocomerceService {
  url = 'https://atum.betademo.es/';
  private productObs = new ReplaySubject(1);
  constructor(private http: HttpClient) {}

  getProducts(apiConfig: ApiConfig, pageNumber?: number, perPage?: number) {
    const pageNumberParam = pageNumber ? `page=${pageNumber}&` : '';
    const perPageParam = perPage ? `per_page=${perPage}&` : '';

    return this.http
      .get(
        `${apiConfig.url}/wp-json/wc/v3/products?${pageNumberParam}${perPageParam}consumer_key=${apiConfig.clientKey}&consumer_secret=${apiConfig.secretKey}`,
        { observe: 'response' }
      )
      .pipe(
        catchError((err) => {
          this.productObs.next(false);
          throw 'error in source. Details: ' + err;
        })
      )
      .subscribe((res) => {
        this.productObs.next(res);
      });
  }

  productListener() {
    return this.productObs.asObservable();
  }

  saveApiConfig(apiConfig: ApiConfig) {
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
  }

  getApiConfig() {
    return JSON.parse(localStorage.getItem('apiConfig')!);
  }

  deleteApiConfig() {
    localStorage.removeItem('apiConfig');
  }
}
