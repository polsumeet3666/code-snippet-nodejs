var smpp = require("smpp");
let logger = require("../logging/logging").LOGGER;
const SMPP_URL = "smpp://localhost:2775";
//const SMPP_URL = "smpp://10.160.217.51:2775";
// const SYSTEM_ID = "gcusrd4";//"681467";
// const PASSWORD = "BCNHII"; //;"jio12345";
const SYSTEM_ID = "gcusrd4";
const PASSWORD = "jio12345";
//              sumeet              cp1             amey            cp2             babu
let mobiles = [
	"+919082963535",
	"+918800904670",
	"+918928523199",
	"+919324739759",
	"+917022228859",
];

let conn = null;
let pool = [];
let del = 0;
let enquire = null;
function bind(session) {
	return new Promise((resolve, reject) => {
		//console.log("sending bind");
		logger.info("sending bind");
		session.bind_transceiver(
			{
				system_id: SYSTEM_ID,
				password: PASSWORD,
				addr_ton: "1",
				addr_npi: "1",
			},
			(pdu) => {
				if (pdu.command_status === 0) {
					//console.log(`bind_transceiver_resp pdu : ${JSON.stringify(pdu)}`);
					logger.info(`bind_transceiver_resp pdu : ${JSON.stringify(pdu)}`);
					resolve(session);
				}
				//console.log(`pdu : ${JSON.stringify(pdu)}`);
				logger.info(`pdu : ${JSON.stringify(pdu)}`);

				reject(new Error(" unable to bind"));
			}
		);
	});
}

async function getPool(num) {
	for (let i = 0; i < num; i++) {
		let session = smpp.connect({
			url: SMPP_URL,
		});
		conn = await bind(session);

		logger.info("after bind");
		conn.on("enquire_link_resp", (pdu) => {
			//console.log(`enquire_link_resp : ${JSON.stringify(pdu)}`);
			logger.info(`enquire_link_resp : ${JSON.stringify(pdu)}`);
		});

		conn.on("unbind_resp", (pdu) => {
			//console.log(`unbind_resp : ${JSON.stringify(pdu)}`);
			logger.info(`unbind_resp : ${JSON.stringify(pdu)}`);
		});
		conn.on("submit_sm_resp", (pdu) => {
			//console.log(`submit_sm_resp : ${JSON.stringify(pdu)}`);
			logger.info(`submit_sm_resp : ${JSON.stringify(pdu)}`);
		});

		conn.on("deliver_sm", (pdu) => {
			//console.log(`deliver_sm : ${JSON.stringify(pdu)}`);
			//logger.info(`deliver_sm : ${JSON.stringify(pdu)}`);
			logger.info(`deliver_sm : ${JSON.stringify(pdu["source_addr"])}`);

			conn.send(pdu.response());
			del++;
			logger.info(`del receipt count : ${del}`);
		});
		//console.log("after bind");
		pool.push(conn);
	}
	//console.log("get pool return");
	return;
}

async function main() {
	try {
		//console.log("started");
		logger.info("started");

		try {
			await getPool(1);
			//console.log(`pool size :  ${pool.length}`);
		} catch (error) {
			//console.log(error);
			process.exit(0);
		}

		//console.log("waiting for 1 sec before submit_sm");
		logger.info("waiting for 5 sec before submit_sm");
		setTimeout(() => {
			// for reference values = ensingle/enmulti/vernac/extralong
			let msg = getMessage("ensingle");
			//let msg = getMessage("error160+");
			// send single msg
			sendMessage(msg);

			// send to list
			//sendMessageToList(msg);
		}, 1000);

		enquire = setInterval(() => {
			logger.info("sending enquire pdu");
			conn.enquire_link({}, null);
		}, 60 * 1000);
	} catch (error) {
		//console.log(error);
		logger.info(error);
	}
}

function sendMessage(pduObj) {
	// for reference values = ensingle/enmulti/vernac/extralong
	try {
		//console.log(`submit_sm : ${JSON.stringify(pduObj)}`);
		logger.info(`submit_sm : ${JSON.stringify(pduObj)}`);
		pool[0].submit_sm(pduObj);
	} catch (error) {
		//console.log(error);
		logger.error(error);
	}
}

function sendMessageToList(pduObj) {
	logger.info("sending msgs to list");
	let count = 0;

	let len = mobiles.length;
	mobiles.forEach((val, i) => {
		/*setTimeout(() => {
			logger.info(`waiting for ${i} secs\n\n\n`);
			pduObj["destination_addr"] = val;
			logger.info(`submit_sm : ${JSON.stringify(pduObj)}`);
			try {
				pool[0].submit_sm(pduObj);
				count++;
			} catch (error) {
				//console.log(`send msg list ${error}`);)
				logger.error(error);
			}
        }, i * 1000);*/
		pduObj["destination_addr"] = val;
		logger.info(`submit_sm : ${JSON.stringify(pduObj)}`);
		try {
			pool[0].submit_sm(pduObj);
			count++;
		} catch (error) {
			//console.log(`send msg list ${error}`);)
			logger.error(error);
		}
	});
	//console.log(`total : ${len}, success : ${count}, failed : ${len - count}`);
	logger.info(`total : ${len}, success : ${count}, failed : ${len - count}`);
}

function getMessage(name) {
	// for reference values = ensingle/enmulti/vernac/extralong

	let pduObj;
	if (name.indexOf("ensingle") === 0) {
		pduObj = {
			source_addr_ton: 5,
			source_addr_npi: 1,
			source_addr: "IOCXRP",
			dest_addr_ton: 5,
			dest_addr_npi: 1,
			destination_addr: "+919082963535",
			short_message: "The quick brown fox jumps over the lazy dog",
			esm_class: 0,
			registered_delivery: 1,
		};

		return pduObj;
	} else if (name.indexOf("enmulti") === 0) {
		pduObj = {
			source_addr_ton: 5,
			source_addr_npi: 1,
			source_addr: "JIOINF",
			dest_addr_ton: 5,
			dest_addr_npi: 1,
			destination_addr: "+919082963535",
			short_message:
				"The quick brown fox jumps over the lazy dog \n this is second line",
			esm_class: 0,
			registered_delivery: 1,
		};

		return pduObj;
	} else if (name.indexOf("vernac") === 0) {
		pduObj = {
			source_addr_ton: 5,
			source_addr_npi: 1,
			source_addr: "JIOINF",
			dest_addr_ton: 5,
			dest_addr_npi: 1,
			destination_addr: "+919082963535",
			short_message:
				"English हिन्दी मराठी ગુજરતી ಕನ್ನಡ தமிழ் മലയാളം అల్లు అర్జున్ ਲੱਸੀ",
			esm_class: 0,
			registered_delivery: 1,
		};

		return pduObj;
	} else if (name.indexOf("extralong") === 0) {
		pduObj = {
			source_addr_ton: 5,
			source_addr_npi: 1,
			source_addr: "JIOINF",
			dest_addr_ton: 5,
			dest_addr_npi: 1,
			destination_addr: "+919082963535",
			esm_class: 0,
			registered_delivery: 1,

			message_payload:
				"this is परिक्षण message 1\nthis is परिक्षण message 2\nthis is परिक्षण message 3\nthis is परिक्षण message 4\nthis is परिक्षण message 5\nthis is परिक्षण message 6\nthis is परिक्षण message 7\nthis is परिक्षण message 8\nthis is परिक्षण message 9\nthis is परिक्षण message 10\n",
			sm_length: 0,
		};

		return pduObj;
	} else if (name.indexOf("error160+") === 0) {
		pduObj = {
			source_addr_ton: 5,
			source_addr_npi: 1,
			source_addr: "JIOINF",
			dest_addr_ton: 5,
			dest_addr_npi: 1,
			destination_addr: "+919082963535",
			short_message:
				"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
			esm_class: 0,
			registered_delivery: 1,
		};

		return pduObj;
	}
}

// close all sessions
process.on("SIGINT", function () {
	clearInterval(enquire);
	//console.log("unbinding");
	logger.info("unbinding");
	pool.forEach((item) => {
		item.unbind();
	});
	setTimeout(() => {
		//console.log("process exit");
		logger.info("process exit");
		process.exit(0);
	}, 2000);
});
main();
