<?php
    // File: login.php
    // Script to login a user based on credentials collected from a JSON payload
    
    header('Content-type: application/json; charset=UTF-8');

    // retrieve json payload as JSON object
    $rawInput = file_get_contents('php://input');
    $loginData = json_decode($rawInput, true);

    // Create connection to database
    $connection = new mysqli("localhost", "montyspy_camilo", "phpSucks", "montyspy_cotrt");
    
    if ($connection->connection_error)
    {
        returnEmptyPayload("Failed to connect to database");
        http_response_code(500);
        exit($connection->connection_error);
    }
    
    $queryStatement = "SELECT ID, Firstname, Lastname FROM Users where Username='" . $loginData["username"] . "' and Password= '" . $loginData["password"] . "';";
    $queryData = $connection->query($queryStatement);
    
    if ($queryData->num_rows < 1)
    {
        returnEmptyPayload("User does not exist in database");
        $connection->close();
        http_response_code(400);
        exit();
    }
    
    $data = $queryData->fetch_assoc();
    
    // Update dateLastLoggedIn field in database
    $updateResult = $queryStatement = "UPDATE Users SET DateLastLoggedIn='" . date_format(date(), "Y-m-d") . "' WHERE ID=" . $data["ID"] . ";";
    
    if ($updateResult == false)
    {
        returnJsonPayload($data["ID"], $data["Username"], $data["Firstname"], $data["Lastname"], $data["DateCreated"], date_format(date(), "Y-m-d"), "Failed to update DateLastLoggedIn in database");
    }
    else
    {
        returnJsonPayload($data["ID"], $data["Username"], $data["Firstname"], $data["Lastname"], $data["DateCreated"], date_format(date(), "Y-m-d"), "");
    }
    
    $connection->close();
    http_response_code(200);
    exit();
    
    
    /*
    *   returnJsonPayload()
    *
    *   Returns JSON package to Front-end
    */
    function returnJsonPayload($id, $username, $firstname, $lastname, $dateCreated, $dateLastLoggedIn, $error)
    {
        $payload = array("ID" => $id, "Username" => $username, "Firstname" => $firstname, "Lastname" => $lastname, "DateCreated" => $dateCreated, "DateLastLoggedIn" => $dateLastLoggedIn, "Error" => $error);
        echo json_encode($payload);
    }
    
    /*
    *   returnEmptyPayload()
    *
    *   Return an empty JSON package to front-end when query returns no data
    */
    function returnEmptyPayload($error)
    {
        returnJsonPayload(-1, "", "", "", "", "", $error);
    }
?>