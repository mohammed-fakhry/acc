<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $stockId = mysqli_real_escape_string($con, trim($request -> stockId));
    $productId = mysqli_real_escape_string($con, trim($request -> productId));
    $productQty = mysqli_real_escape_string($con, trim($request -> productQty));
    $productCost = mysqli_real_escape_string($con, trim($request -> productCost));
    $productPrice = mysqli_real_escape_string($con, trim($request -> productPrice));


    // store
    $sql = "INSERT INTO stockpridge (
        stockId,
        productId,
        productQty,
        productCost,
        productPrice
    ) VALUES
        ('{$stockId}',
        '{$productId}',
        '{$productQty}',
        '{$productCost}',
        '{$productPrice}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>