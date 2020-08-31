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

  user = {
    name: null,
    auth: null,
  }

  errMsg: string;

  currentRoute: string = this.logService.checkCurrentRoute();

  constructor(private router: Router, private logService: LoginService, public _service: ServicesService) { }

  ngOnInit() {

    this.logService.getUsers().subscribe((data: UserData[]) => { // get all names
      this.users = data;
    });

    if (this.logService.isUser == true) {
      this.router.navigate(['/home'])
    }

  } // ngOnInit


  //check = localStorage.getItem('y')
  log() {
    console.log(this.user)
    if (this.users) {
      let found = this.users.find(user => user.name === this.user.name);
      if (found) {
        if (found.name == 'mohammed') {
          localStorage.setItem('tmpDB', 'http://localhost/accounting/');
        } else if (found.name === 'ali') {
          localStorage.setItem('tmpDB', 'http://localhost/accountings_ali/');
        }
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
