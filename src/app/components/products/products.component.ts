import { Component, OnInit } from '@angular/core';
import { WoocomerceService } from '../../shared/services/woocomerce.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ApiConfig } from '../../shared/models/api-config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productSub: Subscription;
  isData: boolean;
  apiConfig: ApiConfig;
  totPages: number;
  totProducts: number;
  apiError = false;

  constructor(
    private woocom: WoocomerceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.apiConfig = this.woocom.getApiConfig();
    this.authService.getUser();

    if (this.apiConfig) this.woocom.getProducts(this.apiConfig, 1, 5);

    this.productSub = this.woocom.productListener().subscribe((data: any) => {
      if (data) this.isData = true;
      else this.apiError = true;
    });
  }

  loadNewApi(newApiconfig: ApiConfig) {
    this.apiError = false;
    this.isData = false;
    this.apiConfig = newApiconfig;
    this.woocom.saveApiConfig(newApiconfig);
    this.woocom.getProducts(this.apiConfig, 1, 5);
  }
}
