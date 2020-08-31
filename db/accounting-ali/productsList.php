<?php
require 'connect.php';
$productData = [];
$sql = "SELECT * FROM products";

if ($result = mysqli_query($con, $sql)) {
    
    $cr2 =0;
    while ($row = mysqli_fetch_assoc($result)) {
        $productData[$cr2]['productId'] = $row['productId'];
        $productData[$cr2]['productName'] = $row['productName'];
        $cr2++;
    }
    
    echo json_encode($productData);
} else {
    http_response_code(404);
}

?>