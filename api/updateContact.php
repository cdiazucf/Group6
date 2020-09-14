<?php

    header('Content-type: application/json; charset=UTF-8');

    // retrieve json payload as JSON object
    $loginData = json_decode(file_get_contents('php://input'), true);

    // Create connection to database
    $connection = new mysqli("localhost", "montyspy_camilo", "phpSucks", "montyspy_cotrt");

    if ($connection->connection_error)
    {
        returnEmptyPayload($connection->connection_error);
        http_response_code(500);
        exit();
    }
    
    $queryStatement = "UPDATE Contacts SET Firstname='" . $loginData["firstname"] .
    "', Lastname='" . $loginData["lastname"] . "', Address='" . $loginData["address"] .
    "', Email='" . $loginData["email"] . "', Phone='" . $loginData["phone"] . "' WHERE ID=" . $loginData["ID"] . ";";
    $queryResult = $connection->query($queryStatement);
    
    // IF the query failed
    if ($queryResult == false)
    {
        $connection->close();
        http_response_code(400);
        returnEmptyPayload("Failed to update contact.");
        exit();
    }
    
    $connection->close();
    http_response_code(200);
    returnJsonPayload(true, "");
    exit();
    
    
    /*
    *   returnJsonPayload()
    *
    *   Returns JSON package to Front-end
    */
    function returnJsonPayload($success, $error)
    {
        $payload = array("ID" => $success, "Error" => $error);
        echo json_encode($payload);
    }
    
    /*
    *   returnEmptyPayload()
    *
    *   Return an empty JSON package to front-end when query returns no data
    */
    function returnEmptyPayload($error)
    {
        returnJsonPayload(false, $error);
    }
?>