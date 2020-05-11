import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { ServicesService } from 'src/app/services.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TheStocksComponent } from '../the-stocks.component';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  
  productData: FormGroup;
  productNameAlert: string;

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.productData = new FormGroup({
      productId: new FormControl(),
      productName: new FormControl(),
    });



    if (this._stockService.productDataView.productName == undefined) {
      this._theStockComp.productNameVaild = true;
    }
    console.log(this._stockService.productDataView.productName)
  }

  isProductNameVaild() { // validation
    console.log(this._stockService.productDataView.productName)
    if (this._stockService.productDataView.productName != '') {
      //this._theStockComp.productNameVaild = true;
      if(this._theStockComp.productNameArr.includes(this._stockService.productDataView.productName)) {
        this._theStockComp.productNameVaild = true;
        this.productNameAlert = "لا يمكن تكرار نفس الصنف"
        $('#productName').removeClass('is-valid').addClass('is-invalid')
      } else {
        this._theStockComp.productNameVaild = false;
        $('#productName').addClass('is-valid').removeClass('is-invalid')
      }
      /*for(let i = 0; i < this._stockService.allProducts.length; i++) {
        if (this._stockService.productDataView.productName == this._stockService.allProducts[i].productName) {
          this._theStockComp.productNameVaild = true;
          this.productNameAlert = "لا يمكن تكرار نفس الصنف"
          break;
        }
      }*/
    } else {
      this.productNameAlert = 'يجب ادخال اسم الصنف';
      this._theStockComp.productNameVaild = true;
      $('#productName').removeClass('is-valid').addClass('is-invalid')
    }
    

    console.log(this._theStockComp.productNameVaild)
    console.log(this._stockService.allProducts)
  }

  addNewProduct() {
    this._stockService.creatProduct(this.productData.value)
    .subscribe();
    this._service.clearForm();
    location.reload();
    //console.log(this.productData.value);
  }

}
