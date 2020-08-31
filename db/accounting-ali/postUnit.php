<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $unitNum = mysqli_real_escape_string($con, trim($request -> unitNum));
    $apartNum = mysqli_real_escape_string($con, trim($request -> apartNum));
    $towerId = mysqli_real_escape_string($con, trim($request -> towerId));
    $towerStage = mysqli_real_escape_string($con, trim($request -> towerStage));
    $towerName = mysqli_real_escape_string($con, trim($request -> towerName));
    $unitExtent = mysqli_real_escape_string($con, trim($request -> unitExtent));
    $unitPrice = mysqli_real_escape_string($con, trim($request -> unitPrice));
    $unitCompany = mysqli_real_escape_string($con, trim($request -> unitCompany));
    $unitDate = mysqli_real_escape_string($con, trim($request -> unitDate));
    $unitFloar = mysqli_real_escape_string($con, trim($request -> unitFloar));
    $clientId = mysqli_real_escape_string($con, trim($request -> clientId));

    // store
    $sql = "INSERT INTO unitData ( 
        unitNum,
        apartNum,
        towerId,
        towerStage,
        towerName,
        unitExtent,
        unitPrice,
        unitCompany,
        unitDate,
        unitFloar,
        clientId
    ) VALUES
        ('{$unitNum}',
        '{$apartNum}',
        '{$towerId}',
        '{$towerStage}',
        '{$towerName}',
        '{$unitExtent}',
        '{$unitPrice}',
        '{$unitCompany}',
        '{$unitDate}',
        '{$unitFloar}',
        '{$clientId}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>