export class ContractData {
   contractId: number;
   // unit and client information
   clientId: number;
   unitId: number;
   towerId: number;
   // price
   prepaidCash: number;
   remainCash: number;
   // if there are checks
   checkValue: number;
   checksQty: number;
}
