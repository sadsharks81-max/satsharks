import { getBackendUrl, getStoredToken } from "./api";

export const fetchStudyMaterialPdf = async (materialId: string) => {
  const token = getStoredToken();
  if (!token) throw new Error("Please log in again to open this PDF.");

  const response = await fetch(`${getBackendUrl()}/api/study-materials/${materialId}/file`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "The PDF could not be opened.");
  }

  const blob = await response.blob();
  if (!blob.size) throw new Error("The PDF file is empty.");
  return URL.createObjectURL(
    blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" }),
  );
};
