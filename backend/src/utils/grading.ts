/**
 * Checks if the student's answer is correct against the defined correct answer.
 * Handles exact matching, case insensitivity, trimmed spaces, multiple possible
 * answers (separated by 'or', ',', ';'), and numerical equivalence (e.g. 0.5, .5, 1/2).
 */
export const checkAnswerCorrectness = (correctAnswer: string, studentAnswer: string): boolean => {
  if (!correctAnswer || !studentAnswer) return false;

  const normalizedStudent = studentAnswer.trim().toLowerCase();

  // Split correct answer by separators: ' or ', ',', ';'
  const correctOptions = correctAnswer
    .split(/,\s*|;\s*|\s+or\s+/i)
    .map(opt => opt.trim().toLowerCase())
    .filter(opt => opt.length > 0);

  if (correctOptions.length === 0) {
    correctOptions.push(correctAnswer.trim().toLowerCase());
  }

  // Check if there is an exact string match (case-insensitive) after trimming
  if (correctOptions.includes(normalizedStudent)) {
    return true;
  }

  // Helper to parse strings like "1/2", "0.5", or ".5" into numbers
  const parseNumericValue = (str: string): number | null => {
    const trimmed = str.trim();
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return parseFloat(trimmed);
    }
    // Check if it's a fraction like "1/2" or "-1/2"
    const fractionMatch = trimmed.match(/^((-?\d+)\/(\d+))$/);
    if (fractionMatch) {
      const num = parseInt(fractionMatch[2], 10);
      const den = parseInt(fractionMatch[3], 10);
      if (den !== 0) {
        return num / den;
      }
    }
    // Check if it starts with . e.g. ".5" or "-.5"
    if (/^-?\.\d+$/.test(trimmed)) {
      return parseFloat(trimmed);
    }
    return null;
  };

  const studentVal = parseNumericValue(normalizedStudent);
  if (studentVal !== null) {
    for (const opt of correctOptions) {
      const optVal = parseNumericValue(opt);
      if (optVal !== null && Math.abs(studentVal - optVal) < 1e-9) {
        return true;
      }
    }
  }

  return false;
};
