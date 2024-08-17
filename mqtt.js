// tes-mqtt.js
const mqtt = require("mqtt");

const mqttOptions = { reconnectPeriod: 1000 };
const mqttClient = mqtt.connect("mqtt://broker.emqx.io", mqttOptions);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("sensor/data", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to sensor/data");
    }
  });
});

// mqttClient.on("message", (topic, message) => {
//   if (topic === "sensor/data") {
//     const newSensorData = message.toString();

//     console.log("Received:", newSensorData);
//   }
// });

mqttClient.on("reconnect", () => {
  console.log("Reconnecting to MQTT broker...");
});

mqttClient.on("offline", () => {
  console.log("MQTT client offline");
});

mqttClient.on("error", (err) => {
  console.error("MQTT error:", err);
});
module.exports = mqttClient;
