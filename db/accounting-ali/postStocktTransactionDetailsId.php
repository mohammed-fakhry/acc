<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $stockTransactionId = mysqli_real_escape_string($con, trim($request -> stockTransactionId));
    $productId = mysqli_real_escape_string($con, trim($request -> productId));
    $price = mysqli_real_escape_string($con, trim($request -> price));
    $Qty = mysqli_real_escape_string($con, trim($request -> Qty));

    // store
    $sql = "INSERT INTO stocktransactiondetails (
        stockTransactionId,
        productId,
        price,
        Qty
    ) VALUES
        ('{$stockTransactionId}',
        '{$productId}',
        '{$price}',
        '{$Qty}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }
}

?>