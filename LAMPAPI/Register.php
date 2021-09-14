<?php
	$inData = getRequestInfo();
	
	$firstname = $inData["firstName"];
	$lastname = $inData["lastName"];
	$email = $inData["email"];
	$phonenumber = $inData["phoneNumber"];
	$login = $inData["login"];
	$password = $inData["password"];
	$id =0;

	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT INTO Users (FirstName,LastName,Email,PhoneNumber,Login,Password)
		VALUES('$firstname', '$lastname', '$email', '$phonenumber', '$login', '$password')";
		
		if ($conn->query($sql) === FALSE) {
			echo "Error: " . $sql . "<br>" . $conn->error;
		} 
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID']);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ', "error":"", "message":"New user created successfully"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
