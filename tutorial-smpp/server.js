const smpp = require("smpp");
const port = 2775;

let log = require("log-update");
let simulateCPU = 10;
let clientCount = 0,
	submitSmResp = 0;

let server = smpp.createServer((session) => {
	session.on("bind_transceiver", (pdu) => {
		session.pause();
		//console.log("\nreceived bind_txn");
		//console.log(`process: ${process.pid} pdu : ${JSON.stringify(pdu)}`);
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
			//console.log(`process: ${process.pid} sending bind_txn_resp`);
			clientCount++;
			setTimeout(() => {
				session.send(
					pdu.response({
						system_id: `${process.pid}`,
						sc_interface_version: 0x34,
					})
				);

				session.resume();
			}, simulateCPU);
		});
	});

	session.on("submit_sm", (pdu) => {
		//console.log(`process: ${process.pid} pdu: ${JSON.stringify(pdu)}`);
		//session.pause();

		session.send(pdu.response());
		submitSmResp++;
		display();
		//session.resume();
	});
	session.on("unbind", (pdu) => {
		clientCount--;
		//console.log(`process: ${process.pid} pdu: ${JSON.stringify(pdu)}`);
		session.send(pdu.response());
	});

	session.on("enquire_link", (pdu) => {
		//console.log(`process: ${process.pid} pdu: ${JSON.stringify(pdu)}`);
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

function display() {
	log(`
clients			: ${clientCount}
submit_sm_resp	: ${submitSmResp}
	`);
}

//console.log(`smpp server running on ${port}`);
server.listen(port);
