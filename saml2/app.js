var saml2 = require("saml2-js");
var fs = require("fs");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// Create service provider
var sp_options = {
	entity_id: "http://localhost:8080/samlp/o2ROdByDxfjt2fxdJkwiWj9eo9UpcEjp",
	private_key: fs.readFileSync("./certs/sp-key.pem").toString(),
	certificate: fs.readFileSync("./certs/sp-cert.crt").toString(),
	assert_endpoint: "http://localhost:8080/sso/acs",
	//assert_endpoint: "http://localhost:4202/dashboard",
	sign_get_request: false,
	allow_unencrypted_assertion: true,
	audience: "ps",
	// force_authn: true,
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
	sso_login_url:
		"https://dev-polsumeet.auth0.com/samlp/o2ROdByDxfjt2fxdJkwiWj9eo9UpcEjp",
	// sso_logout_url:
	// 	"https://dev-polsumeet.auth0.com/samlp/o2ROdByDxfjt2fxdJkwiWj9eo9UpcEjp/logout?federated",
	// https://dev-polsumeet.auth0.com/v2/logout?federated&client_id=o2ROdByDxfjt2fxdJkwiWj9eo9UpcEjp&returnTo=http://localhost:8080/sso/acs
	sso_logout_url:
		"https://dev-polsumeet.auth0.com/v2/logout?federated&client_id=o2ROdByDxfjt2fxdJkwiWj9eo9UpcEjp&returnTo=http://localhost:8080/login",
	certificates: [fs.readFileSync("./certs/dev-polsumeet.pem").toString()],
};
var idp = new saml2.IdentityProvider(idp_options);

// ------ Define express endpoints ------

// Endpoint to retrieve metadata
app.get("/metadata.xml", function (req, res) {
	res.type("application/xml");
	res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function (req, res) {
	sp.create_login_request_url(idp, {}, function (err, login_url, request_id) {
		if (err != null) return res.send(500);
		res.redirect(login_url);
	});
});

// Assert endpoint for when login completes
app.post("/sso/acs", function (req, res) {
	console.log(req.body);
	var options = { request_body: req.body };
	sp.post_assert(idp, options, function (err, saml_response) {
		console.log(err);
		if (err != null) return res.send(500);
		console.log(saml_response);
		// Save name_id and session_index for logout
		// Note:  In practice these should be saved in the user session, not globally.
		name_id = saml_response.user.name_id;
		session_index = saml_response.user.session_index;

		//res.send(`Hello ${saml_response.user.name_id}!`);
		//res.setHeader("ssotoken", "hahahah");

		res.cookie("name_id", name_id);
		res.cookie("session_index", session_index);
		console.log("req.body");
		//console.log(req.body);
		//res.cookie("data", req.body);
		var token = jwt.sign({ foo: "bar" }, "shhhhh");
		//console.log(token);
		//res.cookie("t", token);
		//res.send(template);
		res.redirect("http://localhost:4202/dashboard?auth=" + token);
	});
});

// Starting point for logout
app.get("/logout", function (req, res) {
	console.log(name_id);
	console.log("params");

	var options = {
		name_id: name_id,
		session_index: session_index,
	};
	console.log(options);
	sp.create_logout_request_url(idp, options, function (err, logout_url) {
		console.log(err);
		if (err != null) return res.send(500);
		console.log(logout_url);
		res.redirect(logout_url);
	});
});

app.get("/sso/ep1", function (req, res) {
	console.log("ep1");
	console.log(req.body);
	res.send("ok");
});

app.listen(8080);

var template = `
<!DOCTYPE html>
<html>

<head>
    <script>
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            window.location.replace("http://localhost:4202/dashboard");

        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function checkCookie() {
            var user = getCookie("username");
            
                user = prompt("Please enter your name:", "");
                if (user != "" && user != null) {
                    setCookie("username", user, 30);
                }
            
        }
    </script>
</head>

<body onload="checkCookie()"></body>

</html>
`;
