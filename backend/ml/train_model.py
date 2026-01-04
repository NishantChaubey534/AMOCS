import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Dummy normal behavior data (can be expanded)
data = pd.DataFrame({
    "speed": [12, 13, 14, 15, 14],
    "fuelDrop": [0.01, 0.02, 0.01, 0.015, 0.02],
    "courseChange": [1, 2, 1, 3, 2],
    "latDelta": [0.0001]*5,
    "lngDelta": [0.0001]*5
})

model = IsolationForest(contamination=0.05)
model.fit(data)

joblib.dump(model, "ship_anomaly_model.pkl")
print("✅ ML model trained & saved")
