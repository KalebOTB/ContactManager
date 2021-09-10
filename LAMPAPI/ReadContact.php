
<?php

	$inData = getRequestInfo();

	$firstName = "";
	$lastName = "";
    $email = "";
    $phoneNumber = 0;

	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT firstName,lastName,email,phoneNumber FROM List WHERE UserID=? AND ID =?");
		$stmt->bind_param("ii", $inData["userId"], $inData["contactId"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['email'], $row['phoneNumber'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"firstName":"","lastName":"", "email":"", "phoneNumber":"", "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $email, $phoneNumber )
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '", "email":"' . $email . '", "phoneNumber":"' . $phoneNumber . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
