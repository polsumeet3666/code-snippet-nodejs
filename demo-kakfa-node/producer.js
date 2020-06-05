let kafka = require("kafka-node");
let client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
let producer = new kafka.Producer(client);
let KeyedMessage = kafka.KeyedMessage;
let km = new KeyedMessage("key", "message");

let payload = [
	{ topic: "first_topic", messages: "from node code 1" },
	{ topic: "first_topic", messages: ["key1", "value1", km] },
];

let admin = new kafka.Admin(client);

// list the topics
function listTopics() {
	admin.listTopics((err, res) => {
		if (err != null) {
			console.log(err);
			return;
		}
		console.log(res);
	});
}

/*
// produce to topic
producer.on("ready", () => {
	producer.send(payload, (err, data) => {
		if (err != null) {
			console.log(err);
			return;
		}
		console.log(data);
	});
});
*/

producer.on("error", (err) => {
	console.log(er);
});

// create topic
let topics = [
	{
		topic: "third_topic",
		partitions: 3,
		replicationFactor: 1,
	},
];

// list topic before creation
listTopics();
// create topic
client.createTopics(topics, (err, result) => {
	if (err != null) {
		console.log(err);
		return;
	}
	console.log(result);
	// list topic after creations
	listTopics();
});
