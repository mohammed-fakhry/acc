<?php
// header("Access-Control-Allow-Origin: *");
require 'connect.php';

$id = $_GET['id'];

$sql = "DELETE FROM customers WHERE customerId = '{$id}' LIMIT 1 ";

if (mysqli_query($con, $sql)) {
    http_response_code(204);
} else {
    return http_response_code(422);
}

?>