<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $authOverTime = mysqli_real_escape_string($con, trim($request -> authOverTime));
    $authDelayTime = mysqli_real_escape_string($con, trim($request -> authDelayTime));
    $halfDayDisc = mysqli_real_escape_string($con, trim($request -> halfDayDisc));
    $allDayDisc = mysqli_real_escape_string($con, trim($request -> allDayDisc));
    $outEarlyTime = mysqli_real_escape_string($con, trim($request -> outEarlyTime));
    $salarytimeKind = mysqli_real_escape_string($con, trim($request -> salarytimeKind));
    //update
    $sql = "UPDATE `workerrule` SET
     `authOverTime` = '$authOverTime',
      `authDelayTime` = '$authDelayTime',
       `halfDayDisc` = '$halfDayDisc',
       `allDayDisc` = '$allDayDisc',
       `outEarlyTime` = '$outEarlyTime',
        `salarytimeKind` = '$salarytimeKind'
         WHERE `workerRuleId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>