import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WoocomerceService {
  url = 'https://atum.betademo.es/';
  private productObs = new Subject();

  constructor(private http: HttpClient) {}

  getProducts(url: string, clientKey: string, secretKey: string) {
    return this.http
      .get(
        `${url}/wp-json/wc/v3/products?consumer_key=${clientKey}&consumer_secret=${secretKey}`
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
}
