<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
    $id = 0;

	$conn = new mysqli("localhost", "TheManager", "COP4331", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT firstName, ID FROM List WHERE firstName LIKE ? AND UserID=?");
		$contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $contactName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["firstName"] . ' ' . $row["ID"] . '"';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		
		$stmt->close();
        $stmt = $conn->prepare("SELECT lastName, ID FROM List WHERE lastName LIKE ? AND UserID=?");
		$contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $contactName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["lastName"] . ' ' . $row["ID"] . '"';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
            error($searchResults);
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
