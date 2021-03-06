import { Component, OnInit } from '@angular/core';
import { Stock } from '../../../stock';
import { StocksService } from '../stocks.service';
import { TheStocksComponent } from '../the-stocks.component';
import { StockTransactionD } from '../../stock-transaction-d';
import { ServicesService } from 'src/app/services.service';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-enquire-stocks',
  templateUrl: './enquire-stocks.component.html',
  styleUrls: ['./enquire-stocks.component.scss']
})
export class EnquireStocksComponent implements OnInit {

  constructor(
    public _stockService: StocksService,
    public _theStocksComponent: TheStocksComponent,
    public _service: ServicesService,
    public _logService: LoginService
  ) { }

  ngOnInit() {
    // hide Fade layer
    $('#hideFadeLayer').click(function () {
      //$('.fadeLayer').hide()
      $('#theStockFadeLayer').fadeOut('fast')
      $('.askForDelete').fadeOut('fast').removeClass('animate')
    })
  } // ngOnInit

  askForDelete(stock: Stock) {
    if (this._logService.check.del != 1) {
      window.alert('لا يوجد صلاحية للحذف')
    } else {
      $('#theStockFadeLayer').show(0);
      $('#askForDeleteStock').show();
      $('.askForDelete').show().addClass('animate');
      this._stockService.stockDataView = stock;
      this._theStocksComponent.deleteMsg = 'سيتم حذف بيانات المخزن و ايضاً حذف بيانات الاصناف .. يجب عمل نسخة احتياطية ربما لن يمكنك استرجاع هذه البيانات'
    }

  };

  showUpdateStock(stock: Stock) {
    if (this._logService.check.edi != 1) {
      window.alert('لا يوجد صلاحية للتعديل')
    } else {
      $('.stocksClass').not('#addNewStock').hide();
      $('#addNewStock').show();
      $('#addNewStockBtn').html('تعديل');
      $('#addWorkerInside h2:first').html('تعديل بيانات مخزن');
      $('#stocksSearch').hide(100);
      $('#stockBtn').removeClass("btn-outline-info").addClass("btn-outline-secondary").animate({ fontSize: '1.5em' }, 50);
      $('#premissionBtn').removeClass('btn-outline-secondary').addClass('btn-outline-info').animate({ fontSize: '1em' }, 50);
      this._stockService.stockDataView = stock;
    }
  }

  sumArry(arr: any[]) {
    let s = 0
    for (let i = 0; i < arr.length; i++) {
      s = s + arr[i]
    }
    return s
  };

  showStockDetailsPre(stock: Stock) {

    //this._stockService.totalProductsValuInStock = 0;
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

    //this._stockService.totalProductsValuInStock = this.sumArry(TotalForSum);
  };

  stockProducts: any[];

  showStockDetails(stock: Stock) {

    $('#containerLoader').fadeIn();

    this._stockService.makeStockArryView = {
      stockName: stock.stockName,
      stockPlace: stock.stockPlace,
      stockEmployee: stock.stockEmployee
    };

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
        let filterdProdsId = [...new Set(filterd.map(prod => prod.productId))];


        for (let i = 0; i < filterdProdsId.length; i++) {

          let prodInfo = this._stockService.allProducts.find(prod => prod.productId == filterdProdsId[i]);
          let handleProduct = this._stockService.handleBackEnd.find(prod => prod.productId == filterdProdsId[i] && prod.stockId == stock.stockId)

          if (filterd != undefined) {

            let addProdArry =
              filterd.filter(trance => {
                return (trance.productId == filterdProdsId[i] && trance.transactionType == 1)
                  || (trance.productId == filterdProdsId[i] && trance.transactionType == 3 && trance.sndStockId == stock.stockId)
              });

            let minProdArry =
              filterd.filter(trance => {
                return (trance.productId == filterdProdsId[i] && trance.transactionType == 2)
                  || (trance.productId == filterdProdsId[i] && trance.transactionType == 3 && trance.sndStockId != stock.stockId)
              });

            let productDet = { // the main object

              productName: prodInfo.productName,

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
                  return parseFloat(total.toFixed(2).toLocaleString())
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
            if (handleProduct.productQty != productDet.remain.qty()) {
              handleProduct.productQty = productDet.remain.qty();
              this._stockService.updateStockPridge(handleProduct).subscribe();
            }

            products = [...products, productDet];
          };
        };

        this._stockService.productsFromStockArryView = products.filter(product => product.remain.qty() != 0);
        //console.log(this._stockService.productsFromStockArryView)

        res(this._stockService.productsFromStockArryView);
      });
    };

    Promise.all([getTransDetails, getHandle])
      .then(stockProdFactory).then(() => {

        let totalProductsValuArry = this._stockService.productsFromStockArryView.map(product => parseInt(product.remain.val()));

        this._stockService.totalProductsValuInStock = this._service.sumArry(totalProductsValuArry).toLocaleString();

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
