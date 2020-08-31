<?php
require 'connect.php';
$users = [];
$sql = "SELECT * FROM users";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $users[$cr]['userId'] = $row['userId'];
        $users[$cr]['userName'] = $row['userName'];
        $users[$cr]['userPassword'] = $row['userPassword'];
        $cr++;
    }

    echo json_encode($users);
} else {
    http_response_code(404);
}

?>