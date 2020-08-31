<?php
require 'connect.php';
$productData = [];
$sql = "SELECT * FROM stockpridge join products
        on products.productId = stockpridge.productId
        join stocks
        on stocks.stockId = stockpridge.stockId";

if ($result = mysqli_query($con, $sql)) {
    
    $cr2 =0;
    while ($row = mysqli_fetch_assoc($result)) {
        $productData[$cr2]['stockName'] = $row['stockName'];
        $productData[$cr2]['stockId'] = $row['stockId'];
        //$productData[$cr2]['sndStockId'] = $row['sndStockId'];
        $productData[$cr2]['productName'] = $row['productName'];
        $productData[$cr2]['productId'] = $row['productId'];
        $productData[$cr2]['stockProductId'] = $row['stockProductId'];
        $productData[$cr2]['productQty'] =  (int)$row['productQty'];
        $productData[$cr2]['productCost'] = (int)$row['productCost'];
        $productData[$cr2]['productPrice'] = (int)$row['productPrice'];      
        $cr2++;
    }
    
    echo json_encode($productData);
} else {
    http_response_code(404);
}

?>