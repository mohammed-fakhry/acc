<?php
require 'connect.php';
$workers = [];
$sql = "SELECT * FROM employes";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $workers[$cr]['workerId'] = $row['workerId'];
        $workers[$cr]['workerName'] = $row['workerName'];
        $workers[$cr]['workerTell'] = $row['workerTell'];
        $workers[$cr]['workerAdd'] = $row['workerAdd'];
        $workers[$cr]['workerJopCateg'] = $row['workerJopCateg'];
        $workers[$cr]['workerJop'] = $row['workerJop'];
        $workers[$cr]['workerFbCode'] = $row['workerFbCode'];
        $workers[$cr]['workerJopDate'] = $row['workerJopDate'];
        $workers[$cr]['workerSalary'] = $row['workerSalary'];
        $workers[$cr]['workerYearVacation'] = $row['workerYearVacation'];
        $workers[$cr]['workerCheckIN'] = $row['workerCheckIN'];
        $workers[$cr]['workerCheckOut'] = $row['workerCheckOut'];
        $cr++;
    }

    echo json_encode($workers);
} else {
    http_response_code(404);
}

?>