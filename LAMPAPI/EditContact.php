<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userId = $inData["userId"];
    $contactId = $inData["contactId"];

	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "UPDATE List SET firstname= '$firstName', lastname='$lastName', email ='$email', phoneNumber = '$phoneNumber'
        WHERE  ID = '$contactId' AND UserID = '$userId'";
		
		if ($conn->query($sql) === TRUE) {
			echo "Contact update successful";
		} 
		else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>