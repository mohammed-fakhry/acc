import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(workers: any, text: string): any {
    if (text == undefined) {
      return workers
    };
    return workers.filter(function (worker) {
      return worker.workerName.includes(text)
        || worker.workerJop.includes(text)
        || worker.workerTell.includes(text)
        || worker.workerAdd.includes(text)
        || worker.workerFbCode.includes(text)
    });
  };
};