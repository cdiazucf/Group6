var urlBase = 'http://contactsoftheroundtable.info';
var registerFlag = false;

function login() 
{
	var userId = 0;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var firstName, lastName;
	var hash = md5(password);
	document.getElementById("loginStatus").innerHTML = "";
		
	if(!registerFlag)
	{
		var jsonPayload = '{"username" : "' + username + '", "password" : "' + hash + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					userId = jsonResponse.userId;			
					
					if(userId < 1)
					{
						document.getElementById("loginStatus").innerHTML = "Error: User not Found";
						return;
					}
					
					firstName = jsonResponse.firstName;
					lastName = jsonRespons.lastName;
					
					saveCookie();
					
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
		var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "username" : "' + username + '", "password" : "' + hash + '"}';
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
		
			xhr.open("POST", urlBase + "/api/register.php", true);
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

function saveCookie()
{
	
}

function readCookie()
{
	
}