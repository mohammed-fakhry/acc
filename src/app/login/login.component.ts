import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UserData } from '../user-data';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users: UserData[];
  /* userData = new FormGroup({
    name: new FormControl(''),
    auth: new FormControl()
  }); */

  user = new UserData();

  errMsg: string;

  currentRoute: string = this.logService.checkCurrentRoute();
  currentUrl: string;
  mainUrl: string;

  constructor(
    private router: Router,
    private logService: LoginService,
    public _service: ServicesService
  ) { }

  ngOnInit() {

    this.logService.getUsers().subscribe((data: UserData[]) => { // get all names
      this.users = data;
    });

    if (this.logService.isUser == true) {
      this.router.navigate(['/home'])
    }

  } // ngOnInit


  //check = localStorage.getItem('y')

  makeUrl() {
    this.currentUrl = window.location.href;
    let i = this.currentUrl.indexOf("#");
    let dots = this.currentUrl.indexOf(":");
    this.mainUrl = this.currentUrl.slice(dots + 2, i);
    let url = (this.mainUrl.includes('localhost')) ? 'http://localhost/' : 'http://192.168.1.103/' //http://localhost:4200/#/logIn
    return url
  }

  linksArry(url: string) {
    return [
      {
        name: 'mohammed',
        url: `${url}/accounting/`
      },
      {
        name: 'ali',
        url: `${url}/accountings_ali/`
      }
    ]
  }

  log() {

    let url = this.makeUrl();

    if (this.users) {
      let found = this.users.find(user => user.name === this.user.name && user.auth === this.user.auth);
      if (found) {

        let linkInfo = this.linksArry(url).find(link => link.name === found.name)
        localStorage.setItem('tmpDB', `${linkInfo.url}`);

        sessionStorage.setItem('y', `${found.prem}`);
        this.logService.isUser = true;

        this.router.navigate(['/home']);
        this.logService.checkIsUser();
      } else {
        this.errMsg = 'خطأ فى اسم المستخدم او كلمة السر'
        $('.form-control').addClass('is-invalid');
        $('.invalid-feedback').removeClass('d-none');
      }
    } else {
      this.errMsg = 'تأكد من الاتصال بالخادم و اعد المحاولة'
      $('.form-control').addClass('is-invalid');
      $('.invalid-feedback').removeClass('d-none');
    }


  } // logIn

} // end -----
