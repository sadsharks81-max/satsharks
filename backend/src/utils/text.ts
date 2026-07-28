export const stripEmojis = (value: string | undefined | null): string => {
  if (!value) return "";
  return value
    .replace(/\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?/gu, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    .replace(/[0-9#*]\uFE0F?\u20E3/gu, "")
    .replace(/\u200D/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
};
