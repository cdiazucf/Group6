<?php
    // File: login.php
    // Script to login a user based on credentials collected from a JSON payload
    
    header('Content-type: application/json; charset=UTF-8');

    // retrieve json payload as JSON object
    $rawInput = file_get_contents('php://input');
    $loginData = json_decode($rawInput, true);

    // Create connection to database
    $connection = new mysqli("localhost", "montyspy_jon", "phpSucks", "montyspy_cotrt");
    
    if ($connection->connection_error)
    {
        exit($connection->connection_error);
    }
    
    $queryStatement = "SELECT ID, Firstname, Lastname FROM Users where Username='" . $loginData["username"] . "' and Password= '" . $loginData["password"] . "'";
    $queryData = $connection->query($queryStatement);
    
    if ($queryData->num_rows < 1)
    {
        returnEmptyPayload();
        $connection->close();
        exit();
    }
    
    $data = $queryData->fetch_assoc();

    // package and send the data to front-end
    echo json_encode($data);
    
    $connection->close();
    exit();
    
    
    /*
    *   returnEmptyPayload()
    *
    *   Return an empty JSON package to front-end when query returns no data
    */
    function returnEmptyPayload()
    {
        $payload = array("ID" => -1, "Username" => "", "Firstname" => "", "Lastname" => "", "DateCreated" => "", "DateLastLoggedIn" => "");
        echo json_encode($payload);
    }
?>