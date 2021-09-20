<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
    $id = 0;


	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
		return;
	} 
	else
	{
		$stmt = $conn->prepare("SELECT firstName, lastName, ID FROM List WHERE firstName LIKE ? AND lastName LIKE ? AND email LIKE ? AND phoneNumber LIKE ? AND UserID=?");
		$contactFirst = "%" . $inData["first"] . "%";
		$contactLast = "%" . $inData["last"] . "%";
		$contactEmail = "%" . $inData["email"] . "%";
		$contactPhone = "%" . $inData["phone"] . "%";
		$stmt->bind_param("sssss", $contactFirst, $contactLast, $contactEmail, $contactPhone, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["firstName"] . ' ' . $row["lastName"] . ' ' . $row["ID"] . '"';
		}

		$stmt->close();
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithInfo( $searchResults )
	{
		$retValue = '{"Contacts":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}
	function error($searchResults)
    {
        $retValue = '"error":""';
        echo "\n";
        sendResultInfoAsJson( $retValue );
    }
?>
