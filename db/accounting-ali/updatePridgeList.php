<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $stockId = mysqli_real_escape_string($con, trim($request -> stockId));
    $productId = mysqli_real_escape_string($con, trim($request -> productId));
    $productCost = mysqli_real_escape_string($con, trim($request -> productCost));
    $productQty = mysqli_real_escape_string($con, trim($request -> productQty));
    $productPrice = mysqli_real_escape_string($con, trim($request -> productPrice));

    //update
    $sql = "UPDATE `stockpridge` SET
     `stockId` = '$stockId',
      `productId` = '$productId',
      `productCost` = '$productCost',
      `productQty` = '$productQty',
        `productPrice` = '$productPrice'
        WHERE `stockProductId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>