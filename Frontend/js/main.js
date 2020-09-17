var urlBase = "http://contactsoftheroundtable.info";
var registerFlag = false;
var userId = 0;
var contactsList;
var curEditId;
var curPage = 1;

function login() 
{
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var firstName = "";
	var lastName = "";
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
					userId = jsonResponse.ID;
					
					if(userId < 1)
					{
						document.getElementById("loginStatus").innerHTML = "None Shall Pass! : Invalid Login";
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
			document.getElementById("loginStatus").innerHTML = "She turned me into a newt!: " + err.message;
		}
	}
	else
	{
		firstName = document.getElementById("fName").value;
		lastName = document.getElementById("lName").value;
		if((firstName == "") || (lastName == "") || (username == "") || (password == ""))
		{
			document.getElementById("loginStatus").innerHTML = "Those fields are empty! You're just banging them together!";
			return;
		}
		
		var jsonPayload = '{"firstname" : "' + firstName + '", "lastname" : "' + lastName + '", "username" : "' + username + '", "password" : "' + hash + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function()
			{
				if(this.readyState == 4 && this.status == 200)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					
					if(jsonResponse.Error != "")
					{
						document.getElementById("loginStatus").innerHTML = "Are you suggesting coconuts migrate?!: " + jsonResponse.Error;
						return;
					}
					register();
					document.getElementById("loginStatus").innerHTML = "I'm not dead! I feel happy! Registration Successful!";
				}
			};
		
			xhr.open("POST", urlBase + "/api/registerUser.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("loginStatus").innerHTML = "She turned me into a newt!: " + err.message;
		}
	}	
}

function register()
{
	document.getElementById("username").value = "";
	document.getElementById("password").value = "";
	document.getElementById("fName").value = "";
	document.getElementById("lName").value = "";
	
	if(!registerFlag)
	{
		document.getElementById("loginButton").innerHTML = "Register";
		document.getElementById("registerLink").innerHTML = "Already have an account? Login <a href=\"javascript:register();\">here</a>!";
		registerFlag = true;
		document.getElementById("nameFields").style.display = "block";
	}
	else
	{
		document.getElementById("loginButton").innerHTML = "Login";
		document.getElementById("registerLink").innerHTML = "Don't have an account? Register <a href=\"javascript:register();\">here</a>!";
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

function showMyContacts()
{
	document.getElementById("searchField").value = "";
	resetStatus();
	curPage = 1;
	showContacts();
}

function showContacts()
{			
	document.getElementById("fName").value = "";
	document.getElementById("lName").value = "";
	document.getElementById("address1").value = "";
	document.getElementById("address2").value = "";
	document.getElementById("city").value = "";
	document.getElementById("state").value = "";
	document.getElementById("zip").value = "";
	document.getElementById("phone").value = "";
	document.getElementById("email").value = "";
	
	
	var jsonPayload = '{"userID" : ' + userId + ', "criteria" : "' + document.getElementById("searchField").value + '", "pageNum" : ' + curPage + '}';
	console.log(jsonPayload); //*********************debug**************
	var xhr = new XMLHttpRequest();
		
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				var jsonResponse = JSON.parse(xhr.responseText);
				console.log(jsonResponse); //*********************debug**************
				
				var totalPages = Math.ceil(jsonResponse.NumRows/10);
				var pageList = "<ul class=\"pagination justify-content-center\">";
				
				if(curPage == 1)
					pageList += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"\" tabindex=\"-1\" aria-disabled=\"true\">Previous</a></li>";
				else
					pageList += "<li class=\"page-item\"><a class=\"page-link\" href=\"Javascript: showPrev();\" tabindex=\"-1\">Previous</a></li>";

				for(i = 1; i <= totalPages; i++)
				{
					if(i == curPage)
						pageList += "    <li class=\"page-item active\" aria-current=\"page\"><a class=\"page-link mypage-link\" href=\#\">" + i + "<span class=\"sr-only\">(current)</span></a></li>";
					else
						pageList += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">" + i + "</a></li>";
				}
				
				if(curPage < totalPages)
					pageList += "<li class=\"page-item\"><a class=\"page-link\" href=\"Javascript: showNext();\" tabindex=\"-1\">Next</a></li>";
				else
					pageList += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"\" tabindex=\"-1\" aria-disabled=\"true\">Next</a></li>";
				
				document.getElementById("pages").innerHTML = pageList + "</ul>";							
				
				contactsList = jsonResponse.Contacts;

				var contacts = "		<table class=\"table table-dark table-hover\">\n";
				contacts += "			<thead>\n";
				contacts += "				<tr>\n";
				contacts += "					<th>Firstname</th>\n";
				contacts += "					<th>Lastname</th>\n";
				contacts += "					<th>Address</th>\n";
				contacts += "					<th>Phone</th>\n";	
				contacts += "					<th>Email</th>\n";
				contacts += "					<th></th>\n";
				contacts += "					<th></th>\n";
				contacts += "				</tr>\n";
				contacts += "			</thead>\n";
				contacts += "			<tbody>\n";
				
				for(i = 0; i < jsonResponse.TotalContacts; i++)
				{
					contacts += "				<tr>\n";
					contacts += "					<td>" + contactsList[i][2] + "</td>\n";
					contacts += "					<td>" + contactsList[i][3] + "</td>\n";
					contacts += "					<td>" + contactsList[i][4] + "</td>\n";
					contacts += "					<td>" + contactsList[i][6] + "</td>\n";
					contacts += "					<td>" + contactsList[i][5] + "</td>\n";
					contacts += "					<td><button onclick=\"showForm(" + i + ");\">Update</button></td>\n";
					contacts += "					<td><button onclick=\"deleteContact(" + contactsList[i][0] + ");\">Delete</button></td>\n";
					contacts += "				</tr>\n";
				}
				contacts += "			</tbody>\n";
				contacts += "		</table>\n";
				
				document.getElementById("displayContacts").innerHTML = contacts;
				document.getElementById("searchBar").style.display = "block";
				document.getElementById("addInputs").style.display = "none";
			}
		};

		xhr.open("POST", urlBase + "/api/searchContacts.php", true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("errorShowContacts").innerHTML = "She turned me into a newt!: " + err.message;
		document.getElementById("errorShowContacts").style.display = "block";
		setTimeout(function(){document.getElementById("errorShowContacts").style.display = "none";}, 3000);
	}
}

function showNext()
{
	curPage++;
	showContacts();
}

function showPrev()
{
	curPage--;
	showContacts();
}

function showForm(editId)
{
	document.getElementById("pages").innerHTML = "";
	if(editId == -1)
	{
		
		document.getElementById("editBtn").style.display = "none";
		document.getElementById("addBtn").style.display = "block";
		document.getElementById("fName").value = "";
		document.getElementById("lName").value = "";
		document.getElementById("address1").value = "";
		document.getElementById("address2").value = "";
		document.getElementById("city").value = "";
		document.getElementById("state").value = "";
		document.getElementById("zip").value = "";
		document.getElementById("phone").value = "";
		document.getElementById("email").value = "";
	}
	else
	{
		var addressArray = contactsList[editId][4].split(", ");
		curEditId = contactsList[editId][0];
		
		document.getElementById("addBtn").style.display = "none";
		document.getElementById("editBtn").style.display = "block";
		document.getElementById("fName").value = contactsList[editId][2];
		document.getElementById("lName").value = contactsList[editId][3];
		
		if(addressArray.length == 3)
		{
			document.getElementById("address1").value = addressArray[0];
			document.getElementById("address2").value = "";
			document.getElementById("city").value = addressArray[1];
			document.getElementById("state").value = addressArray[2].split(" ")[0];
			document.getElementById("zip").value = addressArray[2].split(" ")[1];
		}
		else
		{
			document.getElementById("address1").value = addressArray[0];
			document.getElementById("address2").value = addressArray[1];
			document.getElementById("city").value = addressArray[2];
			document.getElementById("state").value = addressArray[3].split(" ")[0];
			document.getElementById("zip").value = addressArray[3].split(" ")[1];
		}
		document.getElementById("phone").value = contactsList[editId][6];
		document.getElementById("email").value = contactsList[editId][5];
	}
	document.getElementById("addInputs").style.display = "block";
	document.getElementById("searchBar").style.display = "none";
	document.getElementById("displayContacts").innerHTML = "";
}

function add()
{
	var contact = {};
	contact.userID = userId;
	contact.firstname = document.getElementById("fName").value;
	contact.lastname = document.getElementById("lName").value;
	contact.address = document.getElementById("address1").value;
	if (document.getElementById("address2").value != "")
		contact.address += ", " + document.getElementById("address2").value;
	contact.address += ", " + document.getElementById("city").value + ", " + document.getElementById("state").value + " " + document.getElementById("zip").value;
	contact.phone = document.getElementById("phone").value;
	contact.email = document.getElementById("email").value;
	
		if(contact.firstname == "")
	{
		document.getElementById("errorAdd").innerHTML = "Those fields are empty! You're just banging them together!";
		document.getElementById("errorAdd").style.display = "block";
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 3000);
		return;
	}
	
	var jsonPayload = JSON.stringify(contact);
	var xhr = new XMLHttpRequest();
		
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				var jsonResponse = JSON.parse(xhr.responseText);
				console.log(jsonResponse); //************************debug*************
				document.getElementById("successShowContacts").innerHTML = "Who are you who are so wise in the ways of science? Contact Added";
				document.getElementById("successShowContacts").style.display = "block";
				setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 3000);
				showContacts();
			}
		};
	
		xhr.open("POST", urlBase + "/api/addContact.php", true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("errorAdd").innerHTML = "She turned me into a newt!: " + err.message;
		document.getElementById("errorAdd").style.display = "block";
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 3000);
	}
}

function updateContact()
{
	var contact = {};
	contact.ID = curEditId;
	contact.firstname = document.getElementById("fName").value;
	contact.lastname = document.getElementById("lName").value;
	contact.address = document.getElementById("address1").value;
	if (document.getElementById("address2").value != "")
		contact.address += ", " + document.getElementById("address2").value;
	contact.address += ", " + document.getElementById("city").value + ", " + document.getElementById("state").value + " " + document.getElementById("zip").value;
	contact.phone = document.getElementById("phone").value;
	contact.email = document.getElementById("email").value;
	
	var jsonPayload = JSON.stringify(contact);
	var xhr = new XMLHttpRequest();
	
	try
	{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200)
			{
				var jsonResponse = JSON.parse(xhr.responseText);
				document.getElementById("successShowContacts").innerHTML = "It's Just a Flesh Wound! Contact Updated";
				document.getElementById("successShowContacts").style.display = "block";
				setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 3000);
				showContacts();
			}
		};
	
		xhr.open("POST", urlBase + "/api/updateContact.php", true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("errorAdd").innerHTML = "She turned me into a newt!: " + err.message;
		document.getElementById("errorAdd").style.display = "block";
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 3000);
	}
}

function deleteContact(id)
{
	if(confirm("Does it weigh as much as a duck?: Delete"))
	{
		var jsonPayload = '{"ID" : "' + id + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					document.getElementById("successShowContacts").innerHTML = "It's Made of Wood! Contact Deleted";
					document.getElementById("successShowContacts").style.display = "block";
					setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 3000);
					showContacts();
				}
				
			};
		
			xhr.open("POST", urlBase + "/api/deleteContact.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("errorAdd").innerHTML = "She turned me into a newt!: " + err.message;
			document.getElementById("errorAdd").style.display = "block";
			setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 3000);
		}
	}
}

function resetStatus()
{
	document.getElementById("errorShowContacts").style.display = "none";
	document.getElementById("errorAdd").style.display = "none";
	document.getElementById("successShowContacts").style.display = "none";
}

function readCookie()
{
	resetStatus();
	userId = -1;
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
		document.getElementById("greeting").innerHTML = "Good Day " + firstName + " " + lastName + "!";
		showMyContacts();
	}
	
}