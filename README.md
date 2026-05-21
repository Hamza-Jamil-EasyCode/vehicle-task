# True Nest Auto

Next.js app for vehicle submissions with a simulated job stream (SSE).

## Run locally

```bash
npm install
```

Create `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/true_nest_auto
NEXT_PUBLIC_APP_NAME=True Nest Auto
```

Apply the schema:

```bash
psql $DATABASE_URL -f src/backend/migrations/init.sql
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## `POST /api/vehicle/submit`

Submits one or more vehicles. Each vehicle gets a `submissionId` and `jobId`.

**Headers (optional)**

| Header | Notes |
|--------|--------|
| `Idempotency-Key` | Supported for a **single** vehicle. Replays return the same submission/job. |

**Body**

Wrap vehicles in a `vehicles` array, or send the array directly.

```json
{
  "vehicles": [
    {
      "submitted_by": "John Doe",
      "vin": "1HGCM82633A123456",
      "make": "Honda",
      "model": "Accord",
      "year": 2020,
      "trim": "EX",
      "mileage": 45000,
      "asking_price": 18500.00,
      "location": { "zip": "90210", "lat": 34.09, "lng": -118.41 },
      "notes": "Clean title",
      "timestamp": "2026-05-21T12:00:00.000Z"
    }
  ]
}
```

| Field | Rules |
|-------|--------|
| `submitted_by` | 1–100 chars, alphanumeric, spaces, hyphens |
| `vin` | 17 chars, no I/O/Q |
| `make` / `model` | Required, length limits apply |
| `year` | 1886 – (current year + 1) |
| `mileage` | 0 – 1,000,000 |
| `asking_price` | > 0, max 2 decimal places |
| `location` | `zip`, `lat`, `lng` required |
| `trim` / `notes` | Optional |
| `timestamp` | Valid ISO date string |

Batch limit: **1–50** vehicles per request.

**Success (201)**

```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "submissionId": "uuid",
        "jobId": "uuid",
        "status": "pending",
        "vin": "1HGCM82633A123456"
      }
    ],
    "count": 1
  },
  "statusCode": 201,
  "message": "Vehicles added successfully"
}
```

**Errors**

| Status | When | Shape |
|--------|------|--------|
| `400` | Validation failed | `{ "status": 400, "error": "validation_error", "details": [{ "field": "vehicles.0.vin", "message": "..." }] }` |
| `500` | Server / DB error | `{ "error": "Failed to process vehicle submission" }` or `{ "success": false, "message": "Failed to add vehicles", ... }` |

---

## `GET /api/vehicle/jobs/{jobId}/stream`

Server-Sent Events endpoint. **Simulated only** — it does not read job state from the database. Any `jobId` works (e.g. `abc123`).

**Events** (≈2s apart)

| Event | Payload |
|-------|---------|
| `connected` | `{ "message": "SSE connection established", "jobId": "..." }` |
| `progress` | `{ "jobId": "...", "progress": 10\|40\|70, "step": "..." }` |
| `completed` | `{ "jobId": "...", "progress": 100, "step": "completed" }` |

Connect with `EventSource` or any SSE client:

```
GET /api/vehicle/jobs/abc123/stream
Accept: text/event-stream
```

---

## UI — Landing page

Home page (`/`) includes an **SSE demo** (no real submit flow).

1. Click **Simulate Server Events**.
2. The app opens `/api/vehicle/jobs/abc123/stream`.
3. Skeleton loaders show while connecting; each event appears in an `AppCard` with type, step, and progress.

Use this page to preview the stream UX before wiring it to real `jobId` values from submit responses.
