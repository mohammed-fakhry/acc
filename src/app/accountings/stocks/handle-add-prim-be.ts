export class HandleAddPrimBE {
    stockTransactionId: number; // the main table id
    stockTransactionDetailsId: number; // the forign table id
    productId: number; // frm products table
    productName: string; // frm products table
    customerName:string;
    stockId:number; // frm stocks table
    transactionType: number; // frm the Main table
    price: number; // forign table
    Qty: number; // forign table
    notes:string; // frm the Main table
}
