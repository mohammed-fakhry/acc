import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchCustomer'
})
export class SearchCustomerPipe implements PipeTransform {

  transform(customers: any, text: string): any {
    if (text == undefined) {
      return customers
    }
    return customers.filter(function(customer) {
      return customer.customerName.includes(text);
    })
  }

}
