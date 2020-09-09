<?php

class Backup {

    protected $path;
    protected $username;
    protected $password;
    protected $database;
    protected $host;

    public function setHost($host) {
        $this->host = $host;
    }

    public function setUserName($username) {
        $this->username = $username;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public function setDataBase($database) {
        $this->database = $database;
    }

    // generatea file name from date
    public function generateFileName() {
        return date("d-M-Y-H-i-s") . ".sql";
    }


    public function __constract() {

    }

    public function setPath($path) {
        $this->path = $path;
    }

    // backup method
    public function backUp() {
        $command = "C:/xampp/mysql/bin";
        $command.="/mysqldump --user=$this->username ";
        $command.= "--password=$this->password ";
        $command.= "$this->database --result-file=$this->path";
        $command.= $this->generateFileName();
        //echo $command;
        

        exec($command, $output);
        //var_dump($output);
    }
}

?>