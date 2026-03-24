import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;

function getKey(): Buffer {
  const raw = process.env.MAIL_ENCRYPTION_KEY ?? process.env.BETTER_AUTH_SECRET ?? "";
  return Buffer.from(raw.padEnd(KEY_LEN, "0").slice(0, KEY_LEN));
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return [iv.toString("hex"), cipher.getAuthTag().toString("hex"), data.toString("hex")].join(":");
}

export function decrypt(ciphertext: string): string {
  const [ivHex, tagHex, dataHex] = ciphertext.split(":");
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString(
    "utf8",
  );
}
