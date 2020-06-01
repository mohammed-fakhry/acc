import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from './customer'
import { CustomerInvArry } from './accountings/customer-inv-arry';
import { CustomerReceipt } from './accountings/customer-receipt';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // customer invoice Details Vars
  customerInv: any[];
  invoiceKind: string;
  date_time: string;
  invoiceNum: string;
  invKindColor: string;
  //customerInvDetail: any;
  invTotalArry: any[];
  invTotal: number;

  constructor(private http: HttpClient) { }

  // defult url
  url: string = 'http://localhost/accounting/'

  getCustomer() {
    return this.http.get<Customer[]>(`${this.url}customerList.php`);
  }

  creatCustomer(customer: Customer) {
    return this.http.post(`${this.url}postCustomer.php`, customer)
  }

  deleteCustomerSer(id: number) {
    return this.http.delete<Customer[]>(`${this.url}deleteCustomer.php?id=` + id)
  }

  updateCustomerSer(customer: Customer) {
    console.log(customer)
    return this.http.put(`${this.url}updateCustomer.php?id=` + customer.customerId, customer)
  }

  getCustomerInvArr() {
    return this.http.get<CustomerInvArry[]>(`${this.url}customerInvArrList.php`);
  }

  getCustomerReceipts() {
    return this.http.get<CustomerReceipt[]>(`${this.url}getCustomerReceiptsList.php`);
  }

}