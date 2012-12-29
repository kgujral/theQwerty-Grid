
var userUrl = "http://rest.kgujral.cloudbees.net/users";
jQuery(document).ready(function() {
	populateGrid(1000);
});

function populateGrid(count) {
	var th = new theQwerty();
	th.grid({
		url : userUrl,
		displayData: "data",
		wrapperId: "theTable",
		tableId: "user-table",
		cols: [{name: "id", PK: true}, 
		       {name: "firstName", PK: true}, 
		       {name: "lastName", PK: true}, 
		       {name: "screenName"}, 
		       {name: "emailAddress"}, 
		       {name: "userId", hide:true}],
		headerCols: ["Id", "First Name", "Last Name", "Screen Name", "Email Address", "User ID", "Edit"],
		controls: [{caption: "Edit", type: "button", func:"onEdit"}],
		paging: {totalRecords: parseInt(count), enable: true, remote: true},
		style: "width: 100%;"
	});
}

function onEdit(obj, id) {
	alert("Edit: "+ id);
}