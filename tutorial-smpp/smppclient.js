var smpp = require("smpp");
const util = require("util");

var async = require("async");
var session = smpp.connect({
	url: "smpp://localhost:2775",
	auto_enquire_link_period: 10000,
});

//let conn = null;

function bind() {
	return new Promise((resolve, reject) => {
		session.bind_transceiver(
			{
				system_id: "ID",
				password: "Password",
			},
			function (pdu) {
				if (pdu.command_status == 0) {
					console.log(`pdu : ${JSON.stringify(pdu)}`);
					resolve(session);
				}
				reject(new Error(" unable to bind"));
			}
		);
	});
}

function sendMsgs(session) {
	return new Promise((resolve, reject) => {
		let count = 0;
		for (let i = 0; i < 10000; i++) {
			session.submit_sm(
				{
					destination_addr: "DESTINATION NUMBER",
					short_message: "Hello!" + i,
				},
				function (pdu) {
					//console.log(pdu);
					if (pdu.command_status == 0) {
						count++;
						// Message successfully sent
						console.log(`pdu : ${JSON.stringify(pdu)}`);
						//console.timeEnd("submit");
					}
				}
			);
		}
		resolve(count);
	});
}

function sendSingleMsg(session) {
	session.submit_sm(
		{
			destination_addr: "DESTINATION NUMBER",
			short_message: "Hello!",
		},
		function (pdu) {
			//console.log(pdu);
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log(`pdu : ${JSON.stringify(pdu)}`);
				//console.timeEnd("submit");
			}
		}
	);

	session.unbind();
}

async function main() {
	try {
		let conn = await bind();
		console.time("submit");
		setTimeout(() => {
			console.timeEnd("submit");
			conn.unbind();
			conn.on("unbind_resp", (pdu) => {
				console.log(`pdu : ${JSON.stringify(pdu)}`);
				//console.log("closed");
				//process.exit(0);
			});
		}, 10000);

		//let success = await sendMsgs(conn);
		//console.timeEnd("submit");
		//console.log(success);

		//sendSingleMsg(conn);
		// conn.unbind();
		// conn.on("unbind_resp", (pdu) => {
		// 	console.log(`pdu : ${JSON.stringify(pdu)}`);
		// 	//console.log("closed");
		// 	//process.exit(0);
		// });
	} catch (error) {
		console.log(error);
	}
}
main();

// let task = [main, main];
// async.parallel(task, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result);
// });

//console.log(session);
// session.bind_transceiver(
// 	{
// 		system_id: "YOUR_SYSTEM_ID",
// 		password: "YOUR_PASSWORD",
// 	},
// 	function (pdu) {
// 		console.log(pdu);
// 		session.on("deliver_sm", (pdu) => {
// 			//console.log(pdu);
// 			session.send(pdu.response());
// 		});

// 		console.log(pdu);
// 		if (pdu.command_status == 0) {
// 			// Successfully bound
// 			console.time("submit");

// 			for (let i = 0; i < 20000; i++) {
// 				session.submit_sm(
// 				{
// 						destination_addr: "DESTINATION NUMBER",
// 						short_message: "Hello!" + i,
// 					},
// 					function (pdu) {
// 						//console.log(pdu);
// 						if (pdu.command_status == 0) {
// 							// Message successfully sent
// 							//console.log(pdu.message_id);
// 							//console.timeEnd("submit");
// 						}
// 					}
// 				);
// 			}
// 			console.timeEnd("submit");
// 		}
// 	}
// );
