import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isUser: boolean = false;
  check = sessionStorage.getItem('y');

  currentUrl: string;
  ind: number;
  url: string;
  mainRoute: string;

  checkCurrentRoute() {
    this.currentUrl = window.location.href;
    this.ind = this.currentUrl.lastIndexOf("/");
    this.url = this.currentUrl.slice(this.ind);
    return this.url
  }

  changeIsUser() {
    if (this.check) {
      this.isUser = true
    } else {
      this.isUser = false
    }
  }
  checkIsUser() {
    if (this.isUser == true) {
      $('#sideBar').removeClass('d-none');
      $('#logOut').show();
    } else {
      $('#sideBar').addClass('d-none');
    }
  }

  constructor( private http: HttpClient ) { }

  getUsers() {
    return this.http.get<Worker[]>('http://localhost/accounting/getUsers.php');
  }

}
