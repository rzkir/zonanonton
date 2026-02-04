export type ApiEnv = { apiSecret?: string };

const getApiSecret = (opts?: ApiEnv | string): string => {
    const fromOpts = typeof opts === "object" ? opts?.apiSecret : opts;
    if (fromOpts) return fromOpts;
    const env =
        (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_SECRET) ??
        (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_API_SECRET);
    if (env) return String(env);
    throw new Error("PUBLIC_API_SECRET not configured");
};

export const buildAuthHeaders = (opts?: ApiEnv | string): HeadersInit => {
    const apiSecret = getApiSecret(opts);
    return {
        Authorization: `Bearer ${apiSecret}`,
        "X-API-Key": apiSecret,
        "Content-Type": "application/json",
    };
};
