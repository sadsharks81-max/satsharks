export function isValidHttpsUrl(value: string): boolean {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function looksLikeGoogleMeetLink(value: string): boolean {
  return /meet\.google\.com/i.test(value);
}
