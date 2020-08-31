import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  constructor( private http: HttpClient, private router: Router ) { }
  
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

  getUsers() {
    return this.http.get<UserData[]>('http://localhost/auth/getUsers.php');
  }

}
