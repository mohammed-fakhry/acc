<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $stockName = mysqli_real_escape_string($con, trim($request -> stockName));
    $stockPlace = mysqli_real_escape_string($con, trim($request -> stockPlace));
    $stockEmployee = mysqli_real_escape_string($con, trim($request -> stockEmployee));

    //update
    $sql = "UPDATE `stocks` SET
     `stockName` = '$stockName',
      `stockPlace` = '$stockPlace',
       `stockEmployee` = '$stockEmployee'
         WHERE `stockId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>