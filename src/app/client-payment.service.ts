import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientPayment } from './client-payment';

@Injectable({
  providedIn: 'root'
})
export class ClientPaymentService {

  url = localStorage.getItem('tmpDB');

  constructor(public http: HttpClient) { }

  getClientPayment() {
    return this.http.get<ClientPayment[]>(`${this.url}clientsPaymentList.php`);
  };

  creatClientPayment(clientPayment: ClientPayment) {
    return this.http.post(`${this.url}postClientPayment.php`, clientPayment);
  };

  updateClientPayment(clientPayment: ClientPayment) {
    return this.http.put(`${this.url}updateClientPayment.php?id=` + clientPayment.paymentId, clientPayment );
  };

  deleteClientPayment(id: number) {
    return this.http.delete<ClientPayment>(`${this.url}deletClientPayment.php?id=` + id);
  };
}
