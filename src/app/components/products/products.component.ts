import { Component, OnInit } from '@angular/core';
import { WoocomerceService } from '../../shared/services/woocomerce.service';
import { catchError, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productSub: Subscription;
  dataSource: any;
  urlDefault = 'https://atum.betademo.es/';
  defaultClientKey = 'ck_5e6d288b572c2b6c5e324940e7ec2be58b7a64f4';
  defaultSecretKey = 'cs_15f29b5e857247ca9103e98390269d5140ea6a55';

  currentUrl = this.urlDefault;
  apiError = false;
  constructor(
    private woocom: WoocomerceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUser();
    this.woocom.getProducts(
      this.urlDefault,
      this.defaultClientKey,
      this.defaultSecretKey
    );
    this.productSub = this.woocom.productListener().subscribe((data: any) => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.apiError = true;
      }
    });
  }
  loadNewApi(url: string, clientKey: string, secretKey: string) {
    this.apiError = false;
    this.dataSource = undefined;
    this.woocom.getProducts(url, clientKey, secretKey);
    this.currentUrl = url;
  }
}
