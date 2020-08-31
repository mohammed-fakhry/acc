<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $AccName = mysqli_real_escape_string($con, trim($request -> AccName));
    $currentAccVal = mysqli_real_escape_string($con, trim($request -> currentAccVal));

    //update
    $sql = "UPDATE `otheraccounts` SET
     `AccName` = '$AccName',
      `currentAccVal` = '$currentAccVal'
         WHERE `accId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>