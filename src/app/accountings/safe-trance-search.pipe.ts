import { Pipe, PipeTransform } from '@angular/core';
import { SafeTransaction } from './safe-acc/safe-transaction';

@Pipe({
  name: 'safeTranceSearch'
})
export class SafeTranceSearchPipe implements PipeTransform {

  transform(safeTrance: any, text: string): any {
    if (text == undefined) {
      return safeTrance
    }
    return safeTrance.filter((safeRep) => {
      if (safeRep.transactionExplain.recieptNote !=null) {
        return safeRep.receiptKind.includes(text)
        || safeRep.transactionExplain.includes(text)
        || safeRep.recieptNote.includes(text)
      } else {
        return safeRep.receiptKind.includes(text)
        || safeRep.transactionExplain.includes(text)
      }
      
    });
  };

};
/*
  transform(workers: any, text: string): any {
    if (text == undefined) {
      return workers
    }
    return workers.filter(function (worker) {
      return worker.workerName.includes(text)
        || worker.workerJop.includes(text)
        || worker.workerTell.includes(text)
        || worker.workerAdd.includes(text)
        || worker.workerFbCode.includes(text)
    })
  }
*/
