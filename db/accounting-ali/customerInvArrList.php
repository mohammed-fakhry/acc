<?php
require 'connect.php';
$invoiceData = [];

$sql = "SELECT invNumber, invoiceTotal, stockTransaction.date_time, stockTransaction.notes,
         productName, stockTransactiondetails.stockTransactionId, transactionType,
          price, Qty, customers.customerId, customers.customerName
           FROM stockTransaction join stockTransactiondetails
            on stockTransaction.stockTransactionId = stockTransactiondetails.stockTransactionId
             join stocks on stocks.stockId = stockTransaction.stockId
              join products on products.productId = stockTransactiondetails.productId
               join customers
                on customers.customerId = stockTransaction.customerId && stocktransaction.customerId != 1";

if ($result = mysqli_query($con, $sql)) {
    
    $cr2 =0;
    while ($row = mysqli_fetch_assoc($result)) {
        $invoiceData[$cr2]['invNumber'] = $row['invNumber'];
        $invoiceData[$cr2]['invoiceTotal'] = (int)$row['invoiceTotal'];
        $invoiceData[$cr2]['date_time'] = $row['date_time'];
        $invoiceData[$cr2]['productName'] = $row['productName'];
        $invoiceData[$cr2]['stockTransactionId'] = $row['stockTransactionId'];
        $invoiceData[$cr2]['transactionType'] = $row['transactionType'];
        $invoiceData[$cr2]['price'] =  (int)$row['price'];
        $invoiceData[$cr2]['Qty'] = (int)$row['Qty'];
        $invoiceData[$cr2]['notes'] = $row['notes'];
        $invoiceData[$cr2]['customerId'] = $row['customerId'];
        $invoiceData[$cr2]['customerName'] = $row['customerName'];
        $cr2++;
    }
    
    echo json_encode($invoiceData);
} else {
    http_response_code(404);
}

?>