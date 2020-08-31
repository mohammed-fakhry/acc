<?php
require 'connect.php';
$stocktrans = [];
$sql = "SELECT stockTransactionId, invNumber, stocktransaction.stockId, stocks.stockName,
        stocktransaction.sndStockId, transactionType, stocktransaction.customerId,
        invoiceTotal, customers.customerName, stocktransaction.date_time, notes FROM stockTransaction
        Join customers
        on customers.customerId = stocktransaction.customerId
        JOIN stocks
        on stocks.stockId = stocktransaction.stockId";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $stocktrans[$cr]['stockTransactionId'] = $row['stockTransactionId'];
        $stocktrans[$cr]['invNumber'] = (int)$row['invNumber'];
        $stocktrans[$cr]['stockId'] = $row['stockId'];
        $stocktrans[$cr]['stockName'] = $row['stockName'];
        $stocktrans[$cr]['sndStockId'] = $row['sndStockId'];
        $stocktrans[$cr]['customerId'] = $row['customerId'];
        $stocktrans[$cr]['customerName'] = $row['customerName'];
        $stocktrans[$cr]['transactionType'] = $row['transactionType'];
        $stocktrans[$cr]['invoiceTotal'] = $row['invoiceTotal'];
        $stocktrans[$cr]['date_time'] = $row['date_time'];
        $stocktrans[$cr]['notes'] = $row['notes'];
        $cr++;
    }

    echo json_encode($stocktrans);
} else {
    http_response_code(404);
}

?>