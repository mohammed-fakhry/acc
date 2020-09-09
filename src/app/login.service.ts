import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserData } from './user-data';
import { ServicesService } from './services.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isUser: boolean = false;
  check = JSON.parse(sessionStorage.getItem('y'));

  currentUrl: string;
  ind: number;
  url: string;
  mainRoute: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _service: ServicesService
  ) { }

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

  creatUrls() {
    return [
      {
        url: '/home',
        prem: 1
      },
      {
        url: '/workers',
        prem: this.check.workers
      },
      {
        url: '/unites',
        prem: this.check.unites
      },
      {
        url: '/clients',
        prem: this.check.clients
      },
      {
        url: '/customers',
        prem: this.check.customers
      },
      {
        url: '/stocks',
        prem: this.check.stockes
      },
      {
        url: '/safe-acc',
        prem: this.check.safes
      },
      {
        url: '/MainSetting',
        prem: this.check.prem
      },
    ]
  }

  reternlog() {
    
    if (this.isUser == false) {
      this.router.navigate(['/logIn'])
    } else {
      let url = this.checkCurrentRoute();
      let checkInfo = this.creatUrls().find(link => link.url == url);
      if (checkInfo.prem != 1) {
        this.router.navigate(['/home'])
      }
    };

  }

  mainUrl: string;

  theMainUrl() {
    let i = this.currentUrl.indexOf("#");
    let dots = this.currentUrl.indexOf(":");
    this.mainUrl = this.currentUrl.slice(dots + 2, i);
    return (this.mainUrl.includes('localhost')) ? 'http://localhost/auth/' : 'http://192.168.1.103/auth/';
  }

  getUsers() {
    this.checkCurrentRoute();
    let url = this.theMainUrl();
    return this.http.get<UserData[]>(`${url}getUsers.php`);
  };

  creatUser(user: UserData) {
    let url = this.theMainUrl();
    return this.http.post(`${url}postUser.php`, user)
  };

  updateUser(user: UserData) {
    let url = this.theMainUrl();
    return this.http.put(`${url}updateUser.php?id=` + user.id, user)
  };

}
