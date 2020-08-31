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
  today: string;

  constructor(public _stockService: StocksService, public _service: ServicesService) {

   }

  ngOnInit() {
    this.makeTodayDate()
  }

  makeTodayDate = () => {
    let date = Date.now()
    let toDate = new Date (date)
    let dateStr = toDate.toUTCString(); //`${toDate.getFullYear()}, ${toDate.getMonth()}, ${toDate.getDay()}, ${toDate.getHours()}, ${toDate.getMinutes()}` //new Date(date)
    this.today = this._service.setDate_time(dateStr)
  }

  expandThisstockDet() {
    this._service.printThis();
  }

}
