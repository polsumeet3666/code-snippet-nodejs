const Transform = require("stream").Transform;
const ProducerStream = require("kafka-node").ProducerStream;
const producer = new ProducerStream();
const _ = require("lodash");

const stdinTransform = new Transform({
	objectMode: true,
	decodeStrings: true,
	transform(text, encoding, callback) {
		text = _.trim(text);
		console.log(`pushing message ${text} to ExampleTopic`);
		callback(null, {
			topic: "first_topic",
			messages: text,
		});
	},
});

process.stdin.setEncoding("utf8");
process.stdin.pipe(stdinTransform).pipe(producer);
