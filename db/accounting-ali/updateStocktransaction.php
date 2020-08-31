<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $stockId = mysqli_real_escape_string($con, trim($request -> stockId));
    $sndStockId = mysqli_real_escape_string($con, trim($request -> sndStockId));
    $customerId = mysqli_real_escape_string($con, trim($request -> customerId));
    $invoiceTotal = mysqli_real_escape_string($con, trim($request -> invoiceTotal));
    $date_time = mysqli_real_escape_string($con, trim($request -> date_time));
    $notes = mysqli_real_escape_string($con, trim($request -> notes));
    //update
    $sql = "UPDATE `stocktransaction` SET
     `stockId` = '$stockId',
     `sndStockId` = '$sndStockId',
      `customerId` = '$customerId',
      `invoiceTotal` = '$invoiceTotal',
      `date_time` = '$date_time',
      `notes` = '$notes'
        WHERE `stockTransactionId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>