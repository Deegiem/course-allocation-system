/**
 * Converts strings like:
 * AUTO_ALLOCATED -> Auto Allocated
 * machine_learning -> Machine Learning
 * operating-system -> Operating System
 */

export const formatEnum = (value?: string | null): string => {
  if (!value) return "";

  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatPersonName = (name?: string | null): string => {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export const capitalize = (text?: string | null): string => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};