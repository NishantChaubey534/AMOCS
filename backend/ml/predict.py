import joblib
import sys
import json

# Load model
model = joblib.load("ship_anomaly_model.joblib")

# Read features from Node.js or CLI
features = json.loads(sys.argv[1])

X = [[
    features["speed"],
    features["fuelDrop"],
    features["courseChange"],
    features["latDelta"],
    features["lngDelta"]
]]

prediction = model.predict(X)[0]

print("ANOMALY" if prediction == 1 else "NORMAL")
