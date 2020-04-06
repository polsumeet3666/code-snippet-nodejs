// generate saml meta-data xml using info provided
var saml2 = require("saml2-js");
var fs = require("fs");

var sp_options = {
	entity_id: "https://sp.example.com/metadata.xml",
	private_key: fs.readFileSync("./certs/key-file.pem").toString(),
	certificate: fs.readFileSync("./certs/cert-file.pem").toString(),
	assert_endpoint: "https://sp.example.com/assert",
	force_authn: true,
	auth_context: {
		comparison: "exact",
		class_refs: ["urn:oasis:names:tc:SAML:1.0:am:password"]
	},
	nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
	sign_get_request: false,
	allow_unencrypted_assertion: true
};

// Call service provider constructor with options
var sp = new saml2.ServiceProvider(sp_options);

// Example use of service provider.
// Call metadata to get XML metatadata used in configuration.
var metadata = sp.create_metadata();
console.log(metadata);
