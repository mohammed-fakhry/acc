<?php
require 'connect.php';
$otheAccData = [];
$sql = "SELECT * FROM otheraccounts";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $otheAccData[$cr]['accId'] = $row['accId'];
        $otheAccData[$cr]['AccName'] = $row['AccName'];
        $otheAccData[$cr]['currentAccVal'] = (int)$row['currentAccVal'];
        $cr++;
    }

    echo json_encode($otheAccData);
} else {
    http_response_code(404);
}

?>