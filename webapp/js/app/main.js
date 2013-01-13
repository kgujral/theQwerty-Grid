var th = new theQwerty(jQuery);

var userUrl = "http://rest.kgujral.cloudbees.net/users";
jQuery(document).ready(function() {
	populateGrid(1000);
});

function populateGrid(count) {
	th.grid({
		url : userUrl,
		displayData: "data",
		wrapperId: "theTable",
		tableId: "user-table",
		cols: [{name: "id", PK: true, displayAs: "select", values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], func: "onEdit"}, 
		       {name: "firstName", PK: true}, 
		       {name: "lastName", PK: true}, 
		       {name: "screenName"}, 
		       {name: "emailAddress"}, 
		       {name: "fullName", displayAs: "template", templateId: "demo-tmpl"}, 
		       {name: "userId", hide:true}],
		headerCols: ["Id", "First Name", "Last Name", "Screen Name", "Email Address", "Full Name", "User ID", "Edit"],
		controls: [{caption: "Edit", type: "button", func:"onEdit"}],
		paging: {totalRecords: parseInt(count), enable: true, remote: true},
		style: "width: 100%;",
		loadingImage: "loading-image"
	});
}

function onEdit(obj, id, x) {
	alert("Edit: "+ id + ", " + x);
}

function func(c) {
	return c == "Hull";
}

function call() {
	alert(JSON.stringify(th.getCurrentRows()));
}