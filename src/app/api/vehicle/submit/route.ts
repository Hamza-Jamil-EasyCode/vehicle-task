import { VehicleController } from "@backend/modules/vehicle/vehicle.controller";
import { vehiclesSubmissionSchema } from "@backend/modules/vehicle/vehicle.validator";
import { formatZodError } from "@common/common";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = vehiclesSubmissionSchema.parse(body);

    const idempotencyKey = req.headers.get("idempotency-key")?.trim() || undefined;

    const response = await VehicleController.addVehicles(
      validatedBody.vehicles,
      idempotencyKey,
    );

    return NextResponse.json(response, { status: response.statusCode });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        status: 400,
        error: "validation_error",
        details: formatZodError(error, "vehicles"),
      }, { status: 400 });
    }

    console.error("Error processing vehicle submission:", error);
    return NextResponse.json(
      { error: "Failed to process vehicle submission" },
      { status: 500 },
    );
  }
}
