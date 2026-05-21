import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();

export const vehicleSchema = z.object({
  submitted_by: z
    .string()
    .trim()
    .min(1, "Submitted by is required")
    .max(100, "Submitted by must be 100 characters or fewer")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Submitted by contains invalid characters"),

  vin: z
    .string()
    .trim()
    .length(17, "VIN must be exactly 17 characters")
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/i,
      "VIN contains invalid characters (I, O, Q are not allowed)",
    )
    .transform((val) => val.toUpperCase()),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .max(50, "Make must be 50 characters or fewer")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Make contains invalid characters"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(100, "Model must be 100 characters or fewer")
    .regex(/^[a-zA-Z0-9\s\-\/]+$/, "Model contains invalid characters"),

  year: z
    .number({ error: "Year must be a number" })
    .int("Year must be a whole number")
    .min(1886, "Year must be 1886 or later")
    .max(CURRENT_YEAR + 1, `Year cannot exceed ${CURRENT_YEAR + 1}`),

  trim: z
    .string()
    .trim()
    .max(100, "Trim must be 100 characters or fewer")
    .optional()
    .nullable(),

  mileage: z
    .number({ error: "Mileage must be a number" })
    .int("Mileage must be a whole number")
    .min(0, "Mileage cannot be negative")
    .max(1_000_000, "Mileage cannot exceed 1,000,000"),

  asking_price: z
    .number({ error: "Asking price must be a number" })
    .positive("Asking price must be greater than 0")
    .max(10_000_000, "Asking price cannot exceed $10,000,000")
    .multipleOf(0.01, "Asking price can have at most 2 decimal places"),

  location: z.object({
    zip: z.string().trim().min(1, "Zip is required"),
    lat: z.number().finite("Latitude must be a valid number"),
    lng: z.number().finite("Longitude must be a valid number"),
  }),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2,000 characters or fewer")
    .optional()
    .nullable(),

  timestamp: z
    .string()
    .trim()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid timestamp format"),
});

const vehiclesArraySchema = z
  .array(vehicleSchema)
  .min(1, "At least one vehicle is required")
  .max(50, "Cannot submit more than 50 vehicles at once");

export const vehiclesSubmissionSchema = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return { vehicles: value };
    }
    return value;
  },
  z.object({
    vehicles: vehiclesArraySchema,
  }),
);

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehiclesSubmissionInput = z.infer<typeof vehiclesSubmissionSchema>;
