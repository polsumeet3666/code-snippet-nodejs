var smpp = require("smpp");
var session = smpp.connect("smpp://smscsim.melroselabs.com:2775");

// bind txn
session.bind_transceiver(
	{
		system_id: "",
		password: "",
	},
	function (pdu) {
		if (pdu.command_status == 0) {
			console.log(pdu.command_status);
			console.log("successfully bound");

			session.submit_sm(
				{
					destination_addr: "",
					short_message: "hello world",
				},
				function (pdu) {
					if (pdu.command_status == 0) {
						console.log(pdu);
					}
				}
			);
		}
	}
);
