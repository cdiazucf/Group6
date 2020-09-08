<?php
    // File: registerUser.php
    // Script to register a user in the database
    
    header('Content-type: application/json; charset=UTF-8');
    
    // retrieve json payload
    $input = json_decode(file_get_contents('php://input'), true);
    
    // create connection to database
    $connection = new mysqli('localhost', 'montyspy_camilo', 'phpSucks', 'montyspy_cotrt');
    
    // exit if connection unsuccessful
    if ($connection->connection_error)
    {
        http_response_code(500);
        returnEmptyPayload("Failed to connect to SQL server");
        exit($connection->connection_error);
    }
    
    // query database to ensure username is not already in the system
    $queryStatement = "SELECT Username from Users where Username='" . $input["username"] . "';";
    $query = $connection->query($queryStatement);
    
    // If username already exists in the system
    if ($query->num_rows > 0)
    {
        http_response_code(400);
        returnEmptyPayload("Username already exists in system");
        $connection->close();
        exit();
    }
    
    // string representing current date to be used in query
    $currentDateString = date_format(date_create(), "Y-m-d");
    
    // Insert user into database
    $queryStatement = "INSERT INTO Users (Firstname, Lastname, Username, Password, DateCreated, DateLastLoggedIn) " .
                      "VALUES ('" . $input["firstname"] . "', '" . $input["lastname"] . "', '" . $input["username"] .
                      "', '" . $input["password"] . "', '" . $currentDateString . "', '" . $currentDateString . "');";
    $query = $connection->query($queryStatement);
    
    // check if insertion query was successful
    if ($query == false)
    {
        returnEmptyPayload("Failed to insert user into database");
        http_response_code(400);
        $connection->close();
        exit();
    }
    
    // query database for record just created to return user data to front-end
    $queryStatement = "SELECT * FROM Users WHERE Username='" . $input["username"] . "';";
    $query = $connection.query($queryStatement);
    
    // convert query result into associative array
    $data = $query->fetch_assoc();
    
    returnJsonPayload($data["ID"], $data["Username"], $data["Firstname"], $data["Lastname"], $data["DateCreated"], $data["DateLastLoggedIn"], "");
    $connection->close();
    exit();
    
    
    /*
    *   returnJsonPayload()
    *   
    *   Returns JSON payload with data passed to function
    */
    function returnJsonPayload($id, $username, $firstname, $lastname, $dateCreated, $dateLastLoggedIn, $error)
    {
        $payload = array("ID" => $id, "Username" => $username, "Firstname" => $firstname, "Lastname" => $lastname, "DateCreated" => $dateCreated, "DateLastLoggedIn" => $dateLastLoggedIn, "Error" => $error);
        echo json_encode($payload);
    }
    
    /*
    *   returnEmptyPayload()
    *
    *   Return empty JSON object
    */
    function returnEmptyPayload($error)
    {
        returnJsonPayload(-1, "", "", "", "", "", $error);
    }
?>