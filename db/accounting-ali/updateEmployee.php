<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    $workerName = mysqli_real_escape_string($con, trim($request -> workerName));
    $workerTell = mysqli_real_escape_string($con, trim($request -> workerTell));
    $workerAdd = mysqli_real_escape_string($con, trim($request -> workerAdd));
    $workerJopCateg = mysqli_real_escape_string($con, trim($request -> workerJopCateg));
    $workerJop = mysqli_real_escape_string($con, trim($request -> workerJop));
    $workerFbCode = mysqli_real_escape_string($con, trim($request -> workerFbCode));
    $workerJopDate = mysqli_real_escape_string($con, trim($request -> workerJopDate));
    $workerSalary = mysqli_real_escape_string($con, trim($request -> workerSalary));
    $workerYearVacation = mysqli_real_escape_string($con, trim($request -> workerYearVacation));
    $workerCheckIN = mysqli_real_escape_string($con, trim($request -> workerCheckIN));
    $workerCheckOut = mysqli_real_escape_string($con, $request -> workerCheckOut);
    //update
    $sql = "UPDATE `employes` SET `workerName` = '$workerName', `workerTell` = '$workerTell', `workerAdd` = '$workerAdd', `workerJopCateg` = '$workerJopCateg', `workerFbCode` = '$workerFbCode', `workerJopDate` = '$workerJopDate', `workerSalary` = '$workerSalary', `workerYearVacation` = '$workerYearVacation', `workerCheckIN` = '$workerCheckIN', `workerCheckOut` = '$workerCheckOut', `workerJop` = '$workerJop' WHERE `workerId` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>