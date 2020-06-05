var smpp = require("smpp");
let log = require("log-update");

let connCount = 1,
	submitSm = 0,
	submitSmResp = 0,
	testMsgCount = 1;

let sd = null,
	ed = null;
let status = "connecting";

let POOL = null;
function bind(session) {
	return new Promise((resolve, reject) => {
		session.bind_transceiver(
			{
				system_id: "ID",
				password: "Password",
			},
			(pdu) => {
				if (pdu.command_status === 0) {
					//console.log(`pdu : ${JSON.stringify(pdu)}`);
					resolve(session);
				}
				reject(new Error(" unable to bind"));
			}
		);
	});
}

async function createConnectionPool(instances) {
	let pool = [];

	for (let i = 0; i < instances; i++) {
		let session = smpp.connect({
			url: "smpp://localhost:2775",
			auto_enquire_link_period: 100,
		});
		let conn = await bind(session);
		conn.on("enquire_link_resp", (pdu) => {
			//console.log(`enquire_link_resp : ${JSON.stringify(pdu)}`);
		});
		conn.on("unbind_resp", (pdu) => {
			//console.log(`unbind_resp : ${JSON.stringify(pdu)}`);
		});
		conn.on("submit_sm_resp", (pdu) => {
			//console.log(`submit_sm_resp : ${JSON.stringify(pdu)}`);
			submitSmResp++;
			if (submitSmResp === testMsgCount) {
				ed = new Date().getTime();
			}
		});
		pool.push(conn);
	}

	return pool;
}

function sendEnquireLink(conn) {
	return new Promise((resolve, reject) => {
		let cb = null;
		conn.enquire_link({}, cb);
	});
}

function sendSubmitPdu(conn) {
	conn.submit_sm({
		source_addr_ton: 0,
		source_addr_npi: 0,
		source_addr: "1000",
		dest_addr_ton: 1,
		dest_addr_npi: 1,
		destination_addr: "2000",
		short_message: "this is परिक्षण message",
		esm_class: 0,
	});
	submitSm++;
}

async function main() {
	try {
		POOL = await createConnectionPool(connCount);
		connCount = POOL.length;
		status = "connected";

		//console.log(`Number of connection : ${POOL.length}`);

		// enquire link
		// setTimeout(() => {
		// 	sendEnquireLink(POOL[0]);
		// }, 10000);
		sd = new Date().getTime();
		for (let i = 0; i < testMsgCount; i++) {
			sendSubmitPdu(POOL[0]);
			sendSubmitPdu(POOL[1]);
		}
		setInterval(() => {
			display();
		}, 2000);
	} catch (error) {
		//console.log(error);
	}
}
main();

// close all sessions
process.on("SIGINT", function () {
	status = "disconnected";
	//console.log("Caught interrupt signal");
	POOL.forEach((conn) => {
		conn.unbind();
	});
	//console.log("closed all connections in 2 secs");
	setTimeout(() => {
		process.exit(0);
	}, 1000);
});

function display() {
	log(`
status          : ${status}
connections     : ${connCount}
testMsgCount    : ${testMsgCount} on each thread
submit_sm       : ${submitSm}
submit_sm_resp  : ${submitSmResp}
startTime       : ${sd}
endTime         : ${ed}
diff            : ${ed - sd}


	`);
}
