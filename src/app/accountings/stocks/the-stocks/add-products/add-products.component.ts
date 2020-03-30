import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { ServicesService } from 'src/app/services.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  
  productData: FormGroup;

  constructor(private _stockService: StocksService, private formBuilder: FormBuilder,
    private _service: ServicesService) { }

  ngOnInit() {

    this.productData = new FormGroup({
      productId: new FormControl(),
      productName: new FormControl(),
    });

  }

  addNewProduct() {
    this._stockService.creatProduct(this.productData.value)
    .subscribe();
    this._service.clearForm();
    location.reload();
    //console.log(this.productData.value);
  }

}
