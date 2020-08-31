<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $clientName = mysqli_real_escape_string($con, trim($request -> clientName));
    $clientTell = mysqli_real_escape_string($con, trim($request -> clientTell));
    $clientAddress = mysqli_real_escape_string($con, trim($request -> clientAddress));
    $clientNationNum = mysqli_real_escape_string($con, trim($request -> clientNationNum));

    // store
    $sql = "INSERT INTO clients (
        clientName,
        clientTell,
        clientAddress,
        clientNationNum
    ) VALUES
        ('{$clientName}',
        '{$clientTell}',
        '{$clientAddress}',
        '{$clientNationNum}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    };

};

?>