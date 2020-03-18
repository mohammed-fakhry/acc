import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { ServicesService } from '../../../services.service';
import { Router } from '@angular/router'
import { LoginService } from '../../../login.service';
import { StocksService } from './stocks.service';
import { Stock } from '../../stock';

@Component({
  selector: 'app-the-stocks',
  templateUrl: './the-stocks.component.html',
  styleUrls: ['./the-stocks.component.scss']
})
export class TheStocksComponent implements OnInit {

  
  constructor(private router: Router, private logService: LoginService,
    private _stockService: StocksService) { }

  ngOnInit() {

    this.logService.logStart(); this.logService.reternlog();
    this._stockService.getStockes().subscribe((data: Stock[]) => {
      this._stockService.stocks = data;
    });
    
  } // ngOnInit

  showStocksEnquiry() {
    $('.stocksClass').not('#stocksEnquiry').hide();
    $('#stocksEnquiry').show();
    $('#stocksSearch').show(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  };

  showAddNewStock() {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
  };

  deleteStock() {
    $('.fadeLayer').hide()
    this._stockService.deleteWorkerSer(this._stockService.stockDataView.stockId)
      .subscribe(data => {
        this._stockService.stocks = this._stockService.stocks.filter(u => u !== this._stockService.stockDataView)
      });
  };

} // End
