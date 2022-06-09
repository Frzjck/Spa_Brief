import { Component, OnInit } from '@angular/core';
import { WoocomerceService } from '../../shared/services/woocomerce.service';
import { catchError, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../shared/services/auth.service';
import { ApiConfig } from '../../shared/models/api-config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productSub: Subscription;
  dataSource: any;
  apiConfig: ApiConfig;

  apiError = false;

  constructor(
    private woocom: WoocomerceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.apiConfig = this.woocom.getApiConfig();
    this.authService.getUser();

    if (this.apiConfig) this.woocom.getProducts(this.apiConfig);

    this.productSub = this.woocom.productListener().subscribe((data: any) => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
      } else {
        this.apiError = true;
      }
    });
  }

  loadNewApi(url: string, clientKey: string, secretKey: string) {
    const newApiconfig: ApiConfig = {
      url,
      clientKey,
      secretKey,
    };
    this.apiConfig = newApiconfig;
    this.woocom.saveApiConfig(newApiconfig);
    this.apiError = false;
    this.dataSource = undefined;
    this.woocom.getProducts(this.apiConfig);
  }
}
