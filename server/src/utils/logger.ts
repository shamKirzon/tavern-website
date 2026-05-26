const SENSITIVE_FIELDS = ["password", "otp", "token", "api_key"];

export const logger = {
  info: (message: string, data?: any) => {
    console.log(
      `[INFO] ${new Date().toISOString()}: ${message}`,
      sanitize(data),
    );
  },
  error: (message: string, error: any) => {
    // Only log the message and basic details, avoid logging the full request object
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, {
      message: error instanceof Error ? error.message : error,
      code: error?.code,
    });
  },
  warn: (message: string, data?: any) => {
    console.warn(
      `[WARN] ${new Date().toISOString()}: ${message}`,
      sanitize(data),
    );
  },
};

function sanitize(data: any): any {
  if (!data || typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }

  const cleanData = { ...data };
  SENSITIVE_FIELDS.forEach((field) => {
    if (field in cleanData) {
      cleanData[field] = "********";
    }
  });

  // Recursively sanitize nested objects
  for (const key in cleanData) {
    if (typeof cleanData[key] === "object") {
      cleanData[key] = sanitize(cleanData[key]);
    }
  }

  return cleanData;
}
