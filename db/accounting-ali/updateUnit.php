<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $towerId = mysqli_real_escape_string($con, trim($request -> towerId));
    $unitNum = mysqli_real_escape_string($con, trim($request -> unitNum));
    $apartNum = mysqli_real_escape_string($con, trim($request -> apartNum));
    $towerStage = mysqli_real_escape_string($con, trim($request -> towerStage));
    $towerName = mysqli_real_escape_string($con, trim($request -> towerName));
    $unitExtent = mysqli_real_escape_string($con, trim($request -> unitExtent));
    $unitPrice = mysqli_real_escape_string($con, trim($request -> unitPrice));
    $towerId = mysqli_real_escape_string($con, trim($request -> towerId));
    $unitDate = mysqli_real_escape_string($con, trim($request -> unitDate));
    $unitFloar = mysqli_real_escape_string($con, trim($request -> unitFloar));
    $clientId = mysqli_real_escape_string($con, trim($request -> clientId));
    $clientName = mysqli_real_escape_string($con, trim($request -> clientName));



    //update
    $sql = "UPDATE `unitData` SET
     `towerId` = '$towerId',
      `unitNum` = '$unitNum',
      `apartNum` = '$apartNum',
      `towerStage` = '$towerStage',
      `towerName` = '$towerName',
      `unitExtent` = '$unitExtent',
      `unitPrice` = '$unitPrice',
        `towerId` = '$towerId',
        `unitDate` = '$unitDate',
        `unitFloar` = '$unitFloar',
        `clientId` = '$clientId',
        `clientName` = '$clientName'
        WHERE `unitId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>