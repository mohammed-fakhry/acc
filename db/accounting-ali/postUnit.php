<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $unitNum = mysqli_real_escape_string($con, trim($request -> unitNum));
    $towerId = mysqli_real_escape_string($con, trim($request -> towerId));
    $towerStage = mysqli_real_escape_string($con, trim($request -> towerStage));
    $unitExtent = mysqli_real_escape_string($con, trim($request -> unitExtent));
    $unitPrice = mysqli_real_escape_string($con, trim($request -> unitPrice));
    $unitCompany = mysqli_real_escape_string($con, trim($request -> unitCompany));
    $unitDate = mysqli_real_escape_string($con, trim($request -> unitDate));
    $unitFloar = mysqli_real_escape_string($con, trim($request -> unitFloar));

    // store
    $sql = "INSERT INTO unitData ( 
        unitNum,
        towerId,
        towerStage,
        unitExtent,
        unitPrice,
        unitCompany,
        unitDate,
        unitFloar
    ) VALUES
        ('{$unitNum}',
        '{$towerId}',
        '{$towerStage}',
        '{$unitExtent}',
        '{$unitPrice}',
        '{$unitCompany}',
        '{$unitFloar}',
        '{$unitDate}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>