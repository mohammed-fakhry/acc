<?php
require 'connect.php';
$unitData = [];
$sql = "SELECT * FROM unitData";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $unitData[$cr]['unitId'] = $row['unitId'];
        $unitData[$cr]['unitNum'] = $row['unitNum'];
        $unitData[$cr]['apartNum'] = (int)$row['apartNum'];
        $unitData[$cr]['towerId'] = $row['towerId'];
        $unitData[$cr]['towerStage'] = $row['towerStage'];
        $unitData[$cr]['towerName'] = $row['towerName'];
        $unitData[$cr]['unitExtent'] = (float)$row['unitExtent'];
        $unitData[$cr]['unitPrice'] = (float)$row['unitPrice'];
        $unitData[$cr]['unitCompany'] = $row['unitCompany'];
        $unitData[$cr]['unitDate'] = $row['unitDate'];
        $unitData[$cr]['unitFloar'] = (int)$row['unitFloar'];
        $unitData[$cr]['clientId'] = $row['clientId'];
        $unitData[$cr]['clientName'] = $row['clientName'];
        $cr++;
    }

    echo json_encode($unitData);
} else {
    http_response_code(404);
}

?>