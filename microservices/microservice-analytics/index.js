import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "microservice-analytics",
    brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "analytics-service" });

const run = async () => {

    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "payment-successful", 
            fromBeginning: true,   // If connection is lost and gets reconnected, we want to catch all messages from kafka
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString();
                const {userId, cart} = JSON.parse(value);

                // Example analytics logic: Calculate total amount from the cart
                const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

                console.log(`Analytic consumer: User ${userId} made a payment of $${totalAmount}`);
                // console.log(`Received message from ${topic}:`, value);

                // Here you can implement your analytics logic
                // For example, you can store the data in a database or perform some calculations
            },
        })

    } catch (err) {
        console.error("Error connecting to Kafka:", err);
    }
}


run();