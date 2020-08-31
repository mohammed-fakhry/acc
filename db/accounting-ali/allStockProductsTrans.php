<?php
require 'connect.php';
$invoiceData = [];

$sql = "SELECT invNumber, productName, products.productId, stockTransactiondetails.stockTransactionId, transactionType,
        price, Qty, stocks.stockId, stocktransaction.sndStockId, stocks.stockName

        FROM stockTransaction join stockTransactiondetails
        on stockTransaction.stockTransactionId = stockTransactiondetails.stockTransactionId
        join stocks on stocks.stockId = stockTransaction.stockId
        join products on products.productId = stockTransactiondetails.productId";

if ($result = mysqli_query($con, $sql)) {
    
    $cr2 =0;
    while ($row = mysqli_fetch_assoc($result)) {
        $invoiceData[$cr2]['invNumber'] = $row['invNumber'];        
        $invoiceData[$cr2]['productName'] = $row['productName'];
        $invoiceData[$cr2]['productId'] = $row['productId'];
        $invoiceData[$cr2]['stockTransactionId'] = $row['stockTransactionId'];
        $invoiceData[$cr2]['transactionType'] = $row['transactionType'];
        $invoiceData[$cr2]['price'] =  (int)$row['price'];
        $invoiceData[$cr2]['Qty'] = (int)$row['Qty'];
        $invoiceData[$cr2]['stockId'] = $row['stockId'];
        $invoiceData[$cr2]['sndStockId'] = $row['sndStockId'];
        $invoiceData[$cr2]['stockName'] = $row['stockName'];
        $cr2++;
    }
    
    echo json_encode($invoiceData);
} else {
    http_response_code(404);
}

?>