import crypto from "crypto";

/**
 * Generate a random webhook secret for HMAC signature verification
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate HMAC signature for webhook payload
 * @param secret - The webhook secret
 * @param payload - The request body as string
 * @returns HMAC signature in hex format
 */
export function generateWebhookSignature(
  secret: string,
  payload: string
): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

/**
 * Verify webhook signature using constant-time comparison
 * @param secret - The webhook secret
 * @param payload - The request body as string
 * @param signature - The signature from the request header
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  secret: string,
  payload: string,
  signature: string
): boolean {
  const expectedSignature = generateWebhookSignature(secret, payload);

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    // If buffers are not the same length, timingSafeEqual throws
    return false;
  }
}
