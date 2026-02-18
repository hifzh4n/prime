const rateLimitMap = new Map<string, { count: number, lastReset: number }>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateData.lastReset > windowMs) {
        rateData.count = 1;
        rateData.lastReset = now;
    } else {
        rateData.count++;
    }

    rateLimitMap.set(ip, rateData);

    return rateData.count <= limit;
}
