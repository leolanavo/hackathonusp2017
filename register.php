<?php
class MyDB extends SQLite3 {
    function __construct() {
        $this->open('database.db');
    }
}
$db = new MyDB();
if(!$db)
    exit(-1);

$name = $_POST["name"];
$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];
$password = $_POST["password_c"];
$passhash = password_hash($password, PASSWORD_DEFAULT);
$sql =
    "SELECT id FROM users WHERE passhash='".$passhash."' AND (username='".$username."') OR (mail='".$username."')";

$ret = $db->exec($sql);
if(!$ret){
    echo $db->lastErrorMsg();
} else {
    echo "Table created successfully\n";
}
$db->close();
?>
