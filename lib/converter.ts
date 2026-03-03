import { XMLBuilder } from "fast-xml-parser";
import Papa from "papaparse";

/**
 * Converts a JSON object to an XML string.
 * Uses fast-xml-parser for conversion.
 * @param json - The JSON object to convert
 * @returns XML string
 */
export function jsonToXml(json: any): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });
  return builder.build(json);
}

/**
 * Converts a JSON object to an escaped JSON string.
 * This effectively double-stringifies the JSON.
 * @param json - The JSON object to convert
 * @returns Escaped JSON string
 */
export function jsonToString(json: any): string {
  return JSON.stringify(JSON.stringify(json));
}
