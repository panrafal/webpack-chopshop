import pako from "pako";

const DEFLATE_HEADER = "deflate:";
export const encodeUrlStateHash = (state: any) =>
  btoa(
    DEFLATE_HEADER +
      pako.deflate(JSON.stringify(state), { to: "string", level: 9 })
  );

export const decodeUrlStateHash = (hash: string) => {
  try {
    const decoded = atob(hash);
    const json = decoded.startsWith(DEFLATE_HEADER)
      ? pako.inflate(decoded.slice(DEFLATE_HEADER.length), { to: "string" })
      : decoded;
    const state = JSON.parse(json);
    if (!state || typeof state !== "object")
      throw new Error(`Url is not an object`);
    return state;
  } catch (error) {
    console.error("Decoding url failed", error);
    return {};
  }
};
