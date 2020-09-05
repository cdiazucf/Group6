<?php
    // File: registerUser.php
    // Script to register a user in the database
    
    header('Content-type: application/json; charset=UTF-8');
    
    // retrieve json payload
    $input = json_decode(file_get_contents('php://input'), true);
    
    // create connection to database
    $connection = new mysqli('localhost', 'montyspy_jon', 'phpSucks', 'montyspy_cotrt');
    
    // exit if connection unsuccessful
    if ($connection->connection_error)
    {
        exit($connection->connection_error);
    }
    
    // query database to ensure username is not already in the system
    $queryStatement = "SELECT Username from Users where Username='" . $input["Username"] . "';";
    $query = $connection->query($queryStatement);
    
    // If username already exists in the system
    if ($query->num_rows > 0)
    {
        returnEmptyPayload();
        $connection->close();
        exit();
    }
    
    // TODO: create user record
    
    
    
    /*
    *   returnEmptyPayload()
    *
    *   Return empty JSON object
    */
    function returnEmptyPayload()
    {
        $payload = array("ID" => -1, "Username" => "", "Firstname" => "", "Lastname" => "", "DateCreated" => "", "DateLastLoggedIn" => "");
        echo json_encode($payload);
    }
?>