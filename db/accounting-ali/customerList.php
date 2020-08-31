<?php
require 'connect.php';
$customers = [];
$sql = "SELECT * FROM customers WHERE customerId <> 1";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $customers[$cr]['customerId'] = $row['customerId'];
        $customers[$cr]['customerName'] = $row['customerName'];
        $customers[$cr]['customerTell'] = $row['customerTell'];
        $customers[$cr]['customerUnit'] = $row['customerUnit'];
        $customers[$cr]['customerPaid'] = (int)$row['customerPaid'];
        $customers[$cr]['customerRemain'] = (int)$row['customerRemain'];
        $customers[$cr]['customerAdd'] = $row['customerAdd'];
        $customers[$cr]['customerDateIN'] = $row['customerDateIN'];
        $cr++;
    }

    echo json_encode($customers);
} else {
    http_response_code(404);
}

?>