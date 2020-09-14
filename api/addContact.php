<?php

    // File: addContact.php
    // Adds user contact to the database
    
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
    
    // add contact to database
    $queryStatement = "INSERT INTO Contacts (UserID, Firstname, Lastname, Address, Email, Phone) " .
                      "VALUES ('" . $loginData["userID"] . "', '" . $loginData["firstname"] . "', '" .
                      $loginData["lastname"] . "', '" . $loginData["address"] . "', '" .
                      $loginData["email"] . "', '" . $loginData["phone"] . "');";
    $query = $connection->query($queryStatement);
    
    // IF query failed
    if ($query == false)
    {
        $connection->close();
        http_response_code(400);
        returnEmptyPayload("Failed to add contact to database.");
        exit();
    }
    
    returnJsonPayload(true, "");
    
    $connection->close();
    http_response_code(200);
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