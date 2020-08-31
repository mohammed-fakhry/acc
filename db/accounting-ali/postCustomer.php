<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $customerName = mysqli_real_escape_string($con, trim($request -> customerName));
    $customerTell = mysqli_real_escape_string($con, trim($request -> customerTell));
    $customerUnit = mysqli_real_escape_string($con, trim($request -> customerUnit));
    $customerPaid = mysqli_real_escape_string($con, trim($request -> customerPaid));
    $customerRemain = mysqli_real_escape_string($con, trim($request -> customerRemain));
    $customerAdd = mysqli_real_escape_string($con, trim($request -> customerAdd));
    $customerDateIN = mysqli_real_escape_string($con, trim($request -> customerDateIN));

    // store
    $sql = "INSERT INTO customers (
        customerName,
        customerTell,
        customerUnit,
        customerPaid,
        customerRemain,
        customerAdd,
        customerDateIN
    ) VALUES
        ('{$customerName}',
        '{$customerTell}',
        '{$customerUnit}',
        '{$customerPaid}',
        '{$customerRemain}',
        '{$customerAdd}',
        '{$customerDateIN}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>