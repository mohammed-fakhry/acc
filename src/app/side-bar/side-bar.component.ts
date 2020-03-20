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

    // main buttons
    $('#sideBar h3').hover(function () {
      $(this).animate({ fontSize: '1.3em' }, 100)
    }, function () {
      $(this).animate({ fontSize: '1.2em' }, 100)
    })
    $("#sideBar h3").click(function () {
      $(this).removeClass('btn-light').addClass('btn-info')
      $(this).next().slideToggle(500);
      $("#sideBar div").not($(this).next()).slideUp(500);
      $('#sideBar h3').not($(this)).not('#logOut').not('#MainSettingBtn').removeClass('btn-info').addClass('btn-light')
    })
    // make active button
    let customerBtn = $('#customersBtn'); let workersBtn = $('#workersBtn'); let unitesBtn = $('#unitesBtn');
    let htmlDbItemsBtns: any[] = [customerBtn, workersBtn, unitesBtn]
    let dBUrls: any[] = ['/customers', '/workers', '/unites'] // dataBaseUrls

    let stocksBtn = $('#stocksBtn')
    let htmlAccItemsBtns: any[] = [stocksBtn]
    let accUrls: any[] = ['/stocks']


    if (dBUrls.includes(this.url)) {
      this.mainRoute = 'Db'
      $('#dbBtn').next().show()
      $('#dbBtn').removeClass('btn-light').addClass('btn-info')
      $('#sideBar div').not($('#dbBtn').next()).hide()
    } else if (accUrls.includes(this.url)) {
      this.mainRoute = 'acc'
      $('#accBtn').next().show()
      $('#accBtn').removeClass('btn-light').addClass('btn-info')
      $('#sideBar div').not($('#accBtn').next()).hide()
    } else {
      this.mainRoute = 'false'
      $('#sideBar div').hide();
      $('#sidBar h3').not('#logOut').removeClass('btn-info').addClass('btn-light')
    }

    // active main btn
    //console.log(this.mainRoute)
    for (let i = 0; i <= customerBtn.length; i++) {
      if (this.url == dBUrls[i]) { // dataBase
        htmlDbItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      } else if (this.url == accUrls[i]) { // accounting
        htmlAccItemsBtns[i].removeClass('btn-light').addClass('btn-secondary');
      }
    }
    
    // hoverEffect
    $('#sideBar button').hover(function () {
      $(this).animate({ fontSize: '1.05em' }, 100)
    }, function () {
      $(this).animate({ fontSize: '1em' }, 100)
    })
    // clickEffect
    $("#sideBar button").click(function () {
      $(this).removeClass('btn-light').addClass('btn-secondary')// .next().slideToggle(500);
      $("#sideBar button").not(this).removeClass('btn-secondary').addClass('btn-light');
    })

    this._sideBarEffect.sideBarEffect()
  }

  logOut() {
    //this.logService.isUser = false;
    sessionStorage.removeItem('y')
    this.logService.isUser = false;
    this.router.navigate(['/logIn']);
    this.logService.checkIsUser();
    //this.logService.changeIsUser();
    $('#logOut').hide()
    console.log(this.logService.isUser)
    location.reload();
  }
}
