import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users: any[];
  userData = new FormGroup({
    userName: new FormControl(''),
    userPassword: new FormControl()
  });

  currentRoute:string = this.logService.checkCurrentRoute();

  constructor(private router: Router, private logService: LoginService) { }

  ngOnInit() {

    this.logService.getUsers().subscribe((data: Worker[]) => { // get all userNames
      this.users = data;
    });

    /*if (this.logService.check) {
      this.logService.isUser = true;
      this.logService.checkIsUser();
    }*/

    if (this.logService.isUser == true) {
      this.router.navigate(['/home'])
    }

  } // ngOnInit


  //check = localStorage.getItem('y')
  logIn() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userName == this.userData.controls.userName.value && this.users[i].userPassword == this.userData.controls.userPassword.value) {
        this.logService.isUser = true;
        sessionStorage.setItem('y', 'y')
        break;
      }
    }

    if (this.logService.isUser == true) { // if true
      $('#sidebarToggle').show();
      this.router.navigate(['/home']);
      this.logService.checkIsUser();
      //this.logService.isUser = true;
    } else { // if false
      $('.form-control').addClass('is-invalid')
      $('.invalid-feedback').removeClass('d-none')
    }

  } // logIn

} // end -----
