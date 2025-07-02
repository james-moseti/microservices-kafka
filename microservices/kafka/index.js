// Description: This code sets up a Kafka producer that connects to a Kafka broker and creates two topics: "payment-successful" and "order-successful".
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [{topic: "payment-successful"}, {topic: "order-successful"}, {topic: "email-successful"}],
    });
};

run();