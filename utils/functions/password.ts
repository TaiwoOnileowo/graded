"use server";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// const JWT_SECRET = process.env.JWT_SECRET;
// import { v4 as uuidv4 } from "uuid";
// import { redis } from "@/lib/redis";

// interface ResetToken {
//   userId: string;
//   email: string;
//   tokenId: string;
// }

// export const generateResetToken = async (payload: {
//   userId: string;
//   email: string;
// }) => {
//   if (!JWT_SECRET) {
//     throw new Error("JWT_SECRET is not defined");
//   }
//   const tokenId = uuidv4();
//   const tokenPayload: ResetToken = {
//     ...payload,
//     tokenId,
//   };

//   const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

//   // Store token in Redis with 1 hour expiration
//   // Key format: reset_token:{userId}:{tokenId}
//   const tokenKey = `reset_token:${payload.userId}:${tokenId}`;

//   // First, invalidate any existing tokens for this user
//   await invalidateUserTokens(payload.userId);

//   // Store new token
//   await redis.set(tokenKey, "valid", {
//     ex: 60 * 60, // 1 hour in seconds
//   });

//   return token;
// };

// export const verifyResetToken = async (token: string) => {
//   try {
//     if (!JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined");
//     }
//     const decoded = jwt.verify(token, JWT_SECRET) as ResetToken;

//     // Check if token is still valid in Redis
//     const tokenKey = `reset_token:${decoded.userId}:${decoded.tokenId}`;
//     const isValid = await redis.get(tokenKey);

//     if (!isValid) {
//       return null;
//     }

//     return decoded;
//   } catch (error) {
//     return null;
//   }
// };

// export const invalidateUserTokens = async (userId: string) => {
//   // Get all reset tokens for this user
//   const pattern = `reset_token:${userId}:*`;
//   const keys = await redis.keys(pattern);

//   if (keys.length > 0) {
//     // Delete all existing tokens
//     await redis.del(...keys);
//   }
// };

// export const checkRateLimit = async (userId: string): Promise<boolean> => {
//   const rateLimitKey = `reset_ratelimit:${userId}`;
//   const attempts = await redis.incr(rateLimitKey);

//   if (attempts === 1) {
//     // Set expiry for rate limit key
//     await redis.expire(rateLimitKey, 60 * 60); // 1 hour
//   }

//   return attempts <= 5; // Allow 5 attempts per hour
// };

// export const markTokenUsed = async (userId: string, tokenId: string) => {
//   const tokenKey = `reset_token:${userId}:${tokenId}`;
//   await redis.del(tokenKey);
// };
