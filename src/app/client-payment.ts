export class ClientPayment {
    paymentId: number;
    PaymentKind: string;
    date_time: string;
    //cashIN
    cashInKind: string;
    //safe
    safeId: number;
    safeName: string;
    currentSafeVal: number;
    //bank
    bankId: number;
    bankName: string;
    currentbankVal: number;
    //Client
    clientId: number;
    clientName: string;
    currentClientVal: number;
    //unit
    unitId: number;
    unitName: string;
    //val
    paymentVal: number;
    paymentNote: string;
}