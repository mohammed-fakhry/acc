<?php
require 'connect.php';
$stocksData = [];
$sql = "SELECT * FROM stocks WHERE stockId <> 1";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $stocksData[$cr]['stockId'] = $row['stockId'];
        $stocksData[$cr]['stockName'] = $row['stockName'];
        $stocksData[$cr]['stockPlace'] = $row['stockPlace'];
        $stocksData[$cr]['stockEmployee'] = $row['stockEmployee'];
        $stocksData[$cr]['stockProducts'] = $row['stockProducts'];
        $cr++;
    }

    echo json_encode($stocksData);
} else {
    http_response_code(404);
}

?>