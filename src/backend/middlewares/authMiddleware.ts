import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, JWTPayload } from "@backend/utils/jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export const authenticateToken = async (
  req: NextRequest,
): Promise<AuthenticatedRequest> => {
  const authHeader = req.headers.get("authorization");
  const token =
    (authHeader && authHeader.split(" ")[1]) ||
    req.cookies.get("accessToken")?.value;

  if (!token) {
    throw new Error("Access token required");
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = decoded;
    return req as AuthenticatedRequest;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const authMiddleware = async (
  req: NextRequest,
): Promise<NextResponse | AuthenticatedRequest> => {
  try {
    return await authenticateToken(req);
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        statusCode: 401,
        message: "Authentication failed",
      },
      { status: 401 },
    );
  }
};
