import { Component, OnInit } from '@angular/core';
import { SideEffectService } from '../side-effect.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../login.service';
import { ServicesService } from '../services.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  currentUrl: string;
  ind: number;
  url: string;
  mainRoute: string;

  customerBtn = $('#customersBtn');
  workersBtn = $('#workersBtn');
  unitesBtn = $('#unitesBtn');
  safeAccBtn = $('#safeAccBtn');
  settBtn = $('#SettBtn');
  stocksBtn = $('#stocksBtn');
  //safeAcc
  htmlDbItemsBtns: any[] = [this.workersBtn, this.unitesBtn]
  dBUrls: any[] = ['/workers', '/unites'] // dataBaseUrls

  htmlAccItemsBtns: any[] = [this.customerBtn, this.stocksBtn, this.safeAccBtn];
  accUrls: any[] = ['/customers', '/stocks', '/safe-acc'];

  constructor(public _sideBarEffect: SideEffectService, public router: Router, public logService: LoginService, public _service: ServicesService) { }

  ngOnInit() {

    this.currentUrl = window.location.href;
    this.ind = this.currentUrl.lastIndexOf("/");
    this.url = this.currentUrl.slice(this.ind);

    $(".mainBtns").click(function () {
      //$('#sidebar').animate({ height: `${sidebarBtnsHeight + 20}px` });
      $(this).removeClass('btn-light').addClass('navHeader')
      $(this).next().slideToggle(100);
      $("#sidebar .secDiv").not($(this).next()).slideUp(100);
      $('#sidebar').css('height', 'auto')
      $('.mainBtns').not($(this)).not('#logOut').not('#MainSettingBtn').removeClass('navHeader').addClass('btn-light');
    });

    // make active button old code


    if (this.dBUrls.includes(this.url)) {
      this.mainRoute = 'Db'
      $('#dbBtn').next().show()
      $('#dbBtn').removeClass('btn-light').addClass('navHeader')
      $('#sidebar .secDiv').not($('#dbBtn').next()).hide()
    } else if (this.accUrls.includes(this.url)) {
      this.mainRoute = 'acc'
      $('#accBtn').next().show()
      $('#accBtn').removeClass('btn-light').addClass('navHeader')
      $('#sidebar .secDiv').not($('#accBtn').next()).hide()
    } else {
      this.mainRoute = 'false'
      $('#sidebar .secDiv').hide();
      $('#sidBar h3').not('#logOut').removeClass('navHeader').addClass('btn-light')
    };

    // active main btn
    for (let i = 0; i <= this.htmlDbItemsBtns.length; i++) {
      if (this.url == this.dBUrls[i]) { // dataBase
        this.htmlDbItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      } else if (this.url == this.accUrls[i]) { // accounting
        this.htmlAccItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      }
    }

    this._sideBarEffect.sideBarEffect()

    document.addEventListener('keydown', e => { // to open menu
      if (e.keyCode === 113) {
        this.sidebarToggle();
      };
    });

    window.addEventListener("resize", () => {
      if (window.innerHeight == screen.height) {
        // browser is fullscreen
        $('.panel-body').not('.invoiceTable').not('.standTable').not('.tableWithHeader').css('height', '920px')
        $('.invoiceTable').css('height', '590px')
        $('.tableWithHeader').css('height', '860px')
      } else {
        $('.panel-body').not('.invoiceTable').not('.standTable').not('.tableWithHeader').css('height', '820px')
        $('.tableWithHeader').css('height', '780px')
        $('.invoiceTable').css('height', '530px')
      };
    });

  }; // ngOnInit

  secButtonClick(btnId) {
    $(`#${btnId}`).removeClass('btn-light').addClass('btn-secondary')// .next().slideToggle(500);
    $("#sidebar .secButton").not(`#${btnId}`).removeClass('btn-secondary').addClass('btn-light');
    this.sidebarToggle();
  }

  logOut() {
    //this.logService.isUser = false;
    sessionStorage.removeItem('y')
    this.logService.isUser = false;
    this.router.navigate(['/logIn']);
    this.logService.checkIsUser();
    //this.logService.changeIsUser();
    $('#logOut').hide();
    //$('#sidebarToggle').hide();
    //location.reload();
  };

  // new effects
  sidebarToggle() {

    this.currentUrl = window.location.href;
    this.ind = this.currentUrl.lastIndexOf("/");
    this.url = this.currentUrl.slice(this.ind);

    const sideHight = (idStr: String) => {
      $('#sidebar').css('height', 'auto') 
      $('.mainBtns').not($(`${idStr}`)).not('#logOut').not('#MainSettingBtn').removeClass('navHeader').addClass('btn-light');
      $(`${idStr}`).next().show()
      $(`${idStr}`).removeClass('btn-light').addClass('navHeader')
      $('#sidebar .secDiv').not($(`${idStr}`).next()).hide()
      $('#sidebar').css('height', 'auto')
    };

    let sideBarHeight = $('#sidebar').height()

    if (this.dBUrls.includes(this.url)) {
      this.mainRoute = 'Db'
      sideHight('#dbBtn')
    } else if (this.accUrls.includes(this.url)) {
      this.mainRoute = 'acc'
      sideHight('#accBtn')
    } else {
      this.mainRoute = 'false'
      $('#sidebar .secDiv').hide();
      $('#sidBar h3').not('#logOut').removeClass('navHeader').addClass('btn-light')
    };
    
    let sidebarBtnsHeight = $('#sidebarBtns').height()
    let sidebarToggleLPosition = $('#sidebarToggle').position();
    let sidebarToggleHeight = sidebarToggleLPosition.top
    
    $('#sidebar').css({
      'marginTop': `${sidebarToggleHeight + 15}px`,
      'marginRight': '15px'
    })
    if (sideBarHeight == 0) { //open sideBar
      $('#sidebar').animate({ height: `${sidebarBtnsHeight + 20}px` }, 200).toggleClass('card');
      $('#sidebarBtns').show()
      $('#fadeEffect').fadeIn().css({
        'height': `100%`,
      })
      $('#sidebarToggle').hide();
    } else { //close sideBar
      $('#sidebarBtns').hide()
      $('#sidebar').css('height', '0').toggleClass('card');
      $('#fadeEffect').hide()
      $('#sidebarToggle').show();
    };    
  };

  fadeEffect() {
    $('#sidebarBtns').hide()
    $('#sidebar').removeClass("card").css('height', '0')
    $('#fadeEffect').hide()
    $('#sidebarToggle').show()
  }

  backupMsg: string;
  backupPath: string;

  backup() {
    this.sidebarToggle();
    $('#containerLoader').fadeIn();

    const postBackup = new Promise((res) => {
      this._service.backUp().subscribe(data => {
        this.backupMsg = data[1];
        this.backupPath = data[0]
        res('done')
      });
    });

    postBackup.then(() => {
      $('#sidebarToggle').hide();
      $('#containerLoader').fadeOut(0, () => {
        $('#fadeBackupDone').show();
        $('#backupDone').show();
        $('.askForDelete').addClass('animate');
      });
    });

  };

  hideBackUpDone() {
    $('#fadeBackupDone').hide();
    $('#backupDone').hide();
    $('.askForDelete').removeClass('animate');
    $('#sidebarToggle').show()
  };

}; // end
