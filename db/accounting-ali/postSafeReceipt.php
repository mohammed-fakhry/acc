<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);
    // snitize
    $receiptKind = mysqli_real_escape_string($con, trim($request -> receiptKind));
    $date_time = mysqli_real_escape_string($con, trim($request -> date_time));
    //fst safe inpts
    $safeName = mysqli_real_escape_string($con, trim($request -> safeName));
    $safeId = mysqli_real_escape_string($con, trim($request -> safeId));
    $currentSafeVal = mysqli_real_escape_string($con, trim($request -> currentSafeVal));
    // sec section
    $transactionAccKind = mysqli_real_escape_string($con, trim($request -> transactionAccKind));
    // acc inpts
    $AccName = mysqli_real_escape_string($con, trim($request -> AccName));
    $currentAccVal = mysqli_real_escape_string($con, trim($request -> currentAccVal));
    //safe inpts
    $secSafeName = mysqli_real_escape_string($con, trim($request -> secSafeName));
    $secSafeId = mysqli_real_escape_string($con, trim($request -> secSafeId));
    $current_SecSafeVal = mysqli_real_escape_string($con, trim($request -> current_SecSafeVal));
    // customer inpts
    $customerId = mysqli_real_escape_string($con, trim($request -> customerId));
    $customerName = mysqli_real_escape_string($con, trim($request -> customerName));    
    $currentCustomerVal = mysqli_real_escape_string($con, trim($request -> currentCustomerVal));
    // user inpts
    $receiptVal = mysqli_real_escape_string($con, trim($request -> receiptVal));
    $recieptNote = mysqli_real_escape_string($con, trim($request -> recieptNote));

    // store
    $sql = "INSERT INTO safereceipt (
        receiptKind,
        date_time,
        safeName,
        safeId,
        currentSafeVal,
        transactionAccKind,
        AccName,
        currentAccVal,
        secSafeName,
        secSafeId,
        current_SecSafeVal,
        customerId,
        customerName,
        currentCustomerVal,
        receiptVal,
        recieptNote
    ) VALUES
        ('{$receiptKind}',
        '{$date_time}',
        '{$safeName}',
        '{$safeId}',
        '{$currentSafeVal}',
        '{$transactionAccKind}',
        '{$AccName}',
        '{$currentAccVal}',
        '{$secSafeName}',
        '{$secSafeId}',
        '{$current_SecSafeVal}',
        '{$customerId}',
        '{$customerName}',
        '{$currentCustomerVal}',
        '{$receiptVal}',
        '{$recieptNote}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>