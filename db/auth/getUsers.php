<?php
require 'connect.php';
$users = [];
$sql = "SELECT * FROM users";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $users[$cr]['id'] = $row['id'];
        $users[$cr]['name'] = $row['name'];
        $users[$cr]['auth'] = $row['auth'];
        $users[$cr]['prem'] = (int)$row['prem'];
        $users[$cr]['workers'] = (int)$row['workers'];
        $users[$cr]['clients'] = (int)$row['clients'];
        $users[$cr]['unites'] = (int)$row['unites'];
        $users[$cr]['stockes'] = (int)$row['stockes'];
        $users[$cr]['safes'] = (int)$row['safes'];
        $users[$cr]['customers'] = (int)$row['customers'];
        $users[$cr]['edi'] = (int)$row['edi'];
        $users[$cr]['del'] = (int)$row['del'];
        $cr++;
    }

    echo json_encode($users);
} else {
    http_response_code(404);
}

?>