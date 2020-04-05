export class CustomerInvArry {
    customerName:string;
    customerId:number;
    notes:string;
    customerInvDetail:[{
        stockTransactionId:number;
        transactionType:number;
        invoiceTotal:number;
    }];
}
