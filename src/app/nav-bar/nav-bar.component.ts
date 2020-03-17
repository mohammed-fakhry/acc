import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private logService: LoginService, private router: Router) { }

  ngOnInit() {
    
    //routerLink="/logIn"
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
  }
}
