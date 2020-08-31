export class ContractInpts {
    contractId: number;
    // client
    clientName: string; // input **
    clientNationNum: string; // result **
    clientAdress: string // result
    clientTell: string // resul
    // unit
    towerinfo: string; // input **
    unitNumber: string; // input **
    // price
    unitPrice: number; // result ***
    unitExtent: number; // result ***
    unitTotalPrice: number; // result ***
    // payMethod
    prepaidPerc: number; // input **
    prepaidCash: number; // result **
    //
    remainTimeLong: number; // input **
    remainCash: number; // result ***
    // if there are checks
    checkQtys: number; // input **
    checksValue: number; // result **
    // date
    dateBegain: string;
    dateEnd: string;
    // note
    contractNote: string;
}
