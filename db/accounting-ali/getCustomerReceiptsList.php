<?php
require 'connect.php';
$customersReceipts = [];

/*SELECT * FROM stockTransaction join stockTransactiondetails
        on stockTransaction.stockTransactionId = stockTransactiondetails.stockTransactionId
        join stocks
        on stocks.stockId = stockTransaction.stockId
        join products
        on products.productId = stockTransactiondetails.productId
        join customers
        on customers.customerId = stockTransaction.customerId*/

$sql = "SELECT safeReceiptId, receiptKind, date_time, safeName,
         customerName, customerId, receiptVal, recieptNote, safeId
          FROM safereceipt
           WHERE customerId <> 1 ";

if ($result = mysqli_query($con, $sql)) {
    
    $cr2 =0;
    while ($row = mysqli_fetch_assoc($result)) {
        $customersReceipts[$cr2]['safeReceiptId'] = $row['safeReceiptId'];
        $customersReceipts[$cr2]['receiptKind'] = $row['receiptKind'];
        $customersReceipts[$cr2]['date_time'] = $row['date_time'];
        $customersReceipts[$cr2]['safeName'] = $row['safeName'];
        $customersReceipts[$cr2]['safeId'] = $row['safeId'];
        $customersReceipts[$cr2]['customerName'] = $row['customerName'];
        $customersReceipts[$cr2]['customerId'] = $row['customerId'];
        $customersReceipts[$cr2]['receiptVal'] = (int)$row['receiptVal'];
        $customersReceipts[$cr2]['recieptNote'] = $row['recieptNote'];
        $cr2++;
    }
    
    echo json_encode($customersReceipts);
} else {
    http_response_code(404);
}

?>