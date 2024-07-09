import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { ResponseModel } from "../";

export const getSchemaDefinition = <T extends z.AnyZodObject>({
  name,
  schema,
  description = "",
}: ResponseModel<T>) => {
  // if typeof schema is zod object, do it as in response-model.ts
  // if not, return schema directly
  if (schema instanceof z.ZodObject) {
    const { definitions } = zodToJsonSchema(schema, {
      name: name,
      errorMessages: true,
    });

    if (!definitions || !definitions?.[name]) {
      console.warn("Could not extract json schema definitions from your schema", schema);
      throw new Error("Could not extract json schema definitions from your schema");
    }

    return {
      name: name,
      description,
      ...definitions[name],
    };
  } else {
    return {
      name,
      description,
      ...schema,
    };
  }
};
