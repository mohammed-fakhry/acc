import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bank } from '../bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  url = localStorage.getItem('tmpDB');

  constructor(public http: HttpClient) { }

  getBanks() {
    return this.http.get<Bank[]>(`${this.url}banksList.php`);
  };

  creatBank(Bank: Bank) {
    return this.http.post(`${this.url}postBank.php`, Bank);
  };

  updateBank(Bank: Bank) {
    return this.http.put(`${this.url}updateBank.php?id=` + Bank.bankId, Bank );
  };
}
