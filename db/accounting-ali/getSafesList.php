<?php
require 'connect.php';
$safeData = [];
$sql = "SELECT * FROM safes WHERE safeId <> 1";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $safeData[$cr]['safeId'] = $row['safeId'];
        $safeData[$cr]['safeName'] = $row['safeName'];
        $safeData[$cr]['workerId'] = $row['workerId'];
        $safeData[$cr]['safeEmployee'] = $row['safeEmployee'];
        $safeData[$cr]['opendVal'] = (int)$row['opendVal'];
        $safeData[$cr]['currentSafeVal'] = (int)$row['currentSafeVal'];
        $cr++;
    }

    echo json_encode($safeData);
} else {
    http_response_code(404);
}

?>