import { cookies } from "next/headers";
import { verifyAccessToken } from "@backend/utils/jwt";

/**
 * Resolves the authenticated userId from the accessToken HTTP-only cookie.
 *
 * By the time any server component renders, the middleware in src/middleware.ts
 * has already verified the access token and transparently refreshed it if it
 * was expired (by calling /api/auth?type=refresh and forwarding the new
 * Set-Cookie headers). Therefore verifyAccessToken should always succeed here.
 */
async function resolveAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decoded = verifyAccessToken(accessToken);
    return decoded.userId;
  } catch {
    return null;
  }
}

/**
 * Runs a server-side data-fetching callback as the authenticated user.
 * Returns null if authentication cannot be established.
 *
 * Token refresh is handled transparently by the middleware before this
 * function is ever called, so no manual retry logic is needed here.
 *
 * @example
 * const result = await withAuth((userId) => ChatController.getUserChats(userId));
 */
export async function withAuth<T>(
  fn: (userId: string) => Promise<T>,
): Promise<T | null> {
  const userId = await resolveAuthenticatedUserId();
  if (!userId) return null;
  return fn(userId);
}
