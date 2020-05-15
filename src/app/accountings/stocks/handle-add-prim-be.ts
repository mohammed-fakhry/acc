export class HandleAddPrimBE {
    stockTransactionId: number; // the main table id
    invNumber:number;
    stockTransactionDetailsId: number; // the forign table id
    productId: number; // frm products table
    productName: string; // frm products table
    customerName:string;
    stockName: string;
    customerId:number;
    stockId:number; // frm stocks table
    sndStockId: number;
    transactionType: number; // frm the Main table
    price: number; // forign table
    Qty: number; // forign table
    invoiceTotal:number;
    date_time: string;
    notes:string; // frm the Main table
}