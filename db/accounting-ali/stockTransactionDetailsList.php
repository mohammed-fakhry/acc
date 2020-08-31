<?php
require 'connect.php';
$stocktransDetail = [];
$sql = "SELECT * FROM stockTransactionDetails";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $stocktransDetail[$cr]['stockTransactionId'] = $row['stockTransactionId'];
        $stocktransDetail[$cr]['productId'] = $row['productId'];
        $stocktransDetail[$cr]['price'] = (float)$row['price'];
        $stocktransDetail[$cr]['Qty'] = $row['Qty'];
        $cr++;
    }

    echo json_encode($stocktransDetail);
} else {
    http_response_code(404);
}

?>