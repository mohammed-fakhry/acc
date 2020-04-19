import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Customer} from './customer'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerInv: any[];
  //customerInvDetail: any;

  constructor(private http: HttpClient) { }
  getCustomer() {
    return this.http.get<Customer[]>('http://localhost/accounting/customerList.php');
  }

  creatCustomer(customer: Customer) {
    return this.http.post('http://localhost/accounting/postCustomer.php', customer)
  }

  deleteCustomerSer(id: number) {
    return this.http.delete<Customer[]>('http://localhost/accounting/deleteCustomer.php?id=' + id)
  }

  updateCustomerSer(customer: Customer) {
    console.log(customer)
    return this.http.put('http://localhost/accounting/updateCustomer.php?id=' + customer.customerId, customer )
  }

}
