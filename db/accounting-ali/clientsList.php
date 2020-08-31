<?php
require 'connect.php';
$clientsData = [];
$sql = "SELECT * FROM clients";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $clientsData[$cr]['clientId'] = $row['clientId'];
        $clientsData[$cr]['clientName'] = $row['clientName'];
        $clientsData[$cr]['clientTell'] = $row['clientTell'];
        $clientsData[$cr]['clientAddress'] = $row['clientAddress'];
        $clientsData[$cr]['clientNationNum'] = $row['clientNationNum'];
        $cr++;
    }

    echo json_encode($clientsData);
} else {
    http_response_code(404);
}

?>