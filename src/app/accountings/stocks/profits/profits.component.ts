import { Component, OnInit } from '@angular/core';
import { StocksService } from '../the-stocks/stocks.service';
import { TheStocksComponent } from '../the-stocks/the-stocks.component';
import { HandleAddPrimBE } from '../handle-add-prim-be';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { element } from 'protractor';
import { ServicesService } from 'src/app/services.service';
import { Stock } from '../../stock';
import { SafeDataService } from '../../safe-acc/safe-data.service';
import { SafeData } from '../../safe-acc/safe-data';
import { SafeReceiptInpts } from '../../safe-acc/safe-receipt-inpts';
import { OtherAcc } from '../../other-acc';

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
  searchProd: string;

  constructor(public _stockService: StocksService,
    public _theStocksComponent: TheStocksComponent, public _servicesService: ServicesService, public _safeDataService: SafeDataService, public _service: ServicesService) { }

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

  otherAcc: OtherAcc[];
  safeReciepts: SafeReceiptInpts[];
  employeeExpence: number;
  otherExpence: number;

  showStockProfits(stock, index) {

    $('#containerLoader').fadeIn();

    const getHandleAdd = new Promise((res) => {
      this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
        this._stockService.HandleAddtoStockPrimArry = data;
        res(data)
      });
    });

    const getHandle = new Promise((res) => {
      this._stockService.getHandleBackEnd().subscribe((data: HandleBackEnd[]) => {
        this._stockService.handleBackEnd = data;
        res(data)
      });
    });

    const getSafeReceipt = new Promise((res) => {
      this._safeDataService.getSafesReceipt().subscribe((data: SafeReceiptInpts[]) => {
        this.safeReciepts = data;
        res(data)
      })
    })

    const otheAcc = new Promise((res) => {
      this._service.getOtherAccSer().subscribe((data: OtherAcc[]) => {
        this.otherAcc = data
        res(data)
      });
    })

    ////console.time('method')

    this.stockInfo = stock; //
    /*  HandleAddtoStockPrimArry
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


    /* handleBackEnd
    productCost: 146
    productId: "14"
    productName: "سوبر 1"
    productPrice: 187
    productQty: 1994
    stockId: "4"
    stockName: "حسام المخزن"
    stockProductId: "1"
    */

    let mainFilterdArr_in = [];
    let mainFilterdArr_sold = [];

    let filterdArr_In = [];
    let filterdArr_sold = [];
    let stockProds: HandleBackEnd[] = [];

    const makeExpences = () => {

      let employeeArr = this.safeReciepts.filter(acc => acc.AccName == 'مصاريف عمال');
      let employeeTotals = []

      for (let i = 0; i < employeeArr.length; i++) {
        let receiptVal = employeeArr[i].receiptVal;
        if (employeeArr[i].receiptKind == 'ايصال صرف نقدية') {
          receiptVal = - employeeArr[i].receiptVal;
        }
        employeeTotals.push(receiptVal)
      }
      this.employeeExpence = this._service.sumArry(employeeTotals);

      let otherAccArry = this.safeReciepts.filter(acc => acc.AccName == 'حساب المصاريف');
      let otherAccTotals = [];

      for (let o = 0; o < otherAccArry.length; o++) {
        let receiptVal_acc = otherAccArry[o].receiptVal;
        if (otherAccArry[o].receiptKind == 'ايصال صرف نقدية') {
          receiptVal_acc = - otherAccArry[o].receiptVal;
        }
        otherAccTotals.push(receiptVal_acc)
      }
      this.otherExpence = this._service.sumArry(otherAccTotals);

    };

    const makeHandlePrice = () => {

      this.profitArr = [];

      //mainFilterdArr_in = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 1 && h.stockId == stock.stockId)
      mainFilterdArr_in = this._stockService.HandleAddtoStockPrimArry
        .filter(h => h.stockId == stock.stockId || h.sndStockId == stock.stockId)
        .filter(h => h.transactionType == 1 || h.transactionType == 3)

      filterdArr_In =
        mainFilterdArr_in.map(invoic => {
          invoic = {
            ...invoic,
            date: () => {
              let day = new Date(invoic.date_time).getDate();
              let month = new Date(invoic.date_time).getMonth();
              let year = new Date(invoic.date_time).getFullYear();
              return `${day}-${month}-${year}`
            },
            time: new Date(invoic.date_time).getTime(),
          };
          return invoic
        });
      filterdArr_In.sort(this._servicesService.sortArry('time'))

      mainFilterdArr_sold = this._stockService.HandleAddtoStockPrimArry
        .filter(h => h.transactionType == 2 && h.stockId == stock.stockId);

      filterdArr_sold =
        mainFilterdArr_sold.map(invoic => {
          invoic = {
            ...invoic,
            date: () => {
              let day = new Date(invoic.date_time).getDate();
              let month = new Date(invoic.date_time).getMonth();
              let year = new Date(invoic.date_time).getFullYear();
              return `${day}-${month}-${year}`
            },
            time: new Date(invoic.date_time).getTime()
          };
          return invoic
        });
      filterdArr_sold.sort(this._servicesService.sortArry('time'));
      //console.log(filterdArr_sold)

      stockProds = this._stockService.handleBackEnd.filter(item => item.stockId == stock.stockId);

      for (let i = 0; i < stockProds.length; i++) {

        let mainArry = {
          // `${product.date.getDate()}-${product.date.getMonth()}-${product.date.getFullYear()}`
          in: {
            allDetails: filterdArr_In.filter(product => product.productId == stockProds[i].productId),
            qtyArr: () => mainArry.in.allDetails.map(product => product.Qty),
            pricesArr: () => mainArry.in.allDetails.map(product => product.price),
            price_X_qty: () => mainArry.in.allDetails.map(product => product.price * product.Qty),
            dateArry: () => mainArry.in.allDetails.map(product => product.date),
          },
          sold: {
            allDetails: filterdArr_sold.filter(product => product.productId == stockProds[i].productId),
            qtyArr: () => mainArry.sold.allDetails.map(product => product.Qty),
            pricesArr: () => mainArry.sold.allDetails.map(product => product.price),
            price_X_qty: () => mainArry.sold.allDetails.map(product => product.price * product.Qty),
            dateArry: () => mainArry.sold.allDetails.map(product => product.date),
          },
          everyDayArr: () => {
            let unique = [...new Set(mainArry.in.dateArry())];
            console.log(unique)
          }
        };

        let lastIndex_in = mainArry.in.pricesArr().length - 1;
        let lastIndex_Sold = mainArry.sold.pricesArr().length - 1;

        let pricesDetailsArr = {
          in: {
            totalPrices: this._servicesService.sumArry(mainArry.in.price_X_qty()),
            maxPrice: Math.max(...mainArry.in.pricesArr()),
            minPrice: Math.min(...mainArry.in.pricesArr()),
            totalQty: this._servicesService.sumArry(mainArry.in.qtyArr()),
            avarege: () => {
              if (this._servicesService.sumArry(mainArry.in.qtyArr()) != 0) {
                return (this._servicesService.sumArry(mainArry.in.price_X_qty()) / this._servicesService.sumArry(mainArry.in.qtyArr()))
              } else {
                return 0
              }
            },
          },
          sold: {
            totalPrices: this._servicesService.sumArry(mainArry.sold.price_X_qty()),
            maxPrice: Math.max(...mainArry.sold.pricesArr()),
            minPrice: Math.min(...mainArry.sold.pricesArr()),
            totalQty: this._servicesService.sumArry(mainArry.sold.qtyArr()),
            avarege: (this._servicesService.sumArry(mainArry.sold.price_X_qty()) / this._servicesService.sumArry(mainArry.sold.qtyArr())),
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

          let productProfit = ((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege()))) * pricesDetailsArr.sold.totalQty)

          let prodDetails = {

            name: stockProds[i].productName,
            qtyRemain: (pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty),
            qtyRemainVal: ((pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty) * Math.floor(pricesDetailsArr.in.avarege())),

            in: {
              qty: pricesDetailsArr.in.totalQty,
              qtyVal: pricesDetailsArr.in.totalPrices,
              maxPrice: pricesDetailsArr.in.maxPrice,
              minPrice: pricesDetailsArr.in.minPrice,
              avr: Math.floor(pricesDetailsArr.in.avarege()),
              lastPrice: () => mainArry.in.pricesArr()[lastIndex_in],
            },

            sold: {
              qty: pricesDetailsArr.sold.totalQty,
              qtyVal: pricesDetailsArr.sold.totalPrices,
              maxPrice: pricesDetailsArr.sold.maxPrice,
              minPrice: pricesDetailsArr.sold.minPrice,
              avr: Math.floor(pricesDetailsArr.sold.avarege),
              lastPrice: () => mainArry.sold.pricesArr()[lastIndex_Sold],
            },

            profits: {
              profit: productProfit,
              profitCond: () => {
                if (prodDetails.profits.profit < 0) {
                  return 'خسائر'
                } else {
                  return 'ارباح'
                }
              },
              profitsColor: () => {
                if (prodDetails.profits.profit < 0) {
                  return 'bg-danger text-light'
                } else {
                  return 'bg-success text-light'
                }
              },
              perc: () => {
                let perc = Math.floor((prodDetails.profits.profit / prodDetails.sold.qtyVal) * 100)
                return `${perc}%`
              }
            },

            profitLastPrice: {
              val: () => {
                if (prodDetails.qtyRemain < 0) {
                  return 0
                } else {
                  return ((prodDetails.sold.lastPrice() - prodDetails.in.avr) * prodDetails.qtyRemain)
                }
              },
              color: () => {
                if (prodDetails.profitLastPrice.val() >= 0) {
                  return 'text-dark'
                } else {
                  return 'text-danger font-weight-bold'
                }
              },
              percentage: () => {
                if (prodDetails.qtyRemainVal != 0) {
                  let perc = Math.floor((prodDetails.profitLastPrice.val() / prodDetails.qtyRemainVal) * 100)
                  return `${perc}%`
                } else {
                  return '0%'
                }
              },
              total: {
                val: () => prodDetails.profitLastPrice.val() + prodDetails.profits.profit,
                color: () => {
                  if (prodDetails.profitLastPrice.total.val() >= 0) {
                    return 'bg-success text-white'
                  } else {
                    return 'bg-danger text-white'
                  }
                }
              }
            },

            recommendedPrice: {
              price: () => {
                return ((prodDetails.in.avr * 10) / 100) + prodDetails.in.avr
              },
              profit: () => {
                if (prodDetails.qtyRemain < 0) {
                  return 0
                } else {
                  return Math.ceil(prodDetails.recommendedPrice.price() - prodDetails.in.avr) * prodDetails.qtyRemain
                };
              },
              percentage: () => {
                if (prodDetails.qtyRemainVal != 0) {
                  let perc = Math.floor((prodDetails.recommendedPrice.profit() / prodDetails.qtyRemainVal) * 100)
                  return `${perc}%`
                } else {
                  return '0%'
                }
              },
              total: {
                val: () => prodDetails.recommendedPrice.profit() + prodDetails.profits.profit,
                color: () => {
                  if (prodDetails.recommendedPrice.total.val() >= 0) {
                    return 'bg-success text-white'
                  } else {
                    return 'bg-danger text-white'
                  }
                },
              },
            },

          }; // prodDetails

          this.profitArr.push(prodDetails);

          /* stockProds[i].productQty = prodDetails.qtyRemain;
          this._stockService.updateStockPridge(stockProds[i]).subscribe(); */

          if (stockProds[i].productCost != prodDetails.in.avr) {
            stockProds[i].productCost = prodDetails.in.avr;
            this._stockService.updateStockPridge(stockProds[i]).subscribe();
          };

        }; // if (pricesDetailsArr.sold.totalQty != 0)

      };

      return Promise.resolve(this.profitArr);
    };

    Promise.all([getHandle, getHandleAdd, getSafeReceipt])
      .then(() => makeExpences())
      .then(makeHandlePrice).then((profitArray: any[]) => {

        let arrTotals = profitArray.map(element => element.profits.profit);
        let arrMin = arrTotals.filter(total => total < 0);
        let arrAdd = arrTotals.filter(total => total > 0);

        //console.log(arrTotals)

        this.totalProfit = this._servicesService.sumArry(arrTotals) + this.employeeExpence + this.otherExpence;
        this.totalMin = this._servicesService.sumArry(arrMin);
        this.totalAdd = this._servicesService.sumArry(arrAdd);

        $('.chooseBtn').not(`#showStockProfits${index}`).removeClass('btn-secondary').addClass('btn-light');
        $(`#showStockProfits${index}`).removeClass('btn-light').addClass('btn-secondary');
        $('#totalProfits').show();
        $('#customersProfits').hide();
        $('#productProfits').show();
        $('#searchProd').show();
        $('#showProfitsPreBtn').show();
        //setTimeout(() => $('#containerLoader').fadeOut(), 2000)
        $('#containerLoader').fadeOut();
      });

  };

  showStockProfitsPre(stock) {

    let filterdArr = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 2 && h.stockId == stock.stockId)

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

        (newObj.unitProfit < 0) ? newObj.color = 'bg-danger text-white' : newObj.color = 'bg-success text-white';
        (newObj.totalProfit < 0) ? newObj.colorTotal = 'bg-danger text-white' : newObj.colorTotal = 'lightBg text-dark';

        this.profitArrCust.push(newObj);
      };

    };

    $('#customersProfits').show();
    $('#productProfits').hide();
    $('#searchProd').hide();
    $('#showProfitsPreBtn').hide();

  };

} // end
