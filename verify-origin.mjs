// Obtain this verifier from https://github.com/carrotProgrammer/zhixu-cpa
// before checking a package received from someone else. No network or writes.
import { createHash, createPublicKey, verify } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const trustedSpkiBase64 = "MCowBQYDK2VwAyEAzygPWwNkBRy9FFUDp/BSObEeZF1yRy8P13VnqNhlAnY=";
const repository = "https://github.com/carrotProgrammer/zhixu-cpa";
const excluded = new Set([".wrangler", "node_modules", "backups", ".git", ".DS_Store"]);

try {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--root")) throw new Error("Usage: node verify-origin.mjs [--root <study-folder>]");
  const root = path.resolve(args[1] ?? fileURLToPath(new URL("./", import.meta.url)));
  const manifestFile = path.join(root, "provenance/manifest.json");
  const signatureFile = path.join(root, "provenance/manifest.sig");
  const provenance = await lstat(path.join(root, "provenance"));
  if (!provenance.isDirectory() || provenance.isSymbolicLink()) throw new Error("Invalid provenance directory");
  await requireRegular(manifestFile, 4 * 1024 * 1024);
  await requireRegular(signatureFile, 256);
  const bytes = await readFile(manifestFile);
  const signature = Buffer.from((await readFile(signatureFile, "utf8")).trim(), "base64");
  const keyBytes = Buffer.from(trustedSpkiBase64, "base64");
  const key = createPublicKey({ key: keyBytes, type: "spki", format: "der" });
  if (key.asymmetricKeyType !== "ed25519" || signature.length !== 64 || !verify(null, bytes, key, signature)) throw new Error("Official signature is missing or invalid. This package's origin cannot be confirmed.");
  const manifest = JSON.parse(bytes.toString("utf8"));
  if (manifest.schema !== 1 || manifest.algorithm !== "Ed25519" || manifest.repository !== repository
    || manifest.keyId !== createHash("sha256").update(keyBytes).digest("hex")
    || !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 10000) throw new Error("Unsupported official manifest");
  const expected = new Set();
  const failures = [];
  for (const file of manifest.files) {
    if (!file || typeof file !== "object") throw new Error("Invalid manifest file entry");
    const relative = file.path;
    if (typeof relative !== "string" || relative.includes("\\") || relative.includes(":") || relative.startsWith("/")
      || relative.split("/").some((part) => !part || part === "." || part === ".." || excluded.has(part)
        || [...part].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || /[. ]$/.test(part))
      || expected.has(relative) || !Number.isSafeInteger(file.bytes) || file.bytes < 0 || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error("Invalid manifest file entry");
    expected.add(relative);
    let current = root;
    try {
      for (const part of relative.split("/")) {
        current = path.join(current, part);
        if ((await lstat(current)).isSymbolicLink()) throw new Error("Symbolic links are not verified");
      }
      const info = await requireRegular(current, file.bytes);
      if (info.size !== file.bytes || await hashFile(current) !== file.sha256) failures.push(`CHANGED ${relative}`);
    } catch { failures.push(`MISSING_OR_INVALID ${relative}`); }
  }
  for (const relative of await filesIn(root)) {
    if (!expected.has(relative) && relative !== "provenance/manifest.json" && relative !== "provenance/manifest.sig") failures.push(`UNEXPECTED ${relative}`);
  }
  if (failures.length) {
    console.error(failures.slice(0, 50).join("\n"));
    throw new Error(`${failures.length} file(s) differ from the official package. Keep your learning records and download a clean official copy.`);
  }
  console.log(`PASS: official ${manifest.product} ${manifest.version}; ${expected.size} files match the signed manifest.`);
  console.log(`Author: ${manifest.author}\nOfficial repository: ${repository}\nKey SHA-256: ${manifest.keyId}`);
  console.log("Local learning records are excluded. This checks distribution integrity, not ownership of third-party teaching material.");
} catch (error) {
  console.error(`NOT VERIFIED: ${error.message}`);
  process.exitCode = 1;
}

async function requireRegular(filename, limit) {
  const info = await lstat(filename);
  if (!info.isFile() || info.isSymbolicLink() || info.size > limit) throw new Error("Invalid file");
  return info;
}
async function hashFile(filename) {
  const hash = createHash("sha256");
  for await (const bytes of createReadStream(filename)) hash.update(bytes);
  return hash.digest("hex");
}
async function filesIn(root, relative = "") {
  const files = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    if (excluded.has(entry.name) || (!relative && /^(?:npm-debug\.log|\.env(?:\.|$))/.test(entry.name))) continue;
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) { files.push(name); continue; }
    if (entry.isDirectory()) files.push(...await filesIn(root, name));
    else files.push(name);
  }
  return files;
}
