var fs              = require('fs');
var ejs             = require('ejs');
var FeedSub         = require('feedsub');
var mandrill        = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('aAK1ENWwpFkaj4ein30glg');
var blogContent     = new FeedSub('http://covlllp.github.io/atom.xml', {
	emitOnStart: true
});
var csvFile      	= fs.readFileSync("friends_list_v2.csv", "utf8");
var friends_list 	= csvParse(csvFile);
                                                                                                                                                                                                                                                                                                
// Options for me!
var from_name    = "Colin VanLang";
var from_email   = "colinvanlang@gmail.com";
var subject_name = "Catching up! (Hexo Mailer)";


//var email_template_html = fs.readFileSync("email_template.html", "utf8");
var email_template_ejs = fs.readFileSync('email_template.ejs', 'utf8');
var posts = [];

// --- Read xml file and create email templates --- //
blogContent.read(function(err, blogPosts) {
	var now = Date.now();

	// get posts only posted in last 7 days
	blogPosts.forEach(function(post) {
		var post_date = new Date(post.published).getTime();
		if (dayDifference(now, post_date) < 7) {
			posts.push(post);
		}
	});
	makeEmail();
});


// --- Function for sending emails --- //
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html) {
	var message = {
		"html": message_html,
		"subject": subject,
		"from_email": from_email,
		"from_name": from_name,
		"to": [{
			"email": to_email,
			"name": to_name
		}],
		"important": false,
		"track_opens": true,    
		"auto_html": false,
		"preserve_recipients": true,
		"merge": false,
		"tags": [
			"Fullstack_Hexomailer_Workshop"
		]    
  	};
	var async   = false;
	var ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
//		console.log(message);
//		console.log(result);   
  	}, function(e) {
		// Mandrill returns the error as an object with name and message keys
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}


// --- Functions for getting latest blog posts --- //
function dayDifference(date1, date2) {
	// Assume dates are given in milliseconds
	return Math.floor((date1 - date2) / 86400000);
}


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


// --- Function for using an EJS template --- //
function makeEmail() {
	friends_list.forEach(function(row) {
		var firstName = row.firstName;
		var numMonths = row.monthsSinceContact;

		var customizedTemplate = ejs.render(email_template_ejs,
		{
			firstName: firstName,
			monthsSinceContact: numMonths,
			latestPosts: posts
		});

		// Actually send the email
		var name = firstName + " " + row.lastName;
		var email_address = row.emailAddress;
		sendEmail(
			name, email_address,
			from_name, from_email,
			subject_name, customizedTemplate);
		console.log("Email sent to " + name + " at " + email_address);
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
	});
}