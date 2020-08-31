import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UserData } from '../user-data';

@Component({
  selector: 'app-main-setting',
  templateUrl: './main-setting.component.html',
  styleUrls: ['./main-setting.component.scss']
})
export class MainSettingComponent implements OnInit {

  
  
  userDataView: UserData;

  userData = new FormGroup ({
    userId: new FormControl(),
    userName: new FormControl(),
    userPassword: new FormControl(),
    userPremission: new FormControl()
  })
  constructor(public router: Router, public logService: LoginService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    // first check
    if (this.logService.check) {
      this.logService.isUser = true;
      this.logService.checkIsUser();
    }
    if (this.logService.isUser == false) {
      this.router.navigate(['/logIn'])
    }

    // models vars
    this.userDataView = {
      id: null,
      name: null,
      auth: null,
      prem: null,
    }

    

  } // ngOnInit
  


} // end
