<?php

require 'connect.php';
echo "ok";

$postdata = file_get_contents("php://input");
    $id = $_GET['id'];
    echo $id;
if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
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

    //update
    $sql = "UPDATE `users` SET
        `name` = '$name',
        `auth` = '$auth',
        `prem` = '$prem',
        `workers` = '$workers',
        `clients` = '$clients',
        `unites` = '$unites',
        `stockes` = '$stockes',
        `safes` = '$safes',
        `customers` = '$customers',
        `edi` = '$edi',
        `del` = '$del'
    WHERE `id` = '{$id}' LIMIT 1 ";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        return http_response_code(422);
    }
}

?>