<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $stockName = mysqli_real_escape_string($con, trim($request -> stockName));
    $stockPlace = mysqli_real_escape_string($con, trim($request -> stockPlace));
    $stockEmployee = mysqli_real_escape_string($con, trim($request -> stockEmployee));

    // store
    $sql = "INSERT INTO stocks (
        stockName,
        stockPlace,
        stockEmployee
    ) VALUES
        ('{$stockName}',
        '{$stockPlace}',
        '{$stockEmployee}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>