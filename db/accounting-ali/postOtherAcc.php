<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $AccName = mysqli_real_escape_string($con, trim($request -> AccName));
    $currentAccVal = mysqli_real_escape_string($con, trim($request -> currentAccVal));

    // store
    $sql = "INSERT INTO otheraccounts (
        AccName,
        currentAccVal
    ) VALUES
        ('{$accId}',
        '{$AccName}',
        '{$currentAccVal}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>