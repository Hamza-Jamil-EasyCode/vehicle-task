import pool from "@backend/lib/db";
import { sendResponse } from "@backend/utils/utils";
import { PoolClient } from "pg";
import { VehicleService } from "./vehicle.service";
import { VehicleInput } from "./vehicle.validator";

type VehicleResult = {
  submissionId: string;
  jobId: string;
  status: string;
  vin: string;
};

function buildBatchSuccessResponse(vehicles: VehicleResult[]) {
  return sendResponse(
    true,
    { vehicles, count: vehicles.length },
    201,
    "Vehicles added successfully",
  );
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

async function getOrCreateJob(submissionId: string, client?: PoolClient) {
  const existingJob = await VehicleService.getJobBySubmissionId(
    submissionId,
    client,
  );

  if (existingJob) {
    return existingJob;
  }

  return VehicleService.createJob(submissionId, client);
}

async function createVehicleWithClient(
  vehicle: VehicleInput,
  client: PoolClient,
  idempotencyKey: string | null = null,
): Promise<VehicleResult> {
  const submission = await VehicleService.createSubmission(
    vehicle.submitted_by,
    vehicle,
    idempotencyKey,
    client,
  );
  const job = await VehicleService.createJob(submission.id, client);

  return {
    submissionId: submission.id,
    jobId: job.id,
    status: job.status,
    vin: vehicle.vin,
  };
}

async function handleIdempotentRequest(
  vehicle: VehicleInput,
  idempotencyKey: string,
) {
  const existingSubmission =
    await VehicleService.getSubmissionByIdempotencyKey(idempotencyKey);

  if (existingSubmission) {
    const job = await getOrCreateJob(existingSubmission.id);
    return buildBatchSuccessResponse([
      {
        submissionId: existingSubmission.id,
        jobId: job.id,
        status: job.status,
        vin: vehicle.vin,
      },
    ]);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    try {
      const result = await createVehicleWithClient(
        vehicle,
        client,
        idempotencyKey,
      );
      await client.query("COMMIT");
      return buildBatchSuccessResponse([result]);
    } catch (error) {
      await client.query("ROLLBACK");

      if (!isUniqueViolation(error)) {
        throw error;
      }

      const submission =
        await VehicleService.getSubmissionByIdempotencyKey(idempotencyKey);

      if (!submission) {
        throw error;
      }

      const job = await getOrCreateJob(submission.id);

      return buildBatchSuccessResponse([
        {
          submissionId: submission.id,
          jobId: job.id,
          status: job.status,
          vin: vehicle.vin,
        },
      ]);
    }
  } finally {
    client.release();
  }
}

const addVehicles = async (
  vehicles: VehicleInput[],
  idempotencyKey?: string,
) => {
  try {
    if (idempotencyKey && vehicles.length === 1) {
      return await handleIdempotentRequest(vehicles[0], idempotencyKey);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const results: VehicleResult[] = [];

      for (const vehicle of vehicles) {
        const result = await createVehicleWithClient(vehicle, client);
        results.push(result);
      }

      await client.query("COMMIT");

      return buildBatchSuccessResponse(results);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding vehicles:", error);
    return sendResponse(false, null, 500, "Failed to add vehicles");
  }
};

export const VehicleController = {
  addVehicles,
};
