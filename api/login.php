<?php
    // File: login.php
    // Script to login a user based on credentials collected from a JSON payload

    // retrieve json payload as JSON object
    $loginData = getJsonPayload(false);

    // initialize fields to be retrieved from database
    $id = 0;
    $firstname = "";
    $lastname = "";
    $dateCreated = "";

    // Create connection to database
    $connection = new mysqli("COTRT", "montyspythons", "Hly#andGrnd3", "montyspy_cotrt");

    // handle connection errors
    if ($connection->connect_error)
    {
        returnError($connection->connect_error);
        exit("Encountered SQL connection error");
    }

    // Query the database for user information
    $query = "SELECT ID, Firstname, Lastname FROM Users where Login='" + $loginData->username + "' and Password= '" + $loginData->password + "'";

    $queryData = $connection->query($query);

    // return with error if no users were found
    if ($queryData->num_rows < 1)
    {
        returnError("User does not exist.");
    }

    // package the data into a JSON object
    $data = $queryData->fetch_assoc();
    $id = $data["ID"];
    $firstname = $data["Firstname"];
    $lastname = $data["Lastname"];
    $dateCreated = $data["DateCreated"];

    // package and send the data to front-end
    $payload = packageLoginData($id, $firstname, $lastname, $dateCreated);
    deliverJsonPayload($payload);


    /*
    *   getJsonPayload()
    *
    *   @param $arrayOption - boolean value to determine the return value of
    *                         function. If true, function will return an
    *                         associated array instead of a JSON object.
    *                         Otherwise, returns a JSON object.
    *
    *   Returns JSON payload collected from script input.
    */
    function getJsonPayload($arrayOption)
    {
        return json_decode(file_get_contents('php://input'), $arrayOption);
    }

    /*
    *   packageLoginData()
    *
    *   @param $id - User ID number
    *   @param $firstname - User firstname
    *   @param $lastname - User lastname
    *   @param $dateCreated - Date user added to database
    *
    *   Packages login query data into JSON object and returns the object
    */
    function packageLoginData($id, $firstname, $lastname, $dateCreated)
    {
        $payload = '{"ID" : ' + $id + ', "Firstname" : "' + $firstname + '", "Lastname" : "' + $lastname + '", "DateCreated" : "' + $dateCreated + '", "DateLastLoggedIn" : "' + date("m/d/Y") +'", "Error" : ' + NULL + '}';

        return $payload;
    }

    /*
    *   deliverJsonPayload()
    *
    *   @param $payload - JSON formatted object
    *
    *   Sends the data contained in $payload over to the front-end.
    */
    function deliverJsonPayload($payload)
    {
        header('Content-type: application/json');
        json_encode($payload);
        echo $payload;
    }

    /*
    *   returnError()
    *
    *   @param $error - error message to be conveyed to front-end.
    *
    *   Return an error message. Used as an intermediary function to be called
    *   within other functions/scripts to convey an error to front-end.
    */
    function returnError($error)
    {
        $payload = packageLoginData(0, "", "", "");

        deliverJsonPayload($payload);
    }
?>
