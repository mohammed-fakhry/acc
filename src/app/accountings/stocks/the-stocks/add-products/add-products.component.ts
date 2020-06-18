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
  addProductFormVaild: boolean;

  constructor(public _stockService: StocksService, public formBuilder: FormBuilder,
    public _service: ServicesService, public _theStockComp: TheStocksComponent) { }

  ngOnInit() {

    this.productData = new FormGroup({
      productId: new FormControl(),
      productName: new FormControl(),
    });

    if (this._theStockComp.productNameVaild = true) {
      this.addProductFormVaild = true;
    }
    ////console.log(this._stockService.productDataView.productName)
  }

  isProductNameVaild() { // validation
    ////console.log(this._stockService.productDataView.productName)
    const getProductName = this._stockService.allProducts.find(product => product.productName === this._stockService.productDataView.productName);
    if (this._stockService.productDataView.productName != '') {
      if (getProductName != undefined) {
        this._theStockComp.productNameVaild = true;
        this.addProductFormVaild = true;
        this.productNameAlert = "لا يمكن تكرار نفس الصنف"
        $('#productName').removeClass('is-valid').addClass('is-invalid')
      } else {
        this._theStockComp.productNameVaild = false;
        this.addProductFormVaild = false;
        $('#productName').addClass('is-valid').removeClass('is-invalid')
      }
    } else {
      this.productNameAlert = 'يجب ادخال اسم الصنف';
      this._theStockComp.productNameVaild = true;
      this.addProductFormVaild = true;
      $('#productName').removeClass('is-valid').addClass('is-invalid')
    }
    //console.log(getProductName)
  }

  addNewProduct() {
    this._stockService.creatProduct(this.productData.value).subscribe();
    this._service.clearForm();
    this._theStockComp.ngOnInit();
    //this._theStockComp.makeProductNameArr();
    this._theStockComp.getAllProducts.then((data) => {
      $('#productName').removeClass('is-valid is-invalid');
      $('#productNameAlert').hide();
      this.addProductFormVaild = true;
    })

    ////console.log(this._stockService.allProducts);
  }

}
