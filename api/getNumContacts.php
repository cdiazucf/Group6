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

    $queryStatement = "SELECT COUNT(ID) FROM Contacts WHERE UserID=" . $loginData["ID"] . ";";
    $queryResult = $connection->query($queryStatement);
    
    if ($queryResult == false)
    {
        returnEmptyPayload("Query Failed");
        http_response_code(400);
        $connection->close();
        exit();
    }
    
    $data = $queryResult->fetch_assoc();
    
    returnJsonPayload($data["COUNT(ID)"], "");
    $connection->close();
    http_response_code(200);
    exit();
    
    
    
    /*
    *   returnJsonPayload()
    *
    *   Packages the number of contacts owned by the user, if any,
    *   into JSON package and returns them to front-end.
    */
    function returnJsonPayload($count, $error)
    {
        $payload = array("Count" => $count, 'Error' => '');
        echo json_encode($payload);
    }
    
    /*
    *   returnEmptyPayload()
    *
    *   Return an empty JSON package to front-end when query returns no data
    */
    function returnEmptyPayload($error)
    {
        returnJsonPayload(0, $error);
    }

?>