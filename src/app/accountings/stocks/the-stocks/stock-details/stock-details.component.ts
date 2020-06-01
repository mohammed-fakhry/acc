import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss']
})
export class StockDetailsComponent implements OnInit {

  productSearchTxt:string;

  constructor(public _stockService: StocksService, public _service: ServicesService) {

   }

  ngOnInit() {
  }

  expandThisstockDet() {
    let show = "#stockDetail";
    let hide1 = '#stockDetHead';
    let hide2 = '';
    let hide3 = '';
    this._service.printThis(show, hide1, hide2, hide3);
    $('#stockDetailtable').css(
      { 'height': '100%' }
    );
    $('#stockDetail').removeClass('col-md-9').css('margin', 'auto')
    $('.navHeader').addClass('sticky-top');
    $('.closeBtn').show();
    $('.fa-expand').hide();
  }

  reloadLoc() {
    location.reload();
  }
  openwindowPrint() {
    $('#stockDetail').css('width', '100%')
    window.print();
    location.reload();
  }
}
