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
    
    if (strcmp($loginData["firstname"], "") != 0 and strcmp($loginData["lastname"], "") != 0)
    {
        $queryStatement = "SELECT * FROM Contacts WHERE UserID=" . $loginData["userID"] . " AND (Firstname LIKE '%" . $loginData["firstname"] . "%' AND Lastname LIKE '%" . $loginData["lastname"] . "%') ORDER BY Firstname;";
    }
    else if (strcmp($loginData["firstname"], "") != 0)
    {
        $queryStatement = "SELECT * FROM Contacts WHERE UserID=" . $loginData["userID"] . " AND Firstname LIKE '%" . $loginData["firstname"] . "%' ORDER BY Firstname;";
    }
    else if (strcmp($loginData["lastname"], "") != 0)
    {
        $queryStatement = "SELECT * FROM Contacts WHERE UserID=" . $loginData["userID"] . " AND  Lastname LIKE '%" . $loginData["lastname"] . "%' ORDER BY Firstname;";
    }
    else
    {
        $queryStatement = "SELECT * FROM Contacts ORDER BY Firstname;";
    }
    $queryResult = $connection->query($queryStatement);
    
    // IF query failed
    if ($queryResult == false)
    {
        returnEmptyPayload("Search query failed.");
        $connection->close();
        http_response_code(400);
        exit();
    }
    
    returnJsonPayload($queryResult, $queryResult->num_rows);
    
    $connection->close();
    http_response_code(200);
    exit();
    
    
    /*
    *   returnJsonPayload()
    *
    *   Packages the returned contacts, if any, into JSON package and returns
    *   them to front-end.
    */
    function returnJsonPayload($data, $numRows)
    {
        // $contacts = $data->fetch_assoc();
        
        $contacts = $data->fetch_all();
        
        $payload = array('NumRows' => $numRows, 'Contacts' => $contacts, 'Error' => '');
        echo json_encode($payload);
    }
    
    /*
    *   returnEmptyPayload()
    *
    *   Return an empty JSON package to front-end when query returns no data
    */
    function returnEmptyPayload($error)
    {
        $payload = array('NumRows' => 0, 'Contacts' => array(), 'Error' => $error);
        echo json_encode($payload);
    }

?>