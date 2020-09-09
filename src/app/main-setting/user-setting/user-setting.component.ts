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
    cond: true,
  }

  prems = {
    db: {
      workers: false,
      clients: false,
      unites: false
    },
    acc: {
      stockes: false,
      safes: false,
      customers: false,
    },
    tasks: {
      master: false,
      del: false,
      edit: false,
    }
  }

  inpts = {
    userName: null,
    pass: null,
    rePass: null,
  }

  fadeCond = {
    cond: null,
    msg: null,
  }

  addOrUpdate: string;

  constructor(
    public logService: LoginService,
    public _service: ServicesService
  ) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    this.logService.getUsers().subscribe((data: UserData[]) => { // get all names
      this.users = data;
    });

    this.checked = false
    this.userInfo = new UserData();
  }

  showUserInfo = (user: UserData = undefined, i: number = undefined) => {

    if (user) {
      this.userInfo = user;
      this.passInpVals(user);
      $(`.chooseBtn`).not(`#showUserInfo${i}`).removeClass('btn-secondary').addClass('btn-light')
      $(`#showUserInfo${i}`).removeClass('btn-light').addClass('btn-secondary');
      this.addOrUpdate = 'update'
    } else {
      $(`.chooseBtn`).removeClass('btn-secondary').addClass('btn-light');
      this.passInpVals();
      this.addOrUpdate = 'add'
    }
    // varibals
    this.auth = null;
    this.checkValid.cond = true
    this.checked = false;

    //effects
    this.showFadeCheck('check')
    $('#checkAuth').removeClass('is-invalid');
    $('label').removeClass('textDanger')
  }

  showFadeCheck(cond: string) {
    this.fadeCond.cond = cond
    $('#fadeCheckPass').show();
    $('#fadeCheck').show();
    $('.askForDelete').addClass('animate');
  }

  hideFadeCheck = (cond: string = null) => {

    $('#fadeCheckPass').hide();
    $('#fadeCheck').hide();
    $('.askForDelete').removeClass('animate');

    if (cond != null) {
      this.logService.getUsers().subscribe((data: UserData[]) => { // get all names
        this.users = data;
      });
      this.checked = false;
      $(`.chooseBtn`).removeClass('btn-secondary').addClass('btn-light');
    }
  }

  passInpVals(user: UserData = undefined) {

    if (user) {

      this.inpts = {
        userName: user.name,
        pass: user.auth,
        rePass: user.auth,
      }

      this.prems = {
        db: {
          workers: (user.workers === 1) ? true : false,
          clients: (user.clients === 1) ? true : false,
          unites: (user.unites === 1) ? true : false
        },
        acc: {
          stockes: (user.stockes === 1) ? true : false,
          safes: (user.safes === 1) ? true : false,
          customers: (user.workers === 1) ? true : false,
        },
        tasks: {
          master: (user.prem === 1) ? true : false,
          del: (user.del === 1) ? true : false,
          edit: (user.edi === 1) ? true : false,
        }
      }

    } else {
      this.clearInpVals()
    }
  }

  checkUser = () => {
    if (this.auth == this.users[0].auth) {
      this.hideFadeCheck();
      this.checked = true;
    } else {
      this.checkValid.cond = false
      this.checked = false;
      $('#checkAuth').addClass('is-invalid');
      $('label').addClass('textDanger')
    }
  }

  test = () => {
    //console.log(this.prems.db.workers)
  }

  clearInpVals() {

    this.inpts = {
      userName: null,
      pass: null,
      rePass: null,
    }

    this.prems = {
      db: {
        workers: false,
        clients: false,
        unites: false
      },
      acc: {
        stockes: false,
        safes: false,
        customers: false,
      },
      tasks: {
        master: false,
        del: false,
        edit: false,
      }
    }
  }

  switchPrem = () => {
    if (this.prems.tasks.master === true) {
      this.prems = {
        db: {
          workers: true,
          clients: true,
          unites: true
        },
        acc: {
          stockes: true,
          safes: true,
          customers: true,
        },
        tasks: {
          master: true,
          del: true,
          edit: true,
        }
      }
    } else {
      this.prems = {
        db: {
          workers: false,
          clients: false,
          unites: false
        },
        acc: {
          stockes: false,
          safes: false,
          customers: false,
        },
        tasks: {
          master: false,
          del: false,
          edit: false,
        }
      }
    }
  }

  isDone(user: UserData) {
    this.showFadeCheck('done');
    sessionStorage.setItem('y', `${JSON.stringify(user)}`);
    this.logService.check = JSON.parse(sessionStorage.getItem('y'));
  }

  postUser() {

    //let postBtn = $('#submitUserSetBtn').html();
    let user: UserData = {
      id: null,
      name: this.inpts.userName,
      auth: this.inpts.pass,
      edi: (this.prems.tasks.edit) ? 1 : 0,
      del: (this.prems.tasks.del) ? 1 : 0,
      prem: (this.prems.tasks.master) ? 1 : 0,
      workers: (this.prems.db.workers) ? 1 : 0,
      clients: (this.prems.db.clients) ? 1 : 0,
      unites: (this.prems.db.unites) ? 1 : 0,
      stockes: (this.prems.acc.stockes) ? 1 : 0,
      safes: (this.prems.acc.safes) ? 1 : 0,
      customers: (this.prems.acc.customers) ? 1 : 0
    }

    //this.fadeCond.cond = 'done'

    if (this.addOrUpdate == 'add') {
      this.fadeCond.msg = `تم اضافة المستخدم (${user.name})`
      this.logService.creatUser(user).subscribe();
      this.isDone(user)
    } else {
      if (this.logService.check.edi != 1) {
        window.alert('لا يوجد صلاحية للتعديل')
      } else {
        user.id = this.userInfo.id;
        this.fadeCond.msg = `تم تعديل بيانات المستخدم (${user.name})`
        this.logService.updateUser(user).subscribe();
        this.isDone(user)
      }
    }

  };

} // End
