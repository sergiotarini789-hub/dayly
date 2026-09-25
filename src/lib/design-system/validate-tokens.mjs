#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const here = resolvePath(fileURLToPath(new URL(".", import.meta.url)));
const tokenPath = resolvePath(here, "../../styles/tokens.css");
const css = readFileSync(tokenPath, "utf8");
const failures = [];

const requiredSemanticColors = [
  "background",
  "surface",
  "surface-elevated",
  "surface-hover",
  "surface-selected",
  "border",
  "border-subtle",
  "text-primary",
  "text-secondary",
  "text-muted",
  "text-disabled",
  "primary",
  "primary-hover",
  "primary-active",
  "primary-subtle",
  "primary-foreground",
  "success",
  "warning",
  "danger",
  "info",
  "focus",
  "task",
  "scheduled-task",
  "calendar-event",
  "external-event",
  "habit",
  "overdue",
  "completed",
];

const requiredPrimitives = [
  "--primitive-color-neutral-50",
  "--primitive-color-indigo-600",
  "--primitive-font-family-interface",
  "--primitive-space-4",
  "--primitive-radius-md",
  "--primitive-shadow-sm",
  "--primitive-duration-fast",
  "--primitive-breakpoint-tablet",
  "--primitive-z-modal",
];

const requiredThemeFeatures = [
  '@import "tailwindcss";',
  "@theme inline",
  "@custom-variant dark",
  "@media (prefers-color-scheme: dark)",
  "@media (prefers-reduced-motion: reduce)",
  "--transition-duration-fast: var(--dayly-duration-fast)",
];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function declarationBlock(pattern, label) {
  const match = css.match(pattern);
  assert(match, `${label} block is missing`);
  return match?.[1] ?? "";
}

function parseDeclarations(block) {
  const values = new Map();
  for (const match of block.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    const [, name, value] = match;
    if (values.has(name)) failures.push(`duplicate declaration in one block: ${name}`);
    values.set(name, value.trim());
  }
  return values;
}

function resolveValue(name, values, seen = new Set()) {
  if (seen.has(name)) throw new Error(`cyclic token reference: ${name}`);
  const value = values.get(name);
  if (!value) throw new Error(`missing token reference: ${name}`);
  const nextSeen = new Set(seen).add(name);
  return value.replace(/var\((--[\w-]+)\)/g, (_, reference) =>
    resolveValue(reference, values, nextSeen),
  );
}

function hexToRgb(value) {
  const match = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1];
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
}

function relativeLuminance(rgb) {
  const linearChannels = rgb.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linearChannels[0] + 0.7152 * linearChannels[1] + 0.0722 * linearChannels[2];
}

function contrastRatio(foreground, background) {
  const foregroundRgb = hexToRgb(foreground);
  const backgroundRgb = hexToRgb(background);
  if (!foregroundRgb || !backgroundRgb) return null;
  const foregroundLuminance = relativeLuminance(foregroundRgb);
  const backgroundLuminance = relativeLuminance(backgroundRgb);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(values, label, foreground, background, minimum = 4.5) {
  try {
    const foregroundValue = resolveValue(foreground, values);
    const backgroundValue = resolveValue(background, values);
    const ratio = contrastRatio(foregroundValue, backgroundValue);
    assert(ratio !== null, `${label} uses a non-hex value that this check cannot inspect`);
    if (ratio !== null) {
      assert(ratio >= minimum, `${label} contrast is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`);
    }
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
}

for (const feature of requiredThemeFeatures) {
  assert(css.includes(feature), `missing theme feature: ${feature}`);
}
for (const primitive of requiredPrimitives) {
  assert(css.includes(`${primitive}:`), `missing primitive token: ${primitive}`);
}

const rootBlock = declarationBlock(/^:root\s*\{([\s\S]*?)^\}/m, "light root");
const darkBlock = declarationBlock(/^:root\[data-theme="dark"\]\s*\{([\s\S]*?)^\}/m, "explicit dark theme");
const rootValues = parseDeclarations(rootBlock);
const darkValues = new Map([...rootValues, ...parseDeclarations(darkBlock)]);

for (const token of requiredSemanticColors) {
  const publicName = `--color-${token}`;
  const backingName = `--dayly-color-${token}`;
  assert(rootValues.has(publicName), `missing light semantic token: ${publicName}`);
  assert(rootValues.has(backingName), `missing light semantic backing: ${backingName}`);
  assert(parseDeclarations(darkBlock).has(backingName), `missing dark semantic backing: ${backingName}`);
  assert((rootBlock.match(new RegExp(`^\\s*${publicName.replaceAll("-", "\\-")}\\s*:`, "gm")) ?? []).length === 1, `duplicate light semantic token: ${publicName}`);
}

const focusTokens = ["--focus-ring-color", "--focus-ring-width", "--focus-ring-offset", "--focus-ring-inset"];
for (const token of focusTokens) assert(rootValues.has(token), `missing focus token: ${token}`);

const motionBlock = declarationBlock(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{([\s\S]*?)^\s*\}\s*\}/m, "reduced-motion");
for (const token of ["--dayly-duration-fast", "--dayly-duration-normal", "--dayly-ease-standard"]) {
  assert(parseDeclarations(motionBlock).has(token), `missing reduced-motion override: ${token}`);
}

// Check the text and foreground pairings that are intended to meet WCAG AA.
for (const theme of [
  ["light", rootValues],
  ["dark", darkValues],
]) {
  const [label, values] = theme;
  checkContrast(values, `${label} primary text on background`, "--dayly-color-text-primary", "--dayly-color-background");
  checkContrast(values, `${label} secondary text on background`, "--dayly-color-text-secondary", "--dayly-color-background");
  checkContrast(values, `${label} muted text on background`, "--dayly-color-text-muted", "--dayly-color-background");
  for (const semantic of ["primary", "success", "warning", "danger", "info", "task", "scheduled-task", "calendar-event", "external-event", "habit", "focus", "overdue", "completed"]) {
    checkContrast(values, `${label} ${semantic} foreground`, `--dayly-color-${semantic}-foreground`, `--dayly-color-${semantic}`);
  }
  for (let series = 1; series <= 8; series += 1) {
    checkContrast(values, `${label} chart series ${series}`, `--dayly-color-chart-${series}`, "--dayly-color-surface", 3);
  }
}

if (failures.length > 0) {
  console.error("Dayly token validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Dayly token validation passed: primitives, semantic themes, reduced motion, Tailwind bridge, focus tokens, and WCAG AA pairings are present.");
}
