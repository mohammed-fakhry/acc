<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $productId = mysqli_real_escape_string($con, trim($request -> productId));
    $price = mysqli_real_escape_string($con, trim($request -> price));
    $Qty = mysqli_real_escape_string($con, trim($request -> Qty));

    //update
    $sql = "UPDATE `stocktransactiondetails` SET
     `productId` = '$productId',
      `price` = '$price',
      `Qty` = '$Qty'
        WHERE `stockTransactionDetailsId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>