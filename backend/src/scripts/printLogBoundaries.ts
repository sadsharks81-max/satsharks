import fs from "fs";
import path from "path";

function main() {
  const logPath = `C:\\Users\\DELL\\.gemini\\antigravity\\brain\\a28e804b-8a2e-4740-b38c-c8b40a153b75\\.system_generated\\tasks\\task-6341.log`;
  if (!fs.existsSync(logPath)) {
    console.error("Log file not found");
    return;
  }
  
  const content = fs.readFileSync(logPath, "utf8");
  const lines = content.split("\n");
  
  console.log("=== FILTERED LOG LINES ===");
  for (const line of lines) {
    if (line.includes("Page ") && !line.includes("Warning:")) {
      console.log(line);
    }
    if (line.includes("PAGE DETAILS FOR TEST") || line.includes("--- QUESTIONS") || line.includes("--- SOLUTIONS")) {
      console.log(line);
    }
  }
}

main();
