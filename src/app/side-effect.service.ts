import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideEffectService {

  constructor() { }

  sideBarEffect() {
    $('#homeBtn').click(function() {
      $('#sideBar button').removeClass('btn-dark').addClass('btn-light')
    })
  }
  
}
