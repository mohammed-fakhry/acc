<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $receiptKind = mysqli_real_escape_string($con, trim($request -> receiptKind));
    $date_time = mysqli_real_escape_string($con, trim($request -> date_time));
    $safeName = mysqli_real_escape_string($con, trim($request -> safeName));
    $safeId = mysqli_real_escape_string($con, trim($request -> safeId));
    $currentSafeVal = mysqli_real_escape_string($con, trim($request -> currentSafeVal));
    $transactionAccKind = mysqli_real_escape_string($con, trim($request -> transactionAccKind));
    $AccName = mysqli_real_escape_string($con, trim($request -> AccName));
    $currentAccVal = mysqli_real_escape_string($con, trim($request -> currentAccVal));
    $secSafeName = mysqli_real_escape_string($con, trim($request -> secSafeName));
    $secSafeId = mysqli_real_escape_string($con, trim($request -> secSafeId));
    $current_SecSafeVal = mysqli_real_escape_string($con, trim($request -> current_SecSafeVal));
    $customerId = mysqli_real_escape_string($con, trim($request -> customerId));
    $customerName = mysqli_real_escape_string($con, trim($request -> customerName));
    $currentCustomerVal = mysqli_real_escape_string($con, trim($request -> currentCustomerVal));
    $receiptVal = mysqli_real_escape_string($con, trim($request -> receiptVal));
    $recieptNote = mysqli_real_escape_string($con, trim($request -> recieptNote));

    //update
    $sql = "UPDATE `safereceipt` SET
     `receiptKind` = '$receiptKind',
      `date_time` = '$date_time',
       `safeName` = '$safeName',
       `safeId` = '$safeId',
       `currentSafeVal` = '$currentSafeVal',
       `transactionAccKind` = '$transactionAccKind',
       `AccName` = '$AccName',
       `currentAccVal` = '$currentAccVal',
       `secSafeName` = '$secSafeName',
       `secSafeId` = '$secSafeId',
       `current_SecSafeVal` = '$current_SecSafeVal',
       `customerId` = '$customerId',
       `customerName` = '$customerName',
       `currentCustomerVal` = '$currentCustomerVal',
       `receiptVal` = '$receiptVal',
       `recieptNote` = '$recieptNote'
         WHERE `safeReceiptId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>