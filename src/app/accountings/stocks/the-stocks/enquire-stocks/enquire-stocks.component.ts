import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../stock';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'app-enquire-stocks',
  templateUrl: './enquire-stocks.component.html',
  styleUrls: ['./enquire-stocks.component.scss']
})
export class EnquireStocksComponent implements OnInit {

  constructor(private _stockService: StocksService) { }

  ngOnInit() {

    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      $('.fadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

  } // ngOnInit

  askForDelete(stock: Stock) {
    $('.fadeLayer').show(0);
    $('.askForDelete').addClass('animate');
    this._stockService.stockDataView = stock;
  };




}
