import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../stock';
import { StocksService } from '../stocks.service';
import { TheStocksComponent } from '../the-stocks.component';
import { StockTransactionD } from '../../stock-transaction-d';
import { trace } from 'console';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-enquire-stocks',
  templateUrl: './enquire-stocks.component.html',
  styleUrls: ['./enquire-stocks.component.scss']
})
export class EnquireStocksComponent implements OnInit {

  constructor(public _stockService: StocksService,
    public _theStocksComponent: TheStocksComponent, public _service: ServicesService) { }

  ngOnInit() {
    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      //$('.fadeLayer').hide()
      $('#theStockFadeLayer').hide()
      $('.askForDelete').removeClass('animate')
    })

    ////console.log(this._stockService.stocks)

  } // ngOnInit

  askForDelete(stock: Stock) {
    //$('.fadeLayer').show(0);
    $('#theStockFadeLayer').show(0);
    $('#askForDeleteStock').show();
    $('.askForDelete').addClass('animate');
    this._stockService.stockDataView = stock;
  };

  showUpdateStock(stock: Stock) {
    $('.stocksClass').not('#addNewStock').hide();
    $('#addNewStock').show();
    $('#addNewStockBtn').html('تعديل');
    $('#addWorkerInside h2:first').html('تعديل بيانات مخزن');
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    this._stockService.stockDataView = stock;
  }

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  showStockDetailsPre(stock: Stock) {
    this._stockService.totalProductsValuInStock = 0;
    //this.totalProductsValuArry = [];
    $('.stocksClass').not('#stockDtails').hide();
    $('#stockDtails').show();
    $('#stocksSearch').hide(100);
    $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
    $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
    // get the data
    this._theStocksComponent.testBackend();

    let getStockProducts = this._stockService.makeStockArry.find(
      stockArr => stockArr.stockId == stock.stockId
    );
    this._stockService.makeStockArryView = getStockProducts;

    this._stockService.productsFromStockArryView = getStockProducts.stockProducts.filter(
      p => p.productQty != 0
    );

    this._stockService.productsFromStockArryView.toLocaleString()
    let total = 0
    let TotalForSum: any[] = [];
    let count = 0;
    for (let s = 0; s < this._stockService.productsFromStockArryView.length; s++) {
      //this._stockService.totalProductsValuInStock = this._stockService.totalProductsValuInStock +
      total = parseInt(this._stockService.productsFromStockArryView[s].productQty) * parseInt(this._stockService.productsFromStockArryView[s].productCost)
      TotalForSum.push(total)
      count++
      //console.log(count)
    }
    //this._stockService.makeInvoiceArry()
    ////console.log(this._stockService.makeInvoiceArry())
    this._stockService.totalProductsValuInStock = this.sumArry(TotalForSum)
    //console.log(this._stockService.productsFromStockArryView)

    ////console.log(this.totalProductsValu)
  };

  stockProducts: any[];

  showStockDetails(stock: Stock) {

    $('#containerLoader').fadeIn();

    let tranceArr = [];
    this._stockService.makeStockArryView = {
      stockName: stock.stockName,
      stockPlace: stock.stockPlace,
      stockEmployee: stock.stockEmployee
    }

    const getTransDetails = new Promise((res) => {
      this._stockService.allStockProductsTrans().subscribe((data) => {
        tranceArr = data
        res(data)
      });
    });

    const stockProdFactory = () => {

      this.stockProducts = [];

      let products = []

      return new Promise((res) => {

        let filterd = tranceArr.filter(trance => trance.stockId == stock.stockId || trance.sndStockId == stock.stockId);

        for (let i = 0; i < this._stockService.allProducts.length; i++) {

          let addProdArry =
            filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
              trance.transactionType == 1).map(trance => trance.Qty)

          let minProdArry =
            filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
              trance.transactionType == 2).map(trance => trance.Qty);

          let addTrance = filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
            trance.transactionType == 3 && trance.sndStockId == stock.stockId).map(trance => trance.Qty);

          let minTrance = filterd.filter(trance => trance.productId == this._stockService.allProducts[i].productId &&
            trance.transactionType == 3 && trance.sndStockId != stock.stockId).map(trance => trance.Qty);

          let productDet = {
            productName: this._stockService.allProducts[i].productName,
            plus: this._service.sumArry(addProdArry),
            min: this._service.sumArry(minProdArry),
            plusTrance: this._service.sumArry(addTrance),
            minTrance: this._service.sumArry(minTrance),
            productQty: ((this._service.sumArry(addProdArry) + this._service.sumArry(addTrance)) - (this._service.sumArry(minProdArry) + this._service.sumArry(minTrance)))
          };

          products = [...products, productDet]

        };

        this._stockService.productsFromStockArryView = products.filter(product => product.productQty != 0);

        //console.log(this._stockService.productsFromStockArryView);
        res(this._stockService.productsFromStockArryView);
      })
    }

    getTransDetails.then(stockProdFactory).then(() => {
      this._stockService.totalProductsValuInStock = 0;
      //this.totalProductsValuArry = [];
      $('.stocksClass').not('#stockDtails').hide();
      $('#stockDtails').show();
      $('#stocksSearch').hide(100);
      $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
      $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);

      $('#containerLoader').fadeOut();
    });

  };

}
