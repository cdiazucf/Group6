<?php
    // Script to return page of contacts to front end based from offset provided.
    // Alternative to querying the database for all contacts at once.
    
    header('Content-type: application/json; charset=UTF-8');

    // retrieve json payload as JSON object
    $loginData = json_decode(file_get_contents('php://input'), true);
    $numContactsPerPage = 10;

    // Create connection to database
    $connection = new mysqli("localhost", "montyspy_camilo", "phpSucks", "montyspy_cotrt");

    if ($connection->connection_error)
    {
        returnEmptyPayload($connection->connection_error);
        http_response_code(500);
        exit();
    }

    // Select contacts from page based on 
    $queryStatement = "SELECT * FROM Contacts WHERE UserID=" . $loginData["ID"] . " ORDER BY Firstname LIMIT " . ($loginData["pageNum"] * $numContactsPerPage) . ";";
    $queryResult = $connection->query($queryStatement);

    // IF the query failed
    if ($queryResult == false)
    {
        $connection->close();
        http_response_code(400);
        returnEmptyPayload("Bad Request");
        exit();
    }
    
    // Process the returned data
    $allContacts = $queryResult->fetch_all();
    $selectedContacts = array();
    $numSelectedContacts = 0;
    
    for ($i = (($loginData["pageNum"] - 1) * ($numContactsPerPage)); $i < ($loginData["pageNum"] * $numContactsPerPage); $i++)
    {
        // break on first null occurrence
        if ($allContacts[$i] == null)
        {
            break;
        }
        
        array_push($selectedContacts, $allContacts[$i]);
        $numSelectedContacts++;
    }
    
    $connection->close();
    returnJsonPayload($selectedContacts, $numSelectedContacts);
    http_response_code(200);
    exit();

    /*
    *   returnJsonPayload()
    *
    *   Packages the returned contacts, if any, into JSON package and returns
    *   them to front-end.
    */
    function returnJsonPayload($contacts, $numRows)
    {
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