var urlBase = 'http://khantactmanager.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var currentView = {'view':"",'parentNode':"",'type':""};

function editContact(id){
	readCookie();
	var fname = document.getElementById('e-firstName').value;
	var lname = document.getElementById('e-lastName').value;
	var email = document.getElementById('e-email').value;
	var phone = document.getElementById('e-phone').value;
        var jsonPayLoad2 = JSON.stringify({'firstName':fname,'lastName':lname,'email':email,'phoneNumber':phone,'userId':userId,'contactId':id});
        var url2 = urlBase + '/EditContact.' + extension;
        var xhr2 = new XMLHttpRequest();
        xhr2.open("POST", url2, true);
        xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr2.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                var deleted = xhr2.responseText.search(" successful");
                                if(deleted != -1){
                                	document.getElementById('editResult').innerHTML = "Contact updated successfully."
				}
                        }
                };
                xhr2.send(jsonPayLoad2)
        }
        catch(err){

        }

}

function deleteContact(id){
	readCookie();
	var jsonPayLoad = JSON.stringify({'userId':userId,'contactId':id});
	var url = urlBase + '/DeleteContact.' + extension;
	var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	console.log(xhr);
	try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
				var deleted = xhr.responseText.search(" successfully");
				if(deleted != -1){
					var contacts = document.getElementById('contactSearchResult');
					var current = contacts.querySelectorAll("[data-id='"+id+"']");
					for(var i=0;i<current.length;i++){
						current[i].remove();
					}
					if(document.getElementsByClassName("returnedContact").length == 0){
						document.getElementById("contactMessage").innerHTML = "";
					}
				}
                        }
                };
                xhr.send(jsonPayLoad)
        }
        catch(err){

        }


}

function readContact(id,type){
	//type = 0 = read, type = 1 = edit
	readCookie();
	var jsonPayLoad = JSON.stringify({'userId':userId,'contactId':id});
        var url = urlBase + '/ReadContact.' + extension;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        console.log(xhr);
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                    		var jsonObject = JSON.parse( xhr.responseText );
				if(type == 0){
					var container = document.getElementById("contact-container");
					openView(createReadView(jsonObject), container,id,"read");
				}else if(type == 1){
					var container = document.getElementById("contact-container");
                                        openView(createEditView(jsonObject, id), container,id,"edit");
				}
			}
                };
                xhr.send(jsonPayLoad)
        }
        catch(err){

        }



}

function closeView(type){
	if(currentView.type == "read" || currentView.type == "edit"){
		var alt = document.getElementById('search-container');
		alt.style.display = "flex";
	}
	currentView.parentNode.style.display = "none"
	currentView.parentNode.innerHTML = "";
	currentView.view = "";
	currentView.parentNode = "";
	currentView.id = "";
	currentView.type = "";
	if(type == 1) searchContact();
}

function openView(view, parentNode, id,type){
	if(currentView.parentNode != "") parentNode.style.display = "none";
	currentView.view = view;
	currentView.parentNode = parentNode;
	currentView.id = id;
	currentView.type = type;

	parentNode.innerHTML = view;
	parentNode.dataset.id = id;
	parentNode.style.display = "flex";

	if(type == "read" || type == "edit"){
		var alt = document.getElementById('search-container');
		alt.style.display = "none";
	}
}

function createEditView(obj, id){
	console.log(obj);
	var h = "<h3>Edit Contact</h3>"
	var s1 = "<form id='edit-form'>"
	var s2 = "<label for='editFirstName'>First Name:</label><input type='text' id='e-firstName' name='editFirstName' value='"+obj.firstName+"'>";
	var s3 = "<label for='editLastName'>Last Name:</label><input type='text' id='e-lastName' name='editLastName' value='"+obj.lastName+"'>";
	var s4= "<label for='editEmail'>Email:</label><input type='text' id='e-email' name='editEmail' value='"+obj.email+"'>";
	var s5 = "<label for='editPhone'>Phone Number:</label><input type='tel' id='e-phone' name='editPhone' pattern='[0-9]{3}[0-9]{2}[0-9]{3}' value='"+obj.phoneNumber+"'>"
	var s6 = "<button type='button' id='editButton' class='buttons' onclick='editContact("+id+");'>Update</button>"
	var cr = "<div id='editResult'></div>";
	var s7 = '<button type="button" id="editBackButton" class="buttons" onclick="closeView(1);"> Go back </button>'

	return h + s1 + s2 + s3 + s4 + s5 + s6 + cr + s7 + "</div>";

}

function createReadView(obj){
	var h = "<h3>View Contact</h3>"
	var s1 = "<div id='readContactBlock'>"
	var s2 = "<div>Name: "+obj.firstName+" "+obj.lastName+"</div>";
	var s3 = "";
	if(obj.email != ""){
		s3 = "<div>Email: "+obj.email+"</div>";
	}
	var s4 = "";
	if(obj.phoneNumber != ""){
		s4 = "<div>Phone Number: "+obj.phoneNumber+"</div>";
	}
	var s5 = '<button type="button" id="readBackButton" class="buttons" onclick="closeView(0);"> Go back </button>'
	s1 = h + s1 + s2 + s3 + s4 + s5 + "</div>";
	return s1;
}

function doRegister(){
	userId = 0;
	firstName = "";
	lastName = ""

	var fname = document.getElementById("registerFirstName").value;
	var lname = document.getElementById("registerLastName").value;
	var email = document.getElementById("registerEmail").value;
	var phone = document.getElementById("registerPhone").value;
	var username = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;

	var tmp = {firstName:fname,lastName:lname,email:email,phoneNumber:phone,login:username,password:password}
	var jsonPayLoad = JSON.stringify(tmp)

	var url = urlBase + '/Register.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	console.log(xhr,jsonPayLoad);
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{

				var jsonObject = JSON.parse( xhr.responseText );
				if(jsonObject.error != ""){
					document.getElementById("registerMessage").innerHTML = jsonObject.error;
				}else{
					switchIndexForm(1);
				}
			
			}
		};
		xhr.send(jsonPayLoad)
	}
	catch(err){
	
	}

}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );
	
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contactManager.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function addContact()
{
	readCookie();
	var first = document.getElementById("a-firstName").value;
  	var last = document.getElementById("a-lastName").value;
  	var email = document.getElementById("a-email").value;
  	var phone = document.getElementById("a-phoneNum").value;
  
  	var tmp = {first, last, email, phone, userId};
	document.getElementById("contactAddResult").innerHTML = "";

	//var tmp = {contact:newContact};
	var jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(xhr);
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	//Read the cookie to get UserId to base search off of
	readCookie();
	var first = document.getElementById("s-firstName").value;
  	var last = document.getElementById("s-lastName").value;
  	var email = document.getElementById("s-email").value;
  	var phone = document.getElementById("s-phoneNum").value;
	document.getElementById("contactMessage").innerHTML = "";
	document.getElementById("contactList").innerHTML = "";
	var contactList = "";
	//Added userId to the json being sent
	var tmp = {first, last, email, phone, userId};
	var jsonPayload = JSON.stringify( tmp );
	//Changed the php file i was using for testing purposes. Needs to be updated
	var url = urlBase + '/SearchContact-new.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				//jsonObject.results needed to be jsonObject.Contacts b/c of the object
				if(!jsonObject.error){
					document.getElementById("contactMessage").innerHTML = "Contact(s) has been retrieved";
					console.log(jsonObject);
					for( var i=0; i<jsonObject.Contacts.length; i++ )
					{
						var id = jsonObject.Contacts[i].match(/\d+/g);
						var name = jsonObject.Contacts[i].replace(/[0-9]/g, '');

						var s1 = "<div class='returnedContact' data-id='"+id+ "'>"
						var s2 = "<div class='returnedContactName'>"+name+"</div>"
						var s3 = "<div class='returnedContactControls'><img src='images/view.png' onclick='readContact("+id+",0)' width='20' height='20'><img src='images/edit.png' onclick='readContact("+id+",1)' width='20' height='20'><img id='deleteControl' src='images/delete.png' onclick='deleteContact("+id+")' width='20' height='20'></div>"
						s1 = s1 + s2 + s3 + "</div>";
						document.getElementById("contactList").innerHTML += s1;
					}

				}else{
					document.getElementById("contactMessage").innerHTML = jsonObject.error;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactMessage").innerHTML = err.message;
	}
	
}

function switchIndexForm(x){
  if (x == 1){
    document.getElementById("login-container").style.display = "grid";
    document.getElementById("register-container").style.display = "none";
  }else {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("register-container").style.display = "grid";
  }
}
