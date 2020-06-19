import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProdProfit'
})
export class SearchProdProfitPipe implements PipeTransform {

  transform(products: any, text: string): any {
    if (text == undefined) {
      return products
    };
    return products.filter(product => product.name.includes(text))
  };

};
