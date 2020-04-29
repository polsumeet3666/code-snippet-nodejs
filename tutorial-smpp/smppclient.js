var smpp = require("smpp");
var session = smpp.connect({
	url: "smpp://localhost:2775",
	auto_enquire_link_period: 10000,
});
//console.log(session);
session.bind_transceiver(
	{
		system_id: "YOUR_SYSTEM_ID",
		password: "YOUR_PASSWORD",
	},
	function (pdu) {
		console.log(pdu);
		session.on("deliver_sm", (pdu) => {
			console.log(pdu);
			session.send(pdu.response());
		});

		console.log(pdu);
		if (pdu.command_status == 0) {
			// Successfully bound
			session.submit_sm(
				{
					destination_addr: "DESTINATION NUMBER",
					short_message: "Hello!",
				},
				function (pdu) {
					console.log(pdu);
					if (pdu.command_status == 0) {
						// Message successfully sent
						console.log(pdu.message_id);
					}
				}
			);
		}
	}
);
