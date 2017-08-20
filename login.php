<?php
class MyDB extends SQLite3 {
    function __construct() {
        $this->open('database.db');
    }
}
$db = new MyDB();
if(!$db)
    exit(-1);

if(is_null($_POST["name"]))
    exit(-1);

$username = $_POST["username"];
$password = $_POST["password"];
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
