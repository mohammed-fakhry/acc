import { Component, OnInit } from '@angular/core';
import { SideEffectService } from '../side-effect.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../login.service';

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

  constructor(private _sideBarEffect: SideEffectService, public router: Router, private logService: LoginService) {

  }

  /* sideBarEffect() {
     $('#sidebarToggle').click(function () {
       $('#sideBar button').hide()
     })
   }*/

  ngOnInit() {

    this.currentUrl = window.location.href;
    this.ind = this.currentUrl.lastIndexOf("/");
    this.url = this.currentUrl.slice(this.ind);

    $(".mainBtns").click(function () {
      console.log($('#sidebarBtns').height())
      //$('#sidebar').animate({ height: `${sidebarBtnsHeight + 20}px` });
      $(this).removeClass('btn-light').addClass('navHeader')
      $(this).next().slideToggle(100);
      $("#sidebar .secDiv").not($(this).next()).slideUp(100);
      console.log($('#sidebarBtns').height())
      $('#sidebar').css('height', 'auto')
      $('.mainBtns').not($(this)).not('#logOut').not('#MainSettingBtn').removeClass('navHeader').addClass('btn-light');
      
      
    });

    // make active button
    let customerBtn = $('#customersBtn');
    let workersBtn = $('#workersBtn');
    let unitesBtn = $('#unitesBtn');
    let safeAccBtn = $('#safeAccBtn');
    //safeAcc
    let htmlDbItemsBtns: any[] = [workersBtn, unitesBtn]
    let dBUrls: any[] = ['/workers', '/unites'] // dataBaseUrls

    let stocksBtn = $('#stocksBtn');
    let htmlAccItemsBtns: any[] = [customerBtn, stocksBtn, safeAccBtn];
    let accUrls: any[] = ['/customers', '/stocks', '/safe-acc'];


    if (dBUrls.includes(this.url)) {
      this.mainRoute = 'Db'
      $('#dbBtn').next().show()
      $('#dbBtn').removeClass('btn-light').addClass('navHeader')
      $('#sidebar .secDiv').not($('#dbBtn').next()).hide()
    } else if (accUrls.includes(this.url)) {
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
    //console.log(this.mainRoute)
    for (let i = 0; i <= htmlDbItemsBtns.length; i++) {
      if (this.url == dBUrls[i]) { // dataBase
        htmlDbItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      } else if (this.url == accUrls[i]) { // accounting
        htmlAccItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      }
    }

    this._sideBarEffect.sideBarEffect()

    document.addEventListener('keydown', e => { // to open menu
      if (e.keyCode === 113) {
        this.sidebarToggle();
      };
    });

  }; // ngOnInit

  secButtonClick(btnId) {
    //console.log(btnId)
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
    console.log(this.logService.isUser)
    location.reload();
  };

  // new effects
  sidebarToggle() {
    let sideBarHeight = $('#sidebar').height()
    let sidebarBtnsHeight = $('#sidebarBtns').height()
    let sidebarToggleLPosition = $('#sidebarToggle').position();
    //let sidebarToggleLeft = sidebarToggleLPosition.left
    let sidebarToggleHeight = sidebarToggleLPosition.top
    //$('#sidebarToggle').removeClass('pFixed sticky-top');
    $('#sidebar').css({
      'marginTop': `${sidebarToggleHeight + 15}px`,
      'marginRight': '15px' //`${sidebarToggleLeft + 50} px`
    })
    if (sideBarHeight == 0) { //open sideBar
      $('#sidebar').animate({ height: `${sidebarBtnsHeight + 20}px` },200).toggleClass('card');
      $('#sidebarBtns').show()
      $('#fadeEffect').fadeIn().css({
        'height': `100%`,
      })
      $('#sidebarToggle').hide(); // removeClass("fa-align-justify").addClass("fa-minus")
    } else { //close sideBar
      $('#sidebarBtns').hide()
      $('#sidebar').css('height', '0').toggleClass('card'); //.animate({ height: '0px' }).toggleClass('card')
      $('#fadeEffect').hide()
      $('#sidebarToggle').show(); //removeClass("fa-minus").addClass("fa-align-justify")
    }
  }

  fadeEffect() {
    $('#sidebarBtns').hide()
    $('#sidebar').removeClass("card").css('height', '0') //animate({ height: '0px' }, 200)
    $('#fadeEffect').hide()
    $('#sidebarToggle').show() //removeClass("fa-minus").addClass("fa-align-justify")
    //$('#sidebarToggle').addClass('pFixed sticky-top');
  }

} // end
