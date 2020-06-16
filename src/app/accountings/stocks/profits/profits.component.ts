import { Component, OnInit } from '@angular/core';
import { StocksService } from '../the-stocks/stocks.service';
import { TheStocksComponent } from '../the-stocks/the-stocks.component';
import { HandleAddPrimBE } from '../handle-add-prim-be';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { element } from 'protractor';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-profits',
  templateUrl: './profits.component.html',
  styleUrls: ['./profits.component.scss']
})
export class ProfitsComponent implements OnInit {

  profitArr: any[];
  totalProfit: number;
  totalMin: number;
  totalAdd: number;
  stockName: string;

  constructor(public _stockService: StocksService,
    public _theStocksComponent: TheStocksComponent, public _servicesService: ServicesService) { }

  ngOnInit() {

  };

  showStockProfits(stock, index) {

    this.stockName = stock.stockName;
    
    $('.chooseBtn').not(`#showStockProfits${index}`).removeClass('btn-secondary').addClass('btn-light')
    $(`#showStockProfits${index}`).removeClass('btn-light').addClass('btn-secondary');

    let filterdArr = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 2 && h.stockId == stock.stockId)
    console.log(filterdArr)

    let stockProds = this._stockService.handleBackEnd.filter(stockF => stockF.stockId == stock.stockId)


    this.profitArr = []

    for (let i = 0; i < filterdArr.length; i++) {

      let productdet: HandleBackEnd = stockProds.find(prod => filterdArr[i].productId == prod.productId);
      let itemDate = new Date(filterdArr[i].date_time);
      let theDate = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;

      if (productdet != undefined) {

        let newObj = {
          date: theDate,
          invNumber: filterdArr[i].invNumber,
          customerName: filterdArr[i].customerName,
          productName: filterdArr[i].productName,
          Qty: filterdArr[i].Qty,
          productCost: productdet.productCost,
          price: filterdArr[i].price,
          unitProfit: filterdArr[i].price - productdet.productCost,
          color: '',
          totalProfit: (filterdArr[i].price - productdet.productCost) * filterdArr[i].Qty,
          colorTotal: ''
        };

        (newObj.unitProfit < 0) ? newObj.color = 'bg-danger text-white' : newObj.color = '';
        (newObj.totalProfit < 0) ? newObj.colorTotal = 'bg-danger text-white' : newObj.color = '';

        this.profitArr.push(newObj);
      };

      //console.log('stockProds' + productdet.productCost /* JSON.stringify( productdet.productCost) */ )
    };
    console.log(this.profitArr)
    let arrTotals = this.profitArr.map(element => element.totalProfit);
    let arrMin = arrTotals.filter(n => n < 0);
    let arrAdd = arrTotals.filter(n => n > 0);
    this.totalProfit = this._servicesService.sumArry(arrTotals);
    this.totalMin = this._servicesService.sumArry(arrMin);
    this.totalAdd = this._servicesService.sumArry(arrAdd);

  };

}
