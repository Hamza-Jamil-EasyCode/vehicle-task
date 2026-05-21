CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS vehicle_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  payload jsonb NOT NULL,
  idempotency_key text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_vehicle_submissions_idempotency
  ON vehicle_submissions(idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS vehicle_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES vehicle_submissions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  progress jsonb DEFAULT '{}'::jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
