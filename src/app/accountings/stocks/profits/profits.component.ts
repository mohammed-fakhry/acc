import { Component, OnInit } from '@angular/core';
import { StocksService } from '../the-stocks/stocks.service';
import { TheStocksComponent } from '../the-stocks/the-stocks.component';
import { HandleAddPrimBE } from '../handle-add-prim-be';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { element } from 'protractor';
import { ServicesService } from 'src/app/services.service';
import { Stock } from '../../stock';

@Component({
  selector: 'app-profits',
  templateUrl: './profits.component.html',
  styleUrls: ['./profits.component.scss']
})
export class ProfitsComponent implements OnInit {

  profitArr: any[];
  profitArrCust: any[];
  totalProfit: number;
  totalMin: number;
  totalAdd: number;
  stockInfo: Stock;

  constructor(public _stockService: StocksService,
    public _theStocksComponent: TheStocksComponent, public _servicesService: ServicesService) { }

  ngOnInit() {

  };

  stockProdArr: any[];

  getHandlePrim = new Promise((res) => {
    this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
      this._stockService.HandleAddtoStockPrimArry = data;
      res(data)
    });
  });

  getHandle = new Promise((res) => {
    this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
      this._stockService.handleBackEnd = data;
      res(data)
    });
  });



  showStockProfits(stock, index) {

    this.stockInfo = stock; //
    /* 
    Qty: 50
    customerId: "27"
    customerName: "عمر اشرف - حسام"
    date_time: "2020-05-17T15:52"
    invNumber: 1
    invoiceTotal: 4150
    notes: ""
    price: 83
    productId: "73"
    productName: "كليوباترا حمرا"
    sndStockId: "1"
    stockId: "4"
    stockName: "حسام المخزن"
    stockTransactionDetailsId: "1"
    stockTransactionId: "1589723611583"
    transactionType: "1"
    */


    /* 
    productCost: 146
    productId: "14"
    productName: "سوبر 1"
    productPrice: 187
    productQty: 1994
    stockId: "4"
    stockName: "حسام المخزن"
    stockProductId: "1"
    */

    let filterdArr_In = [];
    let filterdArr_sold = [];
    let stockProds: HandleBackEnd[] = [];

    const makeHandlePrice = () => {

      this.stockName = stock.stockName;
      this.profitArr = [];

      filterdArr_In = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 1 && h.stockId == stock.stockId);
      filterdArr_sold = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 2 && h.stockId == stock.stockId);

      stockProds = this._stockService.handleBackEnd.filter(item => item.stockId == stock.stockId);

      for (let i = 0; i < stockProds.length; i++) {

        if (stockProds[i].productQty != 0) {
          let mainArry = {
            in: {
              qtyArr: filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.Qty),
              pricesArr: filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.price),
              price_X_qty: filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.price * product.Qty),
            },
            sold: {
              qtyArr: filterdArr_sold.filter(product => product.productId == stockProds[i].productId).map(product => product.Qty),
              pricesArr: filterdArr_sold.filter(product => product.productId == stockProds[i].productId).map(product => product.price),
              price_X_qty: filterdArr_sold.filter(product => product.productId == stockProds[i].productId).map(product => product.price * product.Qty),
            }
          };

          let pricesDetailsArr = {
            in: {
              totalPrices: this._servicesService.sumArry(mainArry.in.price_X_qty),
              maxPrice: Math.max(...mainArry.in.pricesArr),
              minPrice: Math.min(...mainArry.in.pricesArr),
              totalQty: this._servicesService.sumArry(mainArry.in.qtyArr),
              avarege: (this._servicesService.sumArry(mainArry.in.price_X_qty) / this._servicesService.sumArry(mainArry.in.qtyArr)),
            },
            sold: {
              totalPrices: this._servicesService.sumArry(mainArry.sold.price_X_qty),
              maxPrice: Math.max(...mainArry.sold.pricesArr),
              minPrice: Math.min(...mainArry.sold.pricesArr),
              totalQty: this._servicesService.sumArry(mainArry.sold.qtyArr),
              avarege: (this._servicesService.sumArry(mainArry.sold.price_X_qty) / this._servicesService.sumArry(mainArry.sold.qtyArr)),
            }
          };

          if (pricesDetailsArr.sold.totalQty != 0) {
            if (pricesDetailsArr.sold.maxPrice == Infinity || pricesDetailsArr.sold.maxPrice == -Infinity) {
              pricesDetailsArr.sold.maxPrice = 0;
            };
            if (pricesDetailsArr.sold.minPrice == Infinity || pricesDetailsArr.sold.minPrice == -Infinity) {
              pricesDetailsArr.sold.minPrice = 0;
            };

            if (pricesDetailsArr.in.maxPrice == Infinity || pricesDetailsArr.in.maxPrice == -Infinity) {
              pricesDetailsArr.in.maxPrice = 0;
            };
            if (pricesDetailsArr.in.minPrice == Infinity || pricesDetailsArr.in.minPrice == -Infinity) {
              pricesDetailsArr.in.minPrice = 0;
            };

            let productProfit = ((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege))) * pricesDetailsArr.sold.totalQty);

            let prodDetails = {
              name: stockProds[i].productName,
              in: {
                qty: pricesDetailsArr.in.totalQty,
                qtyVal: pricesDetailsArr.in.totalPrices,
                maxPrice: pricesDetailsArr.in.maxPrice,
                minPrice: pricesDetailsArr.in.minPrice,
                avr: Math.floor(pricesDetailsArr.in.avarege)
              },
              sold: {
                qty: pricesDetailsArr.sold.totalQty,
                qtyVal: pricesDetailsArr.sold.totalPrices,
                maxPrice: pricesDetailsArr.sold.maxPrice,
                minPrice: pricesDetailsArr.sold.minPrice,
                avr: Math.floor(pricesDetailsArr.sold.avarege)
              },
              qtyRemain: (pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty),
              qtyRemainVal: ((pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty) * Math.floor(pricesDetailsArr.in.avarege)),
              profits: productProfit,
              profitCond: 'ارباح',
              profitsColor: 'darkBg text-light'
            };

            if (productProfit < 0) {
              prodDetails.profitsColor = 'bg-danger text-light'
              prodDetails.profitCond = 'خسائر'
            }

            this.profitArr.push(prodDetails);
          };

        };

        //let qtyArr_In = filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.Qty);
        //let totalPriceArr_In = filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.price * product.Qty);
        //let priceArr_In = filterdArr_In.filter(product => product.productId == stockProds[i].productId).map(product => product.price);

        //let qtyArr_sold = filterdArr_out.filter(product => product.productId == stockProds[i].productId).map(product => product.Qty);
        //let totalPriceArr_out = filterdArr_out.filter(product => product.productId == stockProds[i].productId).map(product => product.price * product.Qty);
        //let priceArr_out = filterdArr_out.filter(product => product.productId == stockProds[i].productId).map(product => product.price);

        //let maxPrice_In = Math.max(...mainArry.in.pricesArr);
        //let minPrice_In = Math.min(...mainArry.in.pricesArr);



        //let totalQty_In = this._servicesService.sumArry(mainArry.in.qtyArr);
        //let totalPrices_In = this._servicesService.sumArry(mainArry.in.price_X_qty);

        // if (pricesDetailsArr.in.maxPrice == Infinity || pricesDetailsArr.in.maxPrice == -Infinity) {
        //   pricesDetailsArr.in.maxPrice = 0;
        // };
        // if (pricesDetailsArr.in.minPrice == Infinity || pricesDetailsArr.in.minPrice == -Infinity) {
        //   pricesDetailsArr.in.minPrice = 0;
        // };

        //let avarege_In = (totalPrices_In / totalQty_In);

        // new code

        ////console.log(priceArr)
        // //console.log({
        //   name: stockProds[i].productName,
        //   qty_In: totalQty_In,
        //   priceTotal: totalPrices_In,
        //   min: pricesDetailsArr.in.minPrice,
        //   max: pricesDetailsArr.in.maxPrice,
        //   avarege: avarege_In
        // });


        //stockProds[i].productCost = Math.floor(avarege_In);


        //stockProds[i].productCost
      };



      //console.log(this.profitArr);

      return Promise.resolve('stockProds');
    };

    Promise.all([this.getHandle, this.getHandlePrim]).then(makeHandlePrice).then(() => {

      //`this.stockName = stock;

      let arrTotals = this.profitArr.map(element => element.profits);
      let arrMin = arrTotals.filter(total => total < 0);
      let arrAdd = arrTotals.filter(total => total > 0);

      this.totalProfit = this._servicesService.sumArry(arrTotals);
      this.totalMin = this._servicesService.sumArry(arrMin);
      this.totalAdd = this._servicesService.sumArry(arrAdd);
      //console.log(this.totalProfit)
      $('.chooseBtn').not(`#showStockProfits${index}`).removeClass('btn-secondary').addClass('btn-light');
      $(`#showStockProfits${index}`).removeClass('btn-light').addClass('btn-secondary');
      $('#totalProfits').show();
      $('#customersProfits').hide();
      $('#productProfits').show();
    });

    //makeHandlePrice()
  };

  showStockProfitsPre(stock) {

    //this.stockName = stock.stockName;

    // $('.chooseBtn').not(`#showStockProfits${index}`).removeClass('btn-secondary').addClass('btn-light')
    // $(`#showStockProfits${index}`).removeClass('btn-light').addClass('btn-secondary');
    console.log(stock)
    let filterdArr = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 2 && h.stockId == stock.stockId)
    //console.log(filterdArr)

    let stockProds = this._stockService.handleBackEnd.filter(stockF => stockF.stockId == stock.stockId)


    this.profitArrCust = []

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

        this.profitArrCust.push(newObj);
      };

      ////console.log('stockProds' + productdet.productCost /* JSON.stringify( productdet.productCost) */ )
    };
    console.log(this.profitArrCust)
    let arrTotals = this.profitArrCust.map(element => element.totalProfit);
    let arrMin = arrTotals.filter(n => n < 0);
    let arrAdd = arrTotals.filter(n => n > 0);
    $('#customersProfits').show();
    $('#productProfits').hide();

    // this.totalProfit = this._servicesService.sumArry(arrTotals);
    // this.totalMin = this._servicesService.sumArry(arrMin);
    // this.totalAdd = this._servicesService.sumArry(arrAdd);

  };

}
