<?php
require 'connect.php';
$workerRule = [];
$sql = "SELECT * FROM workerrule";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;
    while ($row = mysqli_fetch_assoc($result)) {
        $workerRule[$cr]['workerRuleId'] = $row['workerRuleId'];
        $workerRule[$cr]['authOverTime'] = $row['authOverTime'];
        $workerRule[$cr]['authDelayTime'] = $row['authDelayTime'];
        $workerRule[$cr]['halfDayDisc'] = $row['halfDayDisc'];
        $workerRule[$cr]['allDayDisc'] = $row['allDayDisc'];
        $workerRule[$cr]['outEarlyTime'] = $row['outEarlyTime'];
        $workerRule[$cr]['salarytimeKind'] = $row['salarytimeKind'];
        $cr++;
    }

    echo json_encode($workerRule);
} else {
    http_response_code(404);
}

?>