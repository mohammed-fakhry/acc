import { Component, OnInit } from '@angular/core';
import { TheStocksComponent } from '../the-stocks.component';
import { ServicesService } from 'src/app/services.service';
import { StocksService } from '../stocks.service';
import { CustomerService } from 'src/app/customer.service';
import { FormBuilder } from '@angular/forms';
import { from } from 'rxjs';

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
      }
    }
  }

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
    }
  }

  showProductReport() {

    let stockNameForProdRep = $('#stockNameForProdRep').val();

    if (stockNameForProdRep == undefined) {
      this.stockNameVaild = true;
      $('#stockNameForProdRep').addClass('is-invalid')
      $('#prodDetTable').hide();
      this.prodRepFormInvaild = true;
    } else {
      this.stockNameVaild = false;
      $('#prodDetTable').show();
      ////console.log(this._stockService.HandleAddtoStockPrimArry)
      this.filteredProducts = [];
      this.filteredProducts = this._stockService.HandleAddtoStockPrimArry.filter((product) => {
        return product.productName === this.productInpt;
      });

      for (let i = 0; i < this.filteredProducts.length; i++) {
        for (let s = 0; s < this._stockService.stocks.length; s++) {
          if (this._stockService.stocks[s].stockId == this.filteredProducts[i].sndStockId) {
            this.filteredProducts[i].sndStockName = this._stockService.stocks[s].stockName;
            break
          }
        }
      }

      this.filteredProducts = this.filteredProducts.filter((stock) => {
        return stock.stockName == stockNameForProdRep || stock.sndStockName == stockNameForProdRep
      })

      for (let i = 0; i < this.filteredProducts.length; i++) {

        if (this.filteredProducts[i].transactionType == 1) {
          this.filteredProducts[i].transactionName = 'فاتورة شراء'
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
      //console.log('invaildDate')
    } else {
      this.filteredProducts = this.filteredProducts.filter((date) => {
        return date.theDate > fromDate && date.theDate < toDate
      })
    }

  }

}
