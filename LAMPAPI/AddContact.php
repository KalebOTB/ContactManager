<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO List (FirstName, LastName, Email, PhoneNumber, UserID)
		VALUES ('$firstName', '$lastName', '$email', '$phoneNumber', '$userId' )";
		
		if ($conn->query($sql) === TRUE) {
			echo "New contact created successfully";
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