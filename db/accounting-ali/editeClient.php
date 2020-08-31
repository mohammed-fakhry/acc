<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $clientName = mysqli_real_escape_string($con, trim($request -> clientName));
    $clientTell = mysqli_real_escape_string($con, trim($request -> clientTell));
    $clientAddress = mysqli_real_escape_string($con, trim($request -> clientAddress));
    $clientNationNum = mysqli_real_escape_string($con, trim($request -> clientNationNum));

    //update
    $sql = "UPDATE `clients` SET
     `clientName` = '$clientName',
      `clientTell` = '$clientTell',
      `clientAddress` = '$clientAddress',
       `clientNationNum` = '$clientNationNum'
         WHERE `clientId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>