import json

from confluent_kafka import Consumer

consumer_config = {
    "bootstrap.servers": "localhost:9092",
    "group.id": "order-tracker",  # Unique string that identifies the consumer group this consumer belongs to.
    "auto.offset.reset": "earliest" # Tells consumer what to do if it cannot find where it last left off reading messages.
}

consumer = Consumer(consumer_config)

consumer.subscribe(["orders"])

print("Consumer is running and subscribed to orders topic")

try:
    while True:
        msg = consumer.poll(1.0) # .poll() asks the broker for any new messages on the subscribed topics and returns them to the consumer for processing.
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue

        value = msg.value().decode("utf-8")
        order = json.loads(value)
        print(f"Order received: {order['quantity']} x {order['item']} from {order['user']}")
except KeyboardInterrupt:
    print("\n Stopping consumer")

finally:
    consumer.close()