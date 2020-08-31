<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $stockTransactionId = mysqli_real_escape_string($con, trim($request -> stockTransactionId));
    $invNumber = mysqli_real_escape_string($con, trim($request -> invNumber));
    $stockId = mysqli_real_escape_string($con, trim($request -> stockId));
    $sndStockId = mysqli_real_escape_string($con, trim($request -> sndStockId));
    $customerId = mysqli_real_escape_string($con, trim($request -> customerId));
    $transactionType = mysqli_real_escape_string($con, trim($request -> transactionType));
    $invoiceTotal = mysqli_real_escape_string($con, trim($request -> invoiceTotal));
    $date_time = mysqli_real_escape_string($con, trim($request -> date_time));
    $notes = mysqli_real_escape_string($con, trim($request -> notes));
    // store
    $sql = "INSERT INTO stocktransaction (
        stockTransactionId,
        invNumber,
        stockId,
        sndStockId,
        customerId,
        transactionType,
        invoiceTotal,
        date_time,
        notes
    ) VALUES
        ('{$stockTransactionId}',
        '{$invNumber}',
        '{$stockId}',
        '{$sndStockId}',
        '{$customerId}',
        '{$transactionType}',
        '{$invoiceTotal}',
        '{$date_time}',
        '{$notes}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }
}

?>