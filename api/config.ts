import { type Language } from "./types/config.ts";

/**
 * Change the language here
 **/
export const LANGUAGE: Language = {
  // Name of the language in English
  englishName: "Russian",
  // Name of the language in that language
  localName: "Русский",
};

/**
 * Advanced usage; these affects the generated responses from the chat model
 */

export const CHAT_MODEL = "gpt-4.1";
export const TEMPERATURE = 1;

/**
 * For debugging purpose, this will return a set of mock responses for the API endpoints
 */
export const IS_MOCK_MODE = false;
