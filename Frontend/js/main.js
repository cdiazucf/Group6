var urlBase = "http://contactsoftheroundtable.info";
var registerFlag = false;

function login() 
{
	var userId = 0;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var firstName = "";
	var lastName = "";
	//var hash = md5(password);
	document.getElementById("loginStatus").innerHTML = "";
		
	if(!registerFlag)
	{
		var jsonPayload = '{"username" : "' + username + '", "password" : "' + password + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					//****Testing****
					//var jsonResponse = JSON.parse("{\"ID\" : \"1\", \"Firstname\" : \"Richard\", \"Lastname\" : \"Lienecker\", \"DateCreated\" : \"05/02/2020\", \"DateLastLoggedIn\" : \"09/02/2020\", \"Error\" : \"\"}");
					userId = jsonResponse.ID;
					
					if(userId < 1)
					{
						document.getElementById("loginStatus").innerHTML = "Error: User not Found";
						return;
					}
					
					firstName = jsonResponse.Firstname;
					lastName = jsonResponse.Lastname;
					
					saveCookie(firstName, lastName, userId);
					
					window.location.href = "contacts.html";
				}
			};
		
			xhr.open("POST", urlBase + "/api/login.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("loginStatus").innerHTML = "Error: " + err.message;
		}
	}
	else
	{
		firstName = document.getElementById("fName").value;
		lastName = document.getElementById("lName").value;
		var jsonPayload = '{"firstname" : "' + firstName + '", "lastname" : "' + lastName + '", "username" : "' + username + '", "password" : "' + password + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					
					if(!jsonResponse.sucess)
					{
						document.getElementById("loginStatus").innerHTML = "Error: " + jsonResponse.error;
						return;
					}
					document.getElementById("loginStatus").innerHTML = "Registration Successful!";
				}
			};
		
			xhr.open("POST", urlBase + "/api/registerUser.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("loginStatus").innerHTML = "Error: " + err.message;
		}
	}	
}

function register()
{
	if(!registerFlag)
	{
		document.getElementById("loginButton").innerHTML = "Register";
		document.getElementById("registerLink").innerHTML = "<a href=\"javascript:register();\">Login</a>";
		registerFlag = true;
		document.getElementById("nameFields").style.display = "block";
	}
	else
	{
		document.getElementById("loginButton").innerHTML = "Login";
		document.getElementById("registerLink").innerHTML = "<a href=\"javascript:register();\">Register</a>";
		registerFlag = false;
		document.getElementById("nameFields").style.display = "none";
	}
}

function logout()
{
	document.cookie = "firstName= ; expires =Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = urlBase;
}

function saveCookie(firstName, lastName, userId)
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	var userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if(tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if(tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if(tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = urlBase;
	}
	else
	{
		document.getElementById("greeting").innerHTML = "Hello " + firstName + " " + lastName + "!";
	}
}