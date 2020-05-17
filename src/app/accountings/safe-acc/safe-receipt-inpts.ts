export class SafeReceiptInpts {
    safeReceiptId: number;
    receiptKind: string;
    date_time: string;
    //fst safe inpts
    safeName: string;
    currentSafeVal: number;
    // sec section
    transactionAccKind: string;
    // acc inpts
    AccName: string;
    currentAccVal: number;
    //safe inpts
    secSafeName: string;
    current_SecSafeVal: number;
    // customer inpts
    customerId: number;
    customerName: string;
    currentCustomerVal: number;
    // user inpts
    receiptVal: number;
    recieptNote: string;
}