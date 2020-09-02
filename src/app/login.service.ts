import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserData } from './user-data';

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

  constructor(private http: HttpClient, private router: Router) { }

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
  };

  checkIsUser() {
    if (this.isUser == true) {
      //$('#sideBar').hide();//removeClass('d-none');
      $('#app-side-bar').show()
      //$('#logOut').removeClass('navHeader');
      $('#sidebarToggle').show().addClass('pFixed sticky-top');
    } else {
      $('#app-side-bar').hide()//addClass('d-none');
      $('#sidebarToggle').hide()
    }
  }

  logStart() {
    if (this.check) {
      this.isUser = true;
      this.checkIsUser();
    }
  };

  reternlog() {

    if (this.isUser == false) {
      this.router.navigate(['/logIn'])
      //console.log(this.check)
    }
  }

  mainUrl: string;

  getUsers() {
    let i = this.currentUrl.indexOf("#");
    let dots = this.currentUrl.indexOf(":");
    this.mainUrl = this.currentUrl.slice(dots + 2, i);
    let url = (this.mainUrl.includes('localhost')) ? 'http://localhost/auth/getUsers.php' : 'http://192.168.1.103/auth/getUsers.php' //http://localhost:4200/#/logIn

    return this.http.get<UserData[]>(url /* 'http://localhost/auth/getUsers.php' */);
  }

}
