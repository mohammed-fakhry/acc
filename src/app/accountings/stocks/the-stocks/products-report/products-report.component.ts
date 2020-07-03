import { Component, OnInit } from '@angular/core';
import { TheStocksComponent } from '../the-stocks.component';
import { ServicesService } from 'src/app/services.service';
import { StocksService } from '../stocks.service';
import { CustomerService } from 'src/app/customer.service';
import { FormBuilder } from '@angular/forms';
import { from } from 'rxjs';
import { HandleAddPrimBE } from '../../handle-add-prim-be';
import { Stock } from 'src/app/accountings/stock';

@Component({
  selector: 'app-products-report',
  templateUrl: './products-report.component.html',
  styleUrls: ['./products-report.component.scss']
})
export class ProductsReportComponent implements OnInit {

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _custService: CustomerService, public _theStockComp: TheStocksComponent) { }

  productInpt: string;
  filteredProducts: any[];
  prodRepFormInvaild: boolean = true;

  ngOnInit() {

  }

  productNameVaild: boolean;
  stockNameVaild: boolean;

  isProductNameVaild() {
    $('#prodDetTable').hide();
    this.productInpt = $('#productInpt').val();
    for (let i = 0; i < this._stockService.allProducts.length; i++) {
      if (this.productInpt == this._stockService.allProducts[i].productName) {
        this.prodRepFormInvaild = false;
        this.productNameVaild = false;
        break;
      } else {
        this.prodRepFormInvaild = true;
        this.productNameVaild = true;
      };
    };
  };

  isStockNameValid() {
    $('#prodDetTable').hide();
    let stockNameForProdRep = $('#stockNameForProdRep').val();
    if (stockNameForProdRep == undefined) {
      this.stockNameVaild = true;
      $('#stockNameForProdRep').addClass('is-invalid')
      $('#prodDetTable').hide();
    } else if (stockNameForProdRep != undefined && this.productNameVaild == false) {
      this.stockNameVaild = false;
      this.prodRepFormInvaild = false;
      $('#stockNameForProdRep').removeClass('is-invalid')
    } else {
      this.stockNameVaild = false;
      $('#stockNameForProdRep').removeClass('is-invalid')
    };
  };

  stockNameInp: string;

  showProductReportPre() {

    let stockNameForProdRep = $('#stockNameForProdRep').val(); //

    if (stockNameForProdRep == undefined) {
      this.stockNameVaild = true;
      $('#stockNameForProdRep').addClass('is-invalid')
      $('#prodDetTable').hide();
      this.prodRepFormInvaild = true;
    } else {
      this.stockNameVaild = false;
      $('#prodDetTable').show();
      this.filteredProducts = [];
      this.filteredProducts = this._stockService.HandleAddtoStockPrimArry.filter((product) => {
        return product.productName === this.productInpt;
      });

      for (let i = 0; i < this.filteredProducts.length; i++) {
        for (let s = 0; s < this._stockService.stocks.length; s++) {
          if (this._stockService.stocks[s].stockId == this.filteredProducts[i].sndStockId) {
            this.filteredProducts[i].sndStockName = this._stockService.stocks[s].stockName;
            break
          };
        };
      };

      this.filteredProducts = this.filteredProducts.filter((stock) => {
        return stock.stockName == stockNameForProdRep || stock.sndStockName == stockNameForProdRep
      });

      for (let i = 0; i < this.filteredProducts.length; i++) {

        if (this.filteredProducts[i].transactionType == 1) {
          this.filteredProducts[i].transactionName = 'فاتورة شراء';
          this.filteredProducts[i].color = 'text-dark';
          this.filteredProducts[i].minQty = 0;
          this.filteredProducts[i].addQty = this.filteredProducts[i].Qty;
          let date = new Date(this.filteredProducts[i].date_time)
          let theDate = date.getTime() // date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(); //
          this.filteredProducts[i].theDate = theDate;

        } else if (this.filteredProducts[i].transactionType == 2) {
          this.filteredProducts[i].transactionName = 'فاتورة بيع'
          this.filteredProducts[i].color = 'text-danger';
          this.filteredProducts[i].minQty = this.filteredProducts[i].Qty;
          this.filteredProducts[i].addQty = 0;
          let date = new Date(this.filteredProducts[i].date_time)
          let theDate = date.getTime()
          this.filteredProducts[i].theDate = theDate;

        } else if (this.filteredProducts[i].transactionType == 3) {

          if (this.filteredProducts[i].stockName == stockNameForProdRep) {
            this.filteredProducts[i].minQty = this.filteredProducts[i].Qty;
            this.filteredProducts[i].addQty = 0;
            this.filteredProducts[i].transactionName = 'اذن نقل (خصم)'
            this.filteredProducts[i].color = 'text-danger';
          } else if (this.filteredProducts[i].sndStockName == stockNameForProdRep) {
            this.filteredProducts[i].minQty = 0;
            this.filteredProducts[i].addQty = this.filteredProducts[i].Qty;
            this.filteredProducts[i].transactionName = 'اذن نقل (اضافة)'
            this.filteredProducts[i].color = 'text-dark';
          }
          let date = new Date(this.filteredProducts[i].date_time)
          let theDate = date.getTime()
          this.filteredProducts[i].theDate = theDate;
        }

      }

      // singers.sort(compareValues('born', 'desc'));
      this.filteredProducts.sort(this._service.sortArry('theDate'))

      for (let i = 0; i < this.filteredProducts.length; i++) {
        if (this.filteredProducts[i - 1] == undefined) {
          this.filteredProducts[i].netQty = this.filteredProducts[i].addQty - this.filteredProducts[i].minQty;
        } else {
          this.filteredProducts[i].netQty = this.filteredProducts[i - 1].netQty + this.filteredProducts[i].addQty - this.filteredProducts[i].minQty;
        }
      }

    }

    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();

    fromDate = fromDate + 'T00:00'
    toDate = toDate + 'T23:59'

    fromDate = new Date(fromDate)
    toDate = new Date(toDate)
    fromDate.getTime();
    toDate.getTime();

    if (fromDate == 'Invalid Date' || toDate == 'Invalid Date') {
    } else {
      this.filteredProducts = this.filteredProducts.filter((date) => {
        return date.theDate > fromDate && date.theDate < toDate
      })
    };

  };

  showProductReport() {

    //$('#containerLoader').fadeIn();

    const getHandle = new Promise((res, rej) => {
      this._stockService.getHandleAddtoStockPrimList().subscribe((data: HandleAddPrimBE[]) => {
        this._stockService.HandleAddtoStockPrimArry = data;
        res('getHandle')
      });
    })

    const theMetod = () => {

      this.filteredProducts = [];

      if (this.productInpt == undefined) {

        this.stockNameVaild = true;
        $('#stockNameForProdRep').addClass('is-invalid')
        $('#prodDetTable').hide();
        this.prodRepFormInvaild = true;

        //rej('productInpt is undefined')
      } else {

        let mainArry: HandleAddPrimBE[] = [];
        let theStockInfo: Stock = this._stockService.stocks.find(stock => stock.stockName == this.stockNameInp);

        let theMainArry =
          this._stockService.HandleAddtoStockPrimArry.filter((product) => {
            return product.productName === this.productInpt;
          })

        mainArry = theMainArry.filter(product => product.stockId == theStockInfo.stockId || product.sndStockId == theStockInfo.stockId);

        for (let i = 0; i < mainArry.length; i++) {

          let d = new Date(mainArry[i].date_time);
          let timeCond = '';
          let hour = d.getHours();
          let hourStr = '';
          let minutes = d.getMinutes();
          let minutesStr = '';
          
          //(d.getHours() > 12) ? timeCond = 'Pm' : timeCond = 'Am';
          if (d.getHours() > 12) {
            timeCond = 'Pm'
            hour = d.getHours() - 12
            if (hour < 10) {
              hourStr = `0${hour.toString()}`
            } else {
              hourStr = `${hour.toString()}`
            }
            
          } else {
            timeCond = 'Am'
            if (hour < 10) {
              hourStr = `0${hour.toString()}`
            } else {
              hourStr = `${hour.toString()}`
            }
          }

          if (d.getMinutes() < 10) {
            minutesStr = `0${minutes.toString()}`
          } else {
            minutesStr = `${minutes.toString()}`
          }

          let theObj = {
            date_time: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}` + ' | ' + `${hourStr}:${minutesStr}${timeCond}`,//  + `${timeCond}`,
            invNumber: mainArry[i].invNumber,
            price: mainArry[i].price,
            customerName: mainArry[i].customerName,
            transactionName: '',
            color: '',
            minQty: 0,
            addQty: 0,
            netQty: 0,
            netColor: 'darkBg',
            theDate: d.getTime(),
            note: mainArry[i].notes,
          };

          if (mainArry[i].transactionType == 1) {

            theObj.transactionName = 'فاتورة شراء';
            theObj.color = 'text-dark';
            theObj.minQty = 0;
            theObj.addQty = mainArry[i].Qty;

          } else if (mainArry[i].transactionType == 2) {

            theObj.transactionName = 'فاتورة بيع'
            theObj.color = 'text-danger';
            theObj.minQty = mainArry[i].Qty;
            theObj.addQty = 0;

          } else if (mainArry[i].transactionType == 3) {

            if (mainArry[i].stockId == theStockInfo.stockId) {

              let sndStockInfo = this._stockService.stocks.find(stock => stock.stockId == mainArry[i].sndStockId)

              theObj.customerName = sndStockInfo.stockName;
              theObj.transactionName = 'اذن نقل (خصم)'
              theObj.color = 'text-danger';
              theObj.minQty = mainArry[i].Qty;
              theObj.addQty = 0;

            } else if (mainArry[i].sndStockId == theStockInfo.stockId) {
              theObj.customerName = theStockInfo.stockName;
              theObj.transactionName = 'اذن نقل (اضافة)';
              theObj.color = 'text-dark';
              theObj.minQty = 0;
              theObj.addQty = mainArry[i].Qty;

            };

          };

          this.filteredProducts.push(theObj)
        };

        this.filteredProducts.sort(this._service.sortArry('theDate'))

        for (let f = 0; f < this.filteredProducts.length; f++) {

          if (f == 0) {
            this.filteredProducts[f].netQty = this.filteredProducts[f].addQty - this.filteredProducts[f].minQty;
          } else {
            this.filteredProducts[f].netQty = this.filteredProducts[f - 1].netQty + this.filteredProducts[f].addQty - this.filteredProducts[f].minQty;
          }

          if (this.filteredProducts[f].netQty < 0) {this.filteredProducts[f].netColor = 'bg-danger'}

        };

        let fromDate = $('#fromDate').val();
        let toDate = $('#toDate').val();

        fromDate = fromDate + 'T00:00'
        toDate = toDate + 'T23:59'

        fromDate = new Date(fromDate)
        toDate = new Date(toDate)
        fromDate.getTime();
        toDate.getTime();

        if (fromDate == 'Invalid Date' || toDate == 'Invalid Date') {
        } else {
          this.filteredProducts = this.filteredProducts.filter((date) => {
            return date.theDate > fromDate && date.theDate < toDate
          });
        };

      }; // else'

      return Promise.resolve(this.filteredProducts)

    }

    getHandle.then(theMetod).then(() => {

      $('#prodDetTable').show();
      
    });

  }

}
