<?php

require 'backupClass.php';
$path = "E:/OneDrive/backupAli/";
$backup = new Backup();
$backup-> setDataBase('accountings_ali');
$backup->setHost("localhost");
$backup->setUserName("root");
$backup->setPassword("");
$backup->setPath($path);
$backup->backUp();

$fileName = $backup->generateFileName();
$respon = array($path, $fileName);
echo json_encode($respon);

?>