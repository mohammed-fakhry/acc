<?php
require 'connect.php';
$towerData = [];
$sql = "SELECT * FROM towers";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $towerData[$cr]['towerId'] = $row['towerId'];
        $towerData[$cr]['towerName'] = $row['towerName'];
        $towerData[$cr]['towerStage'] = $row['towerStage'];
        $cr++;
    }

    echo json_encode($towerData);
} else {
    http_response_code(404);
}

?>