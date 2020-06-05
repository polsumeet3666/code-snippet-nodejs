const Transform = require("stream").Transform;
const ConsumerGroupStream = require("kafka-node").ConsumerGroupStream;

const consumerOptions = {
	kafkaHost: "127.0.0.1:9092",
	groupId: "StreamTestGroup",
	sessionTimeout: 15000,
	protocol: ["roundrobin"],
	asyncPush: false,
	id: "consumer1",
	fromOffset: "latest",
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, "first_topic");

const messageTransform = new Transform({
	objectMode: true,
	decodeStrings: true,
	transform(message, encoding, callback) {
		console.log(`Received message ${message.value} transforming input`);
		callback(null, null);
	},
});

consumerGroup.pipe(messageTransform);
