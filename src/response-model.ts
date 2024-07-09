import OpenAI from "openai";
import { z } from "zod";

import { MODE } from "@/constants/modes";
import {
    OAIBuildFunctionParams,
    OAIBuildJsonModeParams,
    OAIBuildJsonSchemaParams,
    OAIBuildMessageBasedParams,
    OAIBuildToolFunctionParams
} from "@/oai/params";

import { Mode, ModeParamsReturnType, ResponseModel } from "./types";
import { getSchemaDefinition } from "./utils/getSchemaDefinition";

export function withResponseModel<
  T extends z.AnyZodObject,
  M extends Mode,
  P extends OpenAI.ChatCompletionCreateParams
>({
  response_model: { name, schema, description = "" },
  mode,
  params,
}: {
  response_model: ResponseModel<T>;
  mode: M;
  params: P;
}): ModeParamsReturnType<P, M> {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, "_").replace(/\s/g, "_");

  const definition = getSchemaDefinition({ name: safeName, schema, description });

  if (mode === MODE.FUNCTIONS) {
    return OAIBuildFunctionParams<P>(definition, params) as ModeParamsReturnType<P, M>;
  }

  if (mode === MODE.TOOLS) {
    return OAIBuildToolFunctionParams<P>(definition, params) as ModeParamsReturnType<P, M>;
  }

  if (mode === MODE.JSON) {
    return OAIBuildJsonModeParams<P>(definition, params) as ModeParamsReturnType<P, M>;
  }

  if (mode === MODE.JSON_SCHEMA) {
    return OAIBuildJsonSchemaParams<P>(definition, params) as ModeParamsReturnType<P, M>;
  }

  if (mode === MODE.MD_JSON) {
    return OAIBuildMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>;
  }

  return OAIBuildMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>;
}
