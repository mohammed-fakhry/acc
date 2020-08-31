<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $productName = mysqli_real_escape_string($con, trim($request -> productName));
    
    // store
    $sql = "INSERT INTO products ( 
        productName
    ) VALUES
        ('{$productName}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>