<?php
require 'connect.php';

$postdata = file_get_contents("php://input");
echo 'ok';
if ( isset($postdata) && !empty($postdata)) {

    $request = json_decode($postdata);

    // snitize
    $name = mysqli_real_escape_string($con, trim($request -> name));
    $auth = mysqli_real_escape_string($con, trim($request -> auth));
    $prem = mysqli_real_escape_string($con, trim($request -> prem));
    $workers = mysqli_real_escape_string($con, trim($request -> workers));
    $clients = mysqli_real_escape_string($con, trim($request -> clients));
    $unites = mysqli_real_escape_string($con, trim($request -> unites));
    $stockes = mysqli_real_escape_string($con, trim($request -> stockes));
    $safes = mysqli_real_escape_string($con, trim($request -> safes));
    $customers = mysqli_real_escape_string($con, trim($request -> customers));
    $edi = mysqli_real_escape_string($con, trim($request -> edi));
    $del = mysqli_real_escape_string($con, trim($request -> del));

    // store
    $sql = "INSERT INTO users (
        name,
        auth,
        prem,
        workers,
        clients,
        unites,
        stockes,
        safes,
        customers,
        edi,
        del
    ) VALUES
        ('{$name}',
        '{$auth}',
        '{$prem}',
        '{$workers}',
        '{$clients}',
        '{$unites}',
        '{$stockes}',
        '{$safes}',
        '{$customers}',
        '{$edi}',
        '{$del}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);
    }

}

?>