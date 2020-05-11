var { spawn } = require("child_process");

var child1 = spawn("node", ["smppclient.js"]);
var child2 = spawn("node", ["smppclient.js"]);
// var child3 = spawn("node", ["smppclient.js"]);
// var child4 = spawn("node", ["smppclient.js"]);
//var child5 = spawn("node", ["smppclient.js"]);

// child.on("exit", (code, signal) => {
// 	console.log("child");
// 	console.log(code, signal);
// });
// child.stdout.on("data", (data) => {
// 	console.log(data.toString());
// });

child1.on("exit", (code, signal) => {
	console.log("child1");
	console.log(code, signal);
});
child1.stdout.on("data", (data) => {
	console.log("child1");
	console.log(data.toString());
});

child2.on("exit", (code, signal) => {
	console.log("child2");
	console.log(code, signal);
});
child2.stdout.on("data", (data) => {
	console.log("child2");
	console.log(data.toString());
});

// child3.on("exit", (code, signal) => {
// 	console.log("child3");
// 	console.log(code, signal);
// });
// child3.stdout.on("data", (data) => {
// 	console.log("child3");
// 	console.log(data.toString());
// });

// child4.on("exit", (code, signal) => {
// 	console.log("child4");
// 	console.log(code, signal);
// });
// child4.stdout.on("data", (data) => {
// 	console.log("child4");
// 	console.log(data.toString());
// });

// child5.on("exit", (code, signal) => {
// 	console.log("child5");
// 	console.log(code, signal);
// });
// child5.stdout.on("data", (data) => {
// 	console.log("child5");
// 	console.log(data.toString());
// });
