<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
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

    // store
    $sql = "INSERT INTO employes (
        workerName,   
        workerTell,
        workerAdd,
        workerJopCateg,
        workerJop,
        workerFbCode,
        workerJopDate,
        workerSalary,
        workerYearVacation,
        workerCheckIN,
        workerCheckOut
    ) VALUES
        ('{$workerName}',
        '{$workerTell}',
        '{$workerAdd}',
        '{$workerJopCateg}',
        '{$workerJop}',
        '{$workerFbCode}',
        '{$workerJopDate}',
        '{$workerSalary}',
        '{$workerYearVacation}',
        '{$workerCheckIN}',
        '{$workerCheckOut}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>