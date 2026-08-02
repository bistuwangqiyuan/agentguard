import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export type SchemaCheckResult = {
  pass: boolean;
  errors: Array<{ path: string; message: string }>;
};

export function checkSchema(text: string, schema: object | undefined): SchemaCheckResult {
  if (!schema) {
    return { pass: true, errors: [] };
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      pass: false,
      errors: [{ path: "$", message: "text is not valid JSON; schema check requires JSON" }],
    };
  }
  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    return {
      pass: false,
      errors: [
        {
          path: "$schema",
          message: e instanceof Error ? e.message : "invalid JSON Schema",
        },
      ],
    };
  }
  const ok = validate(data);
  if (ok) return { pass: true, errors: [] };
  const errors = (validate.errors || []).map((err: ErrorObject) => ({
    path: err.instancePath || "$",
    message: err.message || "validation failed",
  }));
  return { pass: false, errors };
}
