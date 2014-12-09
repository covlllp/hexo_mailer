var fs = require('fs');
var ejs = require('ejs');

var csvFile = fs.readFileSync("friends_list.csv", "utf8");
var email_template_html = fs.readFileSync("email_template.html", "utf8");
//var email_template_ejs = fs.readFileSync('email_template.ejs', 'utf8');

var friends_list = csvParse(csvFile);

// For using the HTML email template
//makeEmail(friends_list, email_template);

//makeEmail_EJS(email_template_ejs, friends_list, ejs);
//makeEmail(friends_list, email_template_ejs, ejsemail(ejs, email_template_ejs));
makeEmail(friends_list, email_template_html, html_email(email_template_html));


// --- Function for parsing friends list for information --- //
function csvParse(file) {
	var names_obj = [];
	var name_lines = file.split("\n");
	var keys = name_lines.shift().split(",");

	for (var i = 0; i < name_lines.length; i++) {
		var contact = {};
		name = name_lines[i].split(",");
		if (name.length == keys.length) {
			for (var j = 0; j < keys.length; j++) {
				contact[keys[j]] = name[j];
			}
			names_obj.push(contact);
		}
	}
	return names_obj;
}


// --- Functions for trying to be cute --- //
function ejs_email(ejs, email_template) {
	return ejs.render(email_template,
		{
			firstName: firstName,
			monthsSinceContact: numMonths
		});
}

function html_email(email_template) {
	var template_copy = email_template;
	template_copy = template_copy.replace(/FIRST_NAME/gi, firstName)
	.replace(/num_months_since_contact/gi, numMonths);
	
	return template_copy;	
}

function makeEmail(friends_list, email_template, changeFunction) {
	friends_list.forEach(function(row) {
		var firstName = row.firstName;
		var numMonths = row.monthsSinceContact;

		var customized_template = changeFunction();
	});
}


// --- Function for using an EJS template --- //
function makeEail_EJS(email_template_ejs, friends_list, ejs) {
	friends_list.forEach(function(row) {
		var firstName = row.firstName;
		var numMonths = row.monthsSinceContact;

		var customizedTemplate = ejs.render(email_template_ejs,
		{
			firstName: firstName,
			monthsSinceContact: numMonths
		});

		console.log(customizedTemplate);
	});
}


// --- Function for using an HTML template --- //
function makeEmail_HTML(friends_list, email_template) {
	friends_list.forEach(function(row) {
		var firstName = row.firstName;
		var numMonths = row.monthsSinceContact;

		var template_copy = email_template;
		template_copy = template_copy.replace(/FIRST_NAME/gi, firstName)
			.replace(/num_months_since_contact/gi, numMonths);

		console.log(template_copy);
	});
}