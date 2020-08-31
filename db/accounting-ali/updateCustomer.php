<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;

if (isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);
    // echo $request;
    $customerName = mysqli_real_escape_string($con, trim($request -> customerName));
    $customerTell = mysqli_real_escape_string($con, trim($request -> customerTell));
    $customerUnit = mysqli_real_escape_string($con, trim($request -> customerUnit));
    $customerPaid = mysqli_real_escape_string($con, trim($request -> customerPaid));
    $customerRemain = mysqli_real_escape_string($con, trim($request -> customerRemain));
    $customerAdd = mysqli_real_escape_string($con, trim($request -> customerAdd));
    $customerDateIN = mysqli_real_escape_string($con, trim($request -> customerDateIN));
    //update
    $sql = "UPDATE `customers` SET
    `customerName` = '$customerName',
    `customerTell` = '$customerTell',
    `customerUnit` = '$customerUnit',
    `customerPaid` = '$customerPaid',
    `customerRemain` = '$customerRemain',
    `customerAdd` = '$customerAdd',
    `customerDateIN` = '$customerDateIN'
    WHERE `customerId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>