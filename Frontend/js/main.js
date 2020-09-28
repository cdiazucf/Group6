var urlBase = "http://contactsoftheroundtable.info";
var registerFlag = false;
var userId = 0;
var contactsList;
var curEditId;
var curPage = 1;
var resetTimer;

function login() 
{
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var firstName = "";
	var lastName = "";
	var hash = md5(password);
	document.getElementById("validStatus").style.display = "none";
	document.getElementById("invalidStatus").style.display = "none";
	
		
	if(!registerFlag)
	{
		var jsonPayload = '{"username" : "' + username + '", "password" : "' + hash + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function(){
				try
				{
					if(this.readyState == 4)
					{
						var jsonResponse = JSON.parse(xhr.responseText);
						userId = jsonResponse.ID;
						
						if(userId < 1)
						{
							document.getElementById("invalidStatus").innerHTML = "None Shall Pass! : Invalid Login";
							document.getElementById("invalidStatus").style.display = "block";
							return;
						}
						
						firstName = jsonResponse.Firstname;
						lastName = jsonResponse.Lastname;
						
						saveCookie(firstName, lastName, userId);
						
						window.location.href = "contacts.html";
					}
				}
				catch(err)
				{
					document.getElementById("invalidStatus").innerHTML = "She turned me into a newt!: An Error has Occurred" ;
					document.getElementById("invalidStatus").style.display = "block";
				}
			};
		
			xhr.open("POST", urlBase + "/api/login.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("invalidStatus").innerHTML = "She turned me into a newt!: " + err.message;
			document.getElementById("invalidStatus").style.display = "block";
		}
	}
	else
	{
		firstName = document.getElementById("fName").value;
		lastName = document.getElementById("lName").value;
		if((firstName == "") || (lastName == "") || (username == "") || (password == ""))
		{
			document.getElementById("invalidStatus").innerHTML = "Those fields are empty! You're just banging them together!";
			document.getElementById("invalidStatus").style.display = "block";
			return;
		}
		
		var jsonPayload = '{"firstname" : "' + firstName + '", "lastname" : "' + lastName + '", "username" : "' + username + '", "password" : "' + hash + '"}';
		var xhr = new XMLHttpRequest();
		
		try
		{
			xhr.onreadystatechange = function()
			{
				if(this.readyState == 4)
				{
					var jsonResponse = JSON.parse(xhr.responseText);
					console.log(jsonResponse); //*********************debug**************
					
					if(jsonResponse.Error != "")
					{
						document.getElementById("invalidStatus").innerHTML = "Are you suggesting coconuts migrate?!: " + jsonResponse.Error;
						document.getElementById("invalidStatus").style.display = "block";
						return;
					}
					register();
					document.getElementById("validStatus").innerHTML = "I'm not dead! I feel happy! Registration Successful!";
					document.getElementById("validStatus").style.display = "block";
					setTimeout(function(){document.getElementById("validStatus").style.display = "none";}, 10000);
				}
			};
		
			xhr.open("POST", urlBase + "/api/registerUser.php", true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("invalidStatus").innerHTML = "She turned me into a newt!: " + err.message;
			document.getElementById("invalidStatus").style.display = "block";
		}
	}	
}

function register()
{
	document.getElementById("validStatus").style.display = "none";
	document.getElementById("invalidStatus").style.display = "none";
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
					pageList += "<li class=\"page-item\"><a class=\"page-link mypage-link\" href=\"Javascript: showPrev();\" tabindex=\"-1\">Previous</a></li>";

				for(i = 1; i <= totalPages; i++)
				{
					if(i == curPage)
						pageList += "    <li class=\"page-item active\" aria-current=\"page\"><a class=\"page-link mypage-link-current\" href=\#\">" + i + "<span class=\"sr-only\">(current)</span></a></li>";
					else
						pageList += "<li class=\"page-item\"><a class=\"page-link mypage-link\" href=\"Javascript: showcurPage(" + i + ");\">" + i + "</a></li>";
				}
				
				if(curPage < totalPages)
					pageList += "<li class=\"page-item\"><a class=\"page-link mypage-link\" href=\"Javascript: showNext();\" tabindex=\"-1\">Next</a></li>";
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
				contacts += "					<th class=\"actionHeader\">Actions</th>\n";
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
					contacts += "					<td class=\"actionHeader\"><button class=\"actionBtn\" title=\"Update\" onclick=\"showForm(" + i + ");\"><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" class=\"bi bi-pencil-square editIcon\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z\"/><path fill-rule=\"evenodd\" d=\"M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z\"/></svg></button>";
					contacts += "					<button class=\"actionBtn\" title=\"Delete\" onclick=\"deleteContact(" + contactsList[i][0] + ");\"><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" class=\"bi bi-x deleteIcon\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"/></svg></button></td>\n";
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
		setTimeout(function(){document.getElementById("errorShowContacts").style.display = "none";}, 8000);
	}
}

function showNext()
{
	curPage++;
	showContacts();
}

function showcurPage(pageNum)
{
	curPage = pageNum;
	showContacts();
}

function showPrev()
{
	curPage--;
	showContacts();
}

function showForm(editId)
{
	resetStatus();
	document.getElementById("pages").innerHTML = "";
	// If Edit
	if(editId == -1)
	{
		document.getElementById("addupdateTitle").innerHTML = "Add Contact";
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
	// If Add
	else
	{
		var addressArray = contactsList[editId][4].split(", ");
		curEditId = contactsList[editId][0];
		
		document.getElementById("addupdateTitle").innerHTML = "Update Contact";
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
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 8000);
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
				resetTimer = setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 8000);
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
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 8000);
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
				clearTimeout(resetTimer);
				setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 8000);
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
		setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 8000);
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
					clearTimeout(resetTimer);
					setTimeout(function(){document.getElementById("successShowContacts").style.display = "none";}, 8000);
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
			setTimeout(function(){document.getElementById("errorAdd").style.display = "none";}, 8000);
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

function saveCookie(firstName, lastName, userId)
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}