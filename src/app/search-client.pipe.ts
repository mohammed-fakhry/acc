import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchClient'
})
export class SearchClientPipe implements PipeTransform {

  transform(clients: any, text: string): any {
    if (text == undefined) {
      return clients
    }
    return clients.filter((client) => client.clientName.includes(text))
  }

}
