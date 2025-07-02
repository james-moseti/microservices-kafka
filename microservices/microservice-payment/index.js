import express from "express"
import cors from "cors"
import { Kafka } from "kafkajs";


const app = express()

app.use(cors({
    origin: "http://localhost:3000",   // Only our frontend can access this service
}))
app.use(express.json())

const kafka = new Kafka({
    clientId: "microservice-payment",
    brokers: ["localhost:9094"],
});

const producer = kafka.producer();

const connectToKafka = async () => {
    try {

        await producer.connect();
        console.log("Producer connected successfully");

    } catch (err) {
        console.error("Error connecting to Kafka:", err);
    }
}

// Create our endpoint
app.post("/microservice-payment", async (req, res) => {
    const {cart} = req.body
    // We can implement an aunthentication middleware to get the user ID
    // For now, we will just assume we get the cookie and decrypt it to get the user ID
    const userId = "1234" // This should be replaced with actual user ID from the cookie

    // This is where we would process the payment
    // TODO: Implement payment processing logic here
    console.log("API endpoint hit!")

    // Send a message to payment success topic using KAFKA
    await producer.send({
        topic: "payment-successful",
        messages: [
            {
                value: JSON.stringify({
                    userId,
                    cart,
                }),
            },
        ],
    })

    return res.status(200).send("Payment successful") 
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message)
})

app.listen(8000, () => {
    connectToKafka();
    console.log("Payment service is running on port 8000")
})