<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $safeName = mysqli_real_escape_string($con, trim($request -> safeName));
    $workerId = mysqli_real_escape_string($con, trim($request -> workerId));
    $safeEmployee = mysqli_real_escape_string($con, trim($request -> safeEmployee));
    $opendVal = mysqli_real_escape_string($con, trim($request -> opendVal));
    $currentSafeVal = mysqli_real_escape_string($con, trim($request -> currentSafeVal));

    //update
    $sql = "UPDATE `safes` SET
     `safeName` = '$safeName',
      `workerId` = '$workerId',
       `safeEmployee` = '$safeEmployee',
       `opendVal` = '$opendVal',
       `currentSafeVal` = '$currentSafeVal'
         WHERE `safeId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>