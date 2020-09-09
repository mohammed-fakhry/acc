<?php

require 'backupClass.php';
$path = "E:/OneDrive/backup/";
$backup = new Backup();
$backup-> setDataBase('accounting');
$backup->setHost("localhost");
$backup->setUserName("root");
$backup->setPassword("");
$backup->setPath($path);
$backup->backUp();

$fileName = $backup->generateFileName();
$respon = array($path, $fileName);
echo json_encode($respon);

?>