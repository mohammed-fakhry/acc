<?php
require 'connect.php';
$safeReceiptData = [];
$sql = "SELECT * FROM safereceipt";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $safeReceiptData[$cr]['safeReceiptId'] = $row['safeReceiptId'];
        $safeReceiptData[$cr]['receiptKind'] = $row['receiptKind'];
        $safeReceiptData[$cr]['date_time'] = $row['date_time'];
        //fst safe inpts
        $safeReceiptData[$cr]['safeName'] = $row['safeName'];
        $safeReceiptData[$cr]['safeId'] = $row['safeId'];
        $safeReceiptData[$cr]['currentSafeVal'] = (int)$row['currentSafeVal'];
        // sec section
        $safeReceiptData[$cr]['transactionAccKind'] = $row['transactionAccKind'];
        // acc inpts
        $safeReceiptData[$cr]['AccName'] = $row['AccName'];
        $safeReceiptData[$cr]['currentAccVal'] = (int)$row['currentAccVal'];
        //snd safe inpts
        $safeReceiptData[$cr]['secSafeName'] = $row['secSafeName'];
        $safeReceiptData[$cr]['secSafeId'] = $row['secSafeId'];
        $safeReceiptData[$cr]['current_SecSafeVal'] = (int)$row['current_SecSafeVal'];
        // customer inpts
        $safeReceiptData[$cr]['customerId'] = $row['customerId'];
        $safeReceiptData[$cr]['customerName'] = $row['customerName'];
        $safeReceiptData[$cr]['currentCustomerVal'] = (int)$row['currentCustomerVal'];
        // user inpts
        $safeReceiptData[$cr]['receiptVal'] = (int)$row['receiptVal'];
        $safeReceiptData[$cr]['recieptNote'] = $row['recieptNote'];
        $cr++;
    }

    echo json_encode($safeReceiptData);
} else {
    http_response_code(404);
}

?>