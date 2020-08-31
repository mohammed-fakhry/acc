<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $safeName = mysqli_real_escape_string($con, trim($request -> safeName));
    $workerId = mysqli_real_escape_string($con, trim($request -> workerId));
    $safeEmployee = mysqli_real_escape_string($con, trim($request -> safeEmployee));
    $opendVal = mysqli_real_escape_string($con, trim($request -> opendVal));
    $currentSafeVal = mysqli_real_escape_string($con, trim($request -> currentSafeVal));

    // store
    $sql = "INSERT INTO safes (
        safeName,
        workerId,
        safeEmployee,
        opendVal,
        currentSafeVal
    ) VALUES
        ('{$safeName}',
        '{$workerId}',
        '{$safeEmployee}',
        '{$opendVal}',
        '{$currentSafeVal}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>