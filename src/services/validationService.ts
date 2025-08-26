import { RuleType, ModeType } from "../types/rules";


export const validateRules = (
    data: any, 
    rule: RuleType): (number | string)[] => {
    const { values, mode } = data ?? {};

    if (!Array.isArray(values) || !values.length) {
        throw new Error("`values` must be a non-empty array");
    }

    if (mode !== "whitelist" && mode !== "blacklist") {
        throw new Error("`mode` must be 'whitelist' or 'blacklist'");
    }

    let cleaned: (string | number)[] = [];

    switch (rule) {
        case "port":
            cleaned = values.filter(v => typeof v === "number");
            break;

        case "url":
            cleaned = values
            .filter(v => typeof v === "string")
            .map(v => v.trim().toLowerCase())
            .filter(Boolean);
            break;

        case "ip":
            cleaned = values
            .filter(v => typeof v === "string")
            .map(v => v.trim())
            .filter(Boolean);
            break;
    }

    if (!cleaned.length) {
        throw new Error("Cleaned array is empty");
    }

    return cleaned;
};
