import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { ServicesService } from 'src/app/services.service';
import { UserData } from 'src/app/user-data';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
  users: UserData[];
  checked: boolean;
  userInfo: UserData;
  auth: string;

  checkValid = {
    msg: null,
    cond: false,
  }

  constructor(
    public logService: LoginService,
    public _service: ServicesService
  ) { }

  ngOnInit() {

    this.logService.getUsers().subscribe((data: UserData[]) => { // get all names
      this.users = data;
    });

    this.checked = false
    this.userInfo = new UserData();
  }

  showUserInfo = (user: UserData, id: number) => {
    this.userInfo = user;
    this.auth = null;
    $('#fadeCheckPass').show();
    $('#fadeCheck').show();
    $('.askForDelete').addClass('animate');
    this.checkValid.cond = false
    $('#checkAuth').removeClass('is-invalid');
    $('label').removeClass('textDanger')
  }

  hideFadeCheck = () => {
    $('#fadeCheckPass').hide();
    $('#fadeCheck').hide();
    $('.askForDelete').removeClass('animate');
  }

  checkUser = () => {
    if (this.auth == this.users[0].auth) {
      this.hideFadeCheck();

    } else {
      this.checkValid.cond = true
      $('#checkAuth').addClass('is-invalid');
      $('label').addClass('textDanger')
    }
  }

}
