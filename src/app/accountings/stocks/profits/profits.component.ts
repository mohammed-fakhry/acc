import { Component, OnInit } from '@angular/core';
import { StocksService } from '../the-stocks/stocks.service';
import { TheStocksComponent } from '../the-stocks/the-stocks.component';
import { HandleAddPrimBE } from '../handle-add-prim-be';
import { HandleBackEnd } from 'src/app/handle-back-end';
import { ServicesService } from 'src/app/services.service';
import { Stock } from '../../stock';
import { SafeDataService } from '../../safe-acc/safe-data.service';
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
  totalProfit: string;
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

  theStock: Stock;
  theIndex: number;
  theStockName: string = ''

  showProfitOptions(stock, index) {

    this.theStock = stock;
    this.theIndex = index;
    this.theStockName = stock.stockName
    this.searchProd = null;
    $('#howIsProfits').show();
    $('#productProfits').hide();
    $('#customersProfits').hide();
    $('#totalProfits').hide();
    $('.chooseBtn').not(`#showStockProfits${this.theIndex}`).removeClass('btn-secondary').addClass('btn-light');
    $(`#showStockProfits${this.theIndex}`).removeClass('btn-light').addClass('btn-secondary');

  };

  dateSortFrom: any;
  dateSortTo: any;

  filtered: boolean;

  dateChanged() {
    $('#makeDateNullBtn').show();
  }

  makeDateNull() {
    this.dateSortFrom = null;
    this.dateSortTo = null;
    $('#makeDateNullBtn').hide();
  }

  totalProfitClass: string;

  showStockProfits(/* stock, index */) {

    $('#howIsProfits').hide();

    $('#containerLoader').fadeIn();

    $('.sortBtns').attr({'disabled': false})

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

    this.stockInfo = this.theStock; //

    let mainFilterdArr_in = [];
    let mainFilterdArr_sold = [];

    let filterdArr_In = [];
    let filterdArr_sold = [];
    let stockProds: HandleBackEnd[] = [];

    let match_fromDate = this.dateSortFrom + 'T00:00';
    let match_toDate = this.dateSortTo + 'T23:59';

    const filterDate = () => {

      if (this.dateSortFrom != undefined && this.dateSortTo != undefined && this.dateSortFrom != null && this.dateSortTo != null) {

        mainFilterdArr_in =
          this._stockService.HandleAddtoStockPrimArry
            .filter(h => ((h.stockId == this.theStock.stockId && h.transactionType == 1)
              || (h.sndStockId == this.theStock.stockId && h.transactionType == 3))
              && h.date_time < match_toDate);
        //.filter(h => h.transactionType == 1 || h.transactionType == 3)

        mainFilterdArr_sold = this._stockService.HandleAddtoStockPrimArry
          .filter(h => h.transactionType == 2 && h.stockId == this.theStock.stockId && h.date_time > match_fromDate && h.date_time < match_toDate)

        this.safeReciepts = this.safeReciepts.filter((date) => {
          return date.date_time > match_fromDate && date.date_time < match_toDate
        });

        this.filtered = true;

      } else {

        mainFilterdArr_in = this._stockService.HandleAddtoStockPrimArry
          .filter(h => (h.stockId == this.theStock.stockId && h.transactionType == 1)
            || (h.sndStockId == this.theStock.stockId && h.transactionType == 3))

        mainFilterdArr_sold = this._stockService.HandleAddtoStockPrimArry
          .filter(h => h.transactionType == 2 && h.stockId == this.theStock.stockId);

        this.filtered = false;

      };

      return Promise.resolve('filterd');
    };

    const makeExpences = () => {

      if (this.theStock.stockName == 'حسام المخزن') {
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


      } else if (this.theStock.stockName == 'سيف المخزن') {
        let employeeArr = this.safeReciepts.filter(acc => acc.AccName == 'مصاريف عمال - سيف');
        let employeeTotals = []

        for (let i = 0; i < employeeArr.length; i++) {
          let receiptVal = employeeArr[i].receiptVal;
          if (employeeArr[i].receiptKind == 'ايصال صرف نقدية') {
            receiptVal = - employeeArr[i].receiptVal;
          }
          employeeTotals.push(receiptVal)
        }
        this.employeeExpence = this._service.sumArry(employeeTotals);

        let otherAccArry = this.safeReciepts.filter(acc => acc.AccName == 'حساب المصاريف - سيف');
        let otherAccTotals = [];

        for (let o = 0; o < otherAccArry.length; o++) {
          let receiptVal_acc = otherAccArry[o].receiptVal;
          if (otherAccArry[o].receiptKind == 'ايصال صرف نقدية') {
            receiptVal_acc = - otherAccArry[o].receiptVal;
          }
          otherAccTotals.push(receiptVal_acc)
        }
        this.otherExpence = this._service.sumArry(otherAccTotals);
      }

    };

    const makeHandlePrice = () => {

      this.profitArr = [];

      /* mainFilterdArr_in
        .filter(h => h.stockId == this.theStock.stockId || h.sndStockId == this.theStock.stockId)
        .filter(h => h.transactionType == 1 || h.transactionType == 3) */

      filterdArr_In =
        mainFilterdArr_in.map(invoic => {
          invoic = {
            ...invoic,
            date: () => {
              let i = invoic.date_time.indexOf('T')
              return invoic.date_time.slice(0, i);
            },
            time: new Date(invoic.date_time).getTime(),
          };
          return invoic
        });
      filterdArr_In.sort(this._servicesService.sortArry('time'))

      /* mainFilterdArr_sold.filter(h => h.transactionType == 2 && h.stockId == this.theStock.stockId); */

      filterdArr_sold =
        mainFilterdArr_sold.map(invoic => {
          invoic = {
            ...invoic,
            date: () => {
              let i = invoic.date_time.indexOf('T')
              return invoic.date_time.slice(0, i);
            },
            time: new Date(invoic.date_time).getTime()
          };
          return invoic
        });
      filterdArr_sold.sort(this._servicesService.sortArry('time'));

      stockProds = this._stockService.handleBackEnd.filter(item => item.stockId == this.theStock.stockId);

      for (let i = 0; i < stockProds.length; i++) {

        let inDateArr: any[] = [];
        let betweenDateArry: any[] = [] // filtered arry between the two dates

        if (this.filtered) {
          let between: any[]
          between =
            this._stockService.HandleAddtoStockPrimArry
              .filter(h => ((h.stockId == this.theStock.stockId && h.transactionType == 1)
                || (h.sndStockId == this.theStock.stockId && h.transactionType == 3))
                && h.date_time < match_toDate && h.date_time > match_fromDate
                && (h.productId == stockProds[i].productId)
              );

          betweenDateArry = between.map(invoic => {
            invoic = {
              ...invoic,
              date: () => {
                let i = invoic.date_time.indexOf('T')
                return invoic.date_time.slice(0, i);
              },
              time: new Date(invoic.date_time).getTime()
            };
            return invoic
          }).sort(this._servicesService.sortArry('time'));

          inDateArr = betweenDateArry.map(product => product.date());
        };

        let mainArry = {

          in: {
            allDetails: filterdArr_In.filter(product => product.productId == stockProds[i].productId),
            qtyArr: () => mainArry.in.allDetails.map(product => product.Qty),
            pricesArr: () => mainArry.in.allDetails.map(product => product.price),
            price_X_qty: () => mainArry.in.allDetails.map(product => product.price * product.Qty),
            dateArry: () => mainArry.in.allDetails.map(product => product.date()),
          },
          sold: {
            allDetails: filterdArr_sold.filter(product => product.productId == stockProds[i].productId),
            qtyArr: () => mainArry.sold.allDetails.map(product => product.Qty),
            pricesArr: () => mainArry.sold.allDetails.map(product => product.price),
            price_X_qty: () => mainArry.sold.allDetails.map(product => product.price * product.Qty),
            dateArry: () => mainArry.sold.allDetails.map(product => product.date()),
          },
          everyDayArrIn: () => {
            let unique = [];
            if (this.filtered) { // array if dateFiltered
              unique = [...new Set(inDateArr)]
            } else {
              unique = [...new Set(mainArry.in.dateArry())]; // array without dateFiltered
            }
            return unique
          },

        };

        if (mainArry.sold.qtyArr().length > 0) {

          let lastIndex_in = mainArry.in.pricesArr().length - 1;
          let lastIndex_Sold = mainArry.sold.pricesArr().length - 1;

          let maxIn = Math.max(...mainArry.in.pricesArr());
          let minIn = Math.min(...mainArry.in.pricesArr());
          let maxSold = Math.max(...mainArry.sold.pricesArr());
          let minSold = Math.min(...mainArry.sold.pricesArr());

          let pricesDetailsArr = {
            in: {
              totalPrices: this._servicesService.sumArry(mainArry.in.price_X_qty()),
              maxPrice: (maxIn == Infinity || maxIn == -Infinity) ? 0 : maxIn,
              minPrice: (minIn == Infinity || minIn == -Infinity) ? 0 : minIn,
              totalQty: this._servicesService.sumArry(mainArry.in.qtyArr()),
              lastPrice: () => mainArry.in.pricesArr()[lastIndex_in],
              avarege: () => {

                if (mainArry.everyDayArrIn().length > 1) {
                  return (this._servicesService.sumArry(mainArry.in.price_X_qty()) / this._servicesService.sumArry(mainArry.in.qtyArr()))
                } else {
                  return pricesDetailsArr.in.lastPrice()
                }
              },
            },
            sold: {
              totalPrices: this._servicesService.sumArry(mainArry.sold.price_X_qty()),
              maxPrice: (maxSold == Infinity || maxSold == -Infinity) ? 0 : maxSold,
              minPrice: (minSold == Infinity || minSold == -Infinity) ? 0 : minSold,
              totalQty: this._servicesService.sumArry(mainArry.sold.qtyArr()),
              avarege: (this._servicesService.sumArry(mainArry.sold.price_X_qty()) / this._servicesService.sumArry(mainArry.sold.qtyArr())),
            }
          };

          if (pricesDetailsArr.sold.totalQty != 0) {

            //let productProfit = ((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege()))) * pricesDetailsArr.sold.totalQty)

            let prodDetails = { // the main object

              name: stockProds[i].productName,
              productId: stockProds[i].productId,
              qtyRemain: () => (pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty),
              qtyRemainVal: ((pricesDetailsArr.in.totalQty - pricesDetailsArr.sold.totalQty) * Math.floor(pricesDetailsArr.in.avarege())),
              onlyProfitMsg: () => {
                if (this.filtered) {
                  return `كمية بيع | ${pricesDetailsArr.sold.totalQty}`
                } else if (prodDetails.qtyRemain() == 0) {
                  return `لا يوجد رصيد لهذا الصنف`
                }
              },

              in: {
                qty: pricesDetailsArr.in.totalQty,
                qtyVal: pricesDetailsArr.in.totalPrices.toFixed(0),
                maxPrice: pricesDetailsArr.in.maxPrice,
                minPrice: pricesDetailsArr.in.minPrice,
                lastPrice: () => mainArry.in.pricesArr()[lastIndex_in],
                avr: Math.floor(pricesDetailsArr.in.avarege()),
              },

              sold: {
                qty: pricesDetailsArr.sold.totalQty,
                qtyVal: pricesDetailsArr.sold.totalPrices,
                maxPrice: pricesDetailsArr.sold.maxPrice,
                minPrice: pricesDetailsArr.sold.minPrice,
                lastPrice: () => mainArry.sold.pricesArr()[lastIndex_Sold],
                avr: Math.floor(pricesDetailsArr.sold.avarege),
              },

              profits: {
                profit: ((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege()))) * pricesDetailsArr.sold.totalQty),
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

              profitForSort: ((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege()))) * pricesDetailsArr.sold.totalQty),
              percForSort: ((((Math.floor(pricesDetailsArr.sold.avarege - Math.floor(pricesDetailsArr.in.avarege()))) * pricesDetailsArr.sold.totalQty) / (pricesDetailsArr.sold.totalPrices)) * 100), // () => Math.floor((prodDetails.profits.profit / prodDetails.sold.qtyVal) * 100),
              
              profitLastPrice: {
                val: () => {
                  if (prodDetails.qtyRemain() < 0) {
                    return 0
                  } else {
                    return Math.ceil((prodDetails.sold.lastPrice() - prodDetails.in.avr) * prodDetails.qtyRemain());
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
                  if (prodDetails.qtyRemain() < 0) {
                    return 0
                  } else {
                    return Math.ceil(prodDetails.recommendedPrice.price() - prodDetails.in.avr) * prodDetails.qtyRemain()
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
            if (!this.filtered && (stockProds[i].productCost != prodDetails.in.avr)) {
              stockProds[i].productCost = prodDetails.in.avr;
              this._stockService.updateStockPridge(stockProds[i]).subscribe();
            };

          }; // if (pricesDetailsArr.sold.totalQty != 0)
        };
      };

      return Promise.resolve(this.profitArr);
    };

    Promise.all([getHandle, getHandleAdd, getSafeReceipt])
      .then(filterDate)
      .then(() => makeExpences())
      .then(makeHandlePrice).then((profitArray: any[]) => {

        let arrTotals = profitArray.map(element => element.profits.profit);
        
        let arrMin = arrTotals.filter(total => total < 0);
        let arrAdd = arrTotals.filter(total => total > 0);

        this.totalProfit = (this._servicesService.sumArry(arrTotals) + this.employeeExpence + this.otherExpence).toLocaleString();
        this.totalProfitClass = (parseInt( this.totalProfit) < 0) ?  'bg-danger text-white' : 'lightBg';
        this.totalMin = this._servicesService.sumArry(arrMin);
        this.totalAdd = this._servicesService.sumArry(arrAdd);

        for (let i = 0; i < this.profitArr.length; i++) {
          if (this.profitArr[i].qtyRemain == 0) {
            $(`#remainProfit${i}`).hide()
          };
        };

        $('.chooseBtn').not(`#showStockProfits${this.theIndex}`).removeClass('btn-secondary').addClass('btn-light');
        $(`#showStockProfits${this.theIndex}`).removeClass('btn-light').addClass('btn-secondary');
        $('#containerLoader').fadeOut(0, () => {
          $('#totalProfits').show();
          $('#customersProfits').hide();
          $('#productProfits').slideDown(300);
          $('#searchProd').show();
          $('#showProfitsPreBtn').html('تفاصيل حركة البيع')
        });

        //$('#showProfitsPreBtn').show();
        //setTimeout(() => $('#containerLoader').fadeOut(), 2000)

      });

  };

  toggleStockProfits(stock) {

    let btnVal = $('#showProfitsPreBtn').html()

    if (btnVal == 'تفاصيل حركة البيع') {
      this.showStockProfitsPre(stock);
      $('#showProfitsPreBtn').html('تفاصيل ارباح الاصناف')
    } else {
      $('#showProfitsPreBtn').html('تفاصيل حركة البيع')
      $('#productProfits').show();
      $('#customersProfits').hide();
    }

  }

  showStockProfitsPre(stock) {

    let match_fromDate = this.dateSortFrom + 'T00:00';
    let match_toDate = this.dateSortTo + 'T23:59';

    let filterdArr = []

    if (!this.filtered) {
      filterdArr = this._stockService.HandleAddtoStockPrimArry.filter(h => h.transactionType == 2 && h.stockId == stock.stockId)
    } else {
      filterdArr = this._stockService.HandleAddtoStockPrimArry
        .filter(h => (h.transactionType == 2 && h.stockId == stock.stockId) && h.date_time < match_toDate && h.date_time > match_fromDate)
    };

    console.log(this.filtered)

    //let stockProds = this.profitArr.filter(prod => prod.productId) //this._stockService.handleBackEnd.filter(stockF => stockF.stockId == stock.stockId)

    this.profitArrCust = []

    for (let i = 0; i < filterdArr.length; i++) {

      let productdet = this.profitArr.find(prod => filterdArr[i].productId == prod.productId);
      let itemDate = new Date(filterdArr[i].date_time);
      let theDate = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;

      if (productdet != undefined) {

        let newObj = {
          date: theDate,
          invNumber: filterdArr[i].invNumber,
          customerName: filterdArr[i].customerName,
          productName: filterdArr[i].productName,
          Qty: filterdArr[i].Qty,
          productCost: productdet.in.avr,
          price: filterdArr[i].price,
          unitProfit: Math.ceil(filterdArr[i].price - productdet.in.avr),
          color: '',
          totalProfit: Math.ceil((filterdArr[i].price - productdet.in.avr) * filterdArr[i].Qty),
          colorTotal: ''
        };

        (newObj.unitProfit < 0) ? newObj.color = 'bg-danger text-white' : newObj.color = 'bg-success text-white';
        (newObj.totalProfit < 0) ? newObj.colorTotal = 'bg-danger text-white' : newObj.colorTotal = 'text-dark';

        this.profitArrCust.push(newObj);
      };
    };
    $('#customersProfits').show();
    $('#productProfits').hide();
    $('#searchProd').hide();
    //$('#showProfitsPreBtn').hide();

  };

  sortBtnsEffect = (diactive:string, active:string) => {
    $(`${active}`).attr({'disabled': true});
    $(`${diactive}`).not(`${active}`).attr({'disabled': false});
    //$(`${diactive}`).not(`${active}`).removeClass('darkBg');
    //$(`${active}`).addClass('darkBg');
  }

  profitFilter = (cond: string) => {
    //percForSort

    if (cond == 'top') {
      this.profitArr.sort(this._service.sortArry('profitForSort', 'desc'));
      this.sortBtnsEffect('.sortBtns','#sortTop');
    } else if (cond == 'less') {
      this.profitArr.sort(this._service.sortArry('profitForSort'));
      this.sortBtnsEffect('.sortBtns','#sortLess');
    } else if (cond == 'perc') {
      //let percForSort = 
      this.profitArr.sort(this._service.sortArry('percForSort', 'desc'));
      this.sortBtnsEffect('.sortBtns','#sortPers');
    }
  };

} // end
