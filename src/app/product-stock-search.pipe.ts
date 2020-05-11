import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productStockSearch'
})
export class ProductStockSearchPipe implements PipeTransform {

  transform(products: any, text: string): any {
    if (text == undefined) {
      return products
    }
    return products.filter(function (product) {
      return product.productName.includes(text)
    });
  }

}
