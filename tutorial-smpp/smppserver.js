const smpp = require("smpp");
const port = 2775;
let server = smpp.createServer((session) => {
	session.on("bind_transceiver", (pdu) => {
		session.pause();
		console.log("\nreceived bind_txn");
		console.log(`process: ${process.pid} pdu : ${JSON.stringify(pdu)}`);
		//		console.log(pdu);
		checkAsyncUserPass(pdu.system_id, pdu.password, function (err) {
			if (err) {
				session.send(
					pdu.response({
						command_status: smpp.ESME_RBINDFAIL,
					})
				);
				session.close();
				return;
			}
			console.log(`process: ${process.pid} sending bind_txn_resp`);

			session.send(pdu.response());
			session.resume();
		});
	});

	/**
	 * FLOW
	 * SMSC --> WIRELESS PROTOCOL --> MC
	 * 1. Receive submit_sm (register delivery = SMSC Delivery Receipt)
	 * 2. Send submit_sm_resp
	 * 3. Network Delivery Attempt
	 * 4. Send deliver_sm (esm class = SMSC Delivery Receipt)
	 * 5. Receive deliver_sm_resp
	 */
	session.on("submit_sm", (pdu) => {
		//console.log("\nreceived submit_sm");
		console.log(`process: ${process.pid} pdu: ${JSON.stringify(pdu)}`);
		//session.pause();
		//console.log("\nsending submit_sm_resp");
		session.send(pdu.response());
		//session.resume();

		// sendDeliveryReceipt(
		// 	session,
		// 	{
		// 		source_addr_ton: "1",
		// 		source_addr_npi: "2",
		// 		source_addr: "sa",
		// 	},
		// 	(pdu) => {
		// 		console.log("\ndeliver_sm call back");
		// 		console.log(pdu);
		// 	}
		// );
	});
	session.on("unbind", (pdu) => {
		console.log(`process: ${process.pid} pdu: ${JSON.stringify(pdu)}`);
		session.send(pdu.response());
	});
});

let checkAsyncUserPass = async (id, password, cb) => {
	// logic to validate id and password
	cb(null);
};

function sendDeliveryReceipt(session, options, callback) {
	var pdu = new smpp.PDU("deliver_sm", options);
	session.send(pdu, callback);
}

console.log(`smpp server running on ${port}`);
server.listen(port);
