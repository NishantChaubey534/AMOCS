# AMOCS -- Autonomous Maritime Operations Command System (MVP)

AMOCS is a real-time maritime fleet monitoring and anomaly detection
system that simulates naval ship movements, detects anomalies using
rule-based logic + Machine Learning, and broadcasts alerts instantly
using Socket.IO.

This MVP demonstrates:

-   Real-time fleet simulation\
-   MongoDB-backed state management\
-   ML-powered anomaly detection (Python + Node.js integration)\
-   Event-driven alerts\
-   Hackathon-ready backend-first architecture

------------------------------------------------------------------------

## 🧠 Problem Statement

Maritime command centers need:

-   Continuous fleet monitoring\
-   Early detection of abnormal behavior\
-   Instant alerts & decision support\
-   Automation-ready architecture

AMOCS simulates this end-to-end command system in a lightweight MVP.

------------------------------------------------------------------------

## 🏗️ System Architecture (High Level)

    ┌──────────────┐
    │ Ship Simulator│
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  MongoDB     │◀──────── Seed Script
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────┐
    │ Node.js Backend (Express)    │
    │                              │
    │ - Fleet Simulation Engine    │
    │ - Rule-based Anomalies       │
    │ - ML Anomaly Detector        │◀── Python Model
    │ - Socket.IO (Real-time)      │
    │ - REST API (Postman)         │
    └─────────┬────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │ Dashboard / Logs │
    └──────────────────┘

------------------------------------------------------------------------

## 🧰 Tech Stack

  Layer         Technology
  ------------- -------------------------
  Backend       Node.js, Express
  Database      MongoDB (Atlas / Local)
  Real-time     Socket.IO
  ML            Python, scikit-learn
  IPC           Node.js child_process
  API Testing   Postman

------------------------------------------------------------------------

## 📁 Project Structure

    amocs-mvp/
    │
    ├── backend/
    │   ├── models/
    │   │   └── Ship.js
    │   │
    │   ├── simulation/
    │   │   └── dataGenerator.js
    │   │
    │   ├── ml/
    │   │   ├── train_model.py
    │   │   ├── predict.py
    │   │   └── ship_anomaly_model.pkl
    │   │
    │   ├── utils/
    │   │   └── mlPredictor.js
    │   │
    │   ├── services/
    │   │   └── anomalyService.js
    │   │
    │   ├── seedShips.js
    │   ├── server.js
    │   └── package.json
    │
    └── frontend/ (optional)

------------------------------------------------------------------------

## ⚙️ Prerequisites

-   Node.js v18+\
-   Python 3.9+ (3.13 works)\
-   MongoDB Atlas or Local MongoDB\
-   npm\
-   Postman

------------------------------------------------------------------------

## 🚀 Setup & Installation

### 1️⃣ Clone Repository

``` bash
git clone <repo-url>
cd amocs-mvp/backend
```

### 2️⃣ Install Node Dependencies

``` bash
npm install
```

### 3️⃣ MongoDB Setup

**MongoDB Atlas (Recommended)**

Update `server.js`:

``` js
mongoose.connect('mongodb+srv://<user>:<password>@cluster.mongodb.net/amocs')
```

**OR Local MongoDB**

``` bash
mongod
```

------------------------------------------------------------------------

### 4️⃣ Seed Initial Ships

Creates 3 ships in the Bay of Bengal.

``` bash
node seedShips.js
```

Expected:

    ✅ Ships seeded successfully

------------------------------------------------------------------------

## 🤖 Machine Learning Setup

### 📌 Model Purpose

The ML model detects behavioral anomalies using:

-   Speed\
-   Fuel drop\
-   Course change\
-   Latitude delta\
-   Longitude delta

------------------------------------------------------------------------

### 5️⃣ Train ML Model

``` bash
cd backend/ml
python train_model.py
```

Expected:

    ✅ ML model trained & saved

This creates:

    ship_anomaly_model.pkl

⚠️ Do NOT open this file manually --- it is a binary ML model.

------------------------------------------------------------------------

### 6️⃣ Test ML Model (Standalone)

``` bash
python predict.py "{"speed":25,"fuelDrop":30,"courseChange":80,"latDelta":0.002,"lngDelta":0.002}"
```

Expected output:

    ANOMALY

or

    NORMAL

------------------------------------------------------------------------

## 🔗 Node.js ↔ Python Integration

**mlPredictor.js**

Node.js calls Python using `child_process.spawn()`.

``` js
predictAnomaly(features)
```

Python returns:

    ANOMALY
    NORMAL

This result is used inside fleet simulation.

------------------------------------------------------------------------

## 🔁 Fleet Simulation + ML Flow

Every 10 seconds:

-   Ship position updates\
-   Fuel consumption applied\
-   Rule-based anomalies checked\
-   ML model predicts anomaly

If anomaly detected:

-   Ship marked `Anomaly`\
-   Socket.IO alert emitted

------------------------------------------------------------------------

## 📡 Real-Time Socket.IO Events

### Emitted

  Event          Description
  -------------- --------------------
  fleetUpdate    Live fleet state
  anomalyAlert   Rule or ML anomaly

### Received

  Event             Purpose
  ----------------- --------------------------
  overrideCommand   Manual course correction

------------------------------------------------------------------------

## 🧪 API Testing (Postman)

### Trigger Manual Anomaly

    POST http://localhost:3001/api/simulate-anomaly

``` json
{
  "shipId": "SHIP001",
  "anomalyType": "ENGINE_FAILURE"
}
```

------------------------------------------------------------------------

## ▶️ Start Backend

``` bash
node server.js
```

Expected:

    🚀 AMOCS backend running on port 3001
    ✅ MongoDB connected
