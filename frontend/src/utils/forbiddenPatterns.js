const forbiddenPatterns = [
    /<script.*?>.*?<\/script.*?>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /<.*?>/g,
    /drop\s+table/gi,
    /union\s+select/gi,
    /\b(alert|prompt|confirm)\b/gi,
];

export const validateSafeInput = (value) => {
    if (typeof value !== "string") return { safe: true };

    for (const pattern of forbiddenPatterns) {
        if (pattern.test(value)) {
            return { safe: false, message: "Incorrect input: prohibited content" };
        }
    }

    return { safe: true };
};
