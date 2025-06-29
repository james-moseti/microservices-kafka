# Microservices Kafka Example

Demo showing event-driven communication between microservices using Apache Kafka.
Every enterprise application creates data, whether it consists of log messages, metrics, 
user activity, or outgoing messages. Moving all this data is just as important as the data itself. 


Sample producer:

```javascript
const kafka = new kafkaProducer({
    'bootstrap.servers': 'localhost:9092'
});

async function processOrder(order) {

    await kafka.produce({
        topic: 'new-orders',
        value: JSON.stringify(order)
    });

    return 'Order received! Check your email for updates'
}
```