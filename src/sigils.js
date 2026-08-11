import { ok, error } from "./core.js";

// Sigil ~H: parses an HTML string, returns a DocumentFragment or HTMLElement
export const H = (strings, ...values) => {
  const html = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.children.length === 1
    ? template.content.firstElementChild
    : template.content;
};

// Sigil ~J: parses JSON safely (never throws)
export const J = (strings, ...values) => {
  const jsonStr = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
  try {
    return ok(JSON.parse(jsonStr));
  } catch (e) {
    return error(e.message);
  }
};
