import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../stock';
import { StocksService } from '../stocks.service';
import { TheStocksComponent } from '../the-stocks.component';
import { StockTransactionD } from '../../stock-transaction-d';
import { trace } from 'console';
import { ServicesService } from 'src/app/services.service';
import { HandleBackEnd } from 'src/app/handle-back-end';

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
    this._theStocksComponent.deleteMsg = 'سيتم حذف بيانات المخزن و ايضاً حذف بيانات الاصناف .. يجب عمل نسخة احتياطية ربما لن يمكنك استرجاع هذه البيانات'
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
      total = parseInt(this._stockService.productsFromStockArryView[s].productQty) * parseInt(this._stockService.productsFromStockArryView[s].productCost)
      TotalForSum.push(total)
      count++
    };

    this._stockService.totalProductsValuInStock = this.sumArry(TotalForSum);
  };

  stockProducts: any[];

  showStockDetails(stock: Stock) {

    $('#containerLoader').fadeIn();

    let tranceArr = [];

    const getTransDetails = new Promise((res) => {
      this._stockService.allStockProductsTrans().subscribe((data) => {
        tranceArr = data
        res(data)
      });
    });

    const getHandle = new Promise((res) => {
      this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
        this._stockService.handleBackEnd = data;
        res(data)
      });
    });

    const stockProdFactory = () => {

      this.stockProducts = [];

      let products = []

      return new Promise((res) => {

        let filterd = tranceArr.filter(trance => trance.stockId == stock.stockId || trance.sndStockId == stock.stockId);

        for (let i = 0; i < this._stockService.allProducts.length; i++) {

          if (filterd != undefined) {

            let addProdArry =
              filterd.filter(trance => {
                return (trance.productId == this._stockService.allProducts[i].productId && trance.transactionType == 1)
                  || (trance.productId == this._stockService.allProducts[i].productId && trance.transactionType == 3 && trance.sndStockId == stock.stockId)
              });

            let minProdArry =
              filterd.filter(trance => {
                return (trance.productId == this._stockService.allProducts[i].productId && trance.transactionType == 2)
                  || (trance.productId == this._stockService.allProducts[i].productId && trance.transactionType == 3 && trance.sndStockId != stock.stockId)
              });

            let productDet = { // the main object

              productName: this._stockService.allProducts[i].productName,

              in: {
                qty: () => {
                  let qtyArr = addProdArry.map(trance => trance.Qty);
                  return this._service.sumArry(qtyArr)
                },
                totalPrices: () => {
                  let priceArr = addProdArry.map(trance => trance.price * trance.Qty);
                  return this._service.sumArry(priceArr)
                },
                avr: () => {
                  let math = productDet.in.totalPrices() / productDet.in.qty()
                  return parseFloat(math.toFixed(2))
                }
              },
              sold: {
                qty: () => {
                  let qtyArr = minProdArry.map(trance => trance.Qty);
                  return this._service.sumArry(qtyArr)
                },
                totalPrices: () => {
                  let priceArr = minProdArry.map(trance => trance.price * trance.Qty);
                  return this._service.sumArry(priceArr)
                }
              },

              remain: {
                qty: () => productDet.in.qty() - productDet.sold.qty(),
                val: () => {
                  let total = productDet.remain.qty() * productDet.in.avr()
                  return parseFloat(total.toFixed(2))
                },
                color: () => {
                  if (productDet.remain.qty() < 0) {
                    return 'text-danger font-weight-bold'
                  } else {
                    return 'text-dark'
                  }
                }
              },
              
            }; // productDet

            products = [...products, productDet];
          };
        };

        this._stockService.productsFromStockArryView = products.filter(product => product.remain.qty() != 0);

        res(this._stockService.productsFromStockArryView);
      });
    };

    Promise.all([getTransDetails, getHandle])
      .then(stockProdFactory).then(() => {

        let totalProductsValuArry = this._stockService.productsFromStockArryView.map(product => product.remain.val());
        this._stockService.totalProductsValuInStock = this._service.sumArry(totalProductsValuArry);

        $('.stocksClass').not('#stockDtails').hide();
        $('#stockDtails').show();
        $('#stocksSearch').hide(100);
        $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
        $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
        // loading fade
        $('#containerLoader').fadeOut();
      });

  };

}
