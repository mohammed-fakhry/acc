import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/customer.service';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-customer-inv-detail',
  templateUrl: './customer-inv-detail.component.html',
  styleUrls: ['./customer-inv-detail.component.scss']
})
export class CustomerInvDetailComponent implements OnInit {

  constructor(
    public _customerService: CustomerService,
    public _service: ServicesService
  ) { }

  ngOnInit() {
    this._customerService.customerInv
    this._service.handleTableHeight();
  }

}
