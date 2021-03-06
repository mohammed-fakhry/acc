import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private logService: LoginService,
    public _service: ServicesService
  ) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();

    $('#homeLogo').fadeIn(1500)

    setTimeout(() => $('#hint').fadeIn(1000), 2000)
  }

}
