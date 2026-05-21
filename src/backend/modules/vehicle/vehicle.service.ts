import pool from "@backend/lib/db";
import { PoolClient } from "pg";
import { VehicleInput } from "./vehicle.validator";

const getSubmissionByIdempotencyKey = async (
  idempotencyKey: string,
  client?: PoolClient,
) => {
  const db = client ?? pool;
  const { rows } = await db.query(
    `SELECT id FROM vehicle_submissions WHERE idempotency_key = $1`,
    [idempotencyKey],
  );

  return (rows[0] as { id: string }) ?? null;
};

const getJobBySubmissionId = async (
  submissionId: string,
  client?: PoolClient,
) => {
  const db = client ?? pool;
  const { rows } = await db.query(
    `SELECT id, status
     FROM vehicle_jobs
     WHERE submission_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [submissionId],
  );

  return (rows[0] as { id: string; status: string }) ?? null;
};

const createSubmission = async (
  userId: string,
  payload: VehicleInput,
  idempotencyKey: string | null = null,
  client?: PoolClient,
) => {
  const db = client ?? pool;
  const { rows } = await db.query(
    `INSERT INTO vehicle_submissions (user_id, payload, idempotency_key)
     VALUES ($1, $2::jsonb, $3)
     RETURNING id`,
    [userId, JSON.stringify(payload), idempotencyKey],
  );

  return rows[0] as { id: string };
};

const createJob = async (submissionId: string, client?: PoolClient) => {
  const db = client ?? pool;
  const { rows } = await db.query(
    `INSERT INTO vehicle_jobs (submission_id, status, progress)
     VALUES ($1, 'pending', '{}'::jsonb)
     RETURNING id, status`,
    [submissionId],
  );

  return rows[0] as { id: string; status: string };
};

export const VehicleService = {
  getSubmissionByIdempotencyKey,
  getJobBySubmissionId,
  createSubmission,
  createJob,
};
