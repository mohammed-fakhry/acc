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
  addBtnVal: string;
  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService) { }

  ngOnInit() {

    this.stockData = this.formBuilder.group({
      stockId: [''],
      stockName: [''],
      stockPlace: [''],
      stockEmployee: [''],
    });

  } // ngOnInit

  addNewStock() {
    this.addBtnVal = $('#addNewStockBtn').html();
    if (this.addBtnVal == 'اضافة') {
      this._stockService.creatStock(this.stockData.value)
        .subscribe();
      this._service.clearForm();
      location.reload()
    } else if (this.addBtnVal == 'تعديل') {
      this._stockService.updateStockSer(this._stockService.stockDataView).subscribe(() => {
        // show stockEnquiry
        $('.stocksClass').not('#stocksEnquiry').hide();
        $('#stocksEnquiry').show();
        $('#stocksSearch').show(100);
        $('#stockBtn').removeClass("btn-info").addClass("btn-light").animate({ fontSize: '1.5em' }, 50);
        $('#premissionBtn').removeClass('btn-light').addClass('btn-info').animate({ fontSize: '1em' }, 50);
        location.reload()
      },
        error => {
          alert(error);
        });
    };
  };

} // End
