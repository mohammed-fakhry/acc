import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { Stock } from 'src/app/accountings/stock';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-add-stocks',
  templateUrl: './add-stocks.component.html',
  styleUrls: ['./add-stocks.component.scss']
})
export class AddStocksComponent implements OnInit {

  stockData: FormGroup;
  stockDataView: Stock;
  constructor(private _stockService: StocksService, private formBuilder: FormBuilder,
    private _service: ServicesService) { }

  ngOnInit() {

    this.stockData = this.formBuilder.group({
      stockId: [''],
      stockName: [''],
      stockPlace: [''],
      stockEmployee: [''],
    });

  } // ngOnInit

  addNewStock() {
    this._stockService.creatStock(this.stockData.value)
      .subscribe();
      this._service.clearForm();
      console.log(this.stockData.value)
  }

} // End
