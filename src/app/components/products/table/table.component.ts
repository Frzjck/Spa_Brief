import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Subscription,
  Subject,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { OnDestroy } from '@angular/core';
import { WoocomerceService } from 'src/app/shared/services/woocomerce.service';
import { ApiConfig } from '../../../shared/models/api-config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  totPages: number;
  totProducts: number;
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'category',
    'stock',
    'date',
    'featured',
  ];
  apiData: any;
  apiDataSub: Subscription;
  dataSource: any;
  isLoading = false;
  searchSubscription: Subscription;
  searchSubject = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() apiConfig: ApiConfig;
  constructor(private woocom: WoocomerceService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.apiDataSub = this.woocom.productListener().subscribe((data: any) => {
      this.handleAPiResponse(data);
    });

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((results) => {
        this.isLoading = true;
        if (typeof results === 'string' || results === '')
          this.woocom.getProducts(this.apiConfig, 1, 5, results);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.apiDataSub.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  handleAPiResponse(data: any) {
    this.dataSource = new MatTableDataSource(data.body);
    this.totPages = +data.headers.get('x-wp-totalpages');
    this.totProducts = +data.headers.get('x-wp-total');

    setTimeout(() => {
      this.paginator.length = this.totProducts;
    });

    this.isLoading = false;
  }

  paginatorEvent(event: PageEvent) {
    this.isLoading = true;
    this.woocom.getProducts(
      this.apiConfig,
      event.pageIndex + 1,
      event.pageSize
    );
  }

  searchEvent(filterValue: string) {
    this.searchSubject.next(filterValue);
  }
}
