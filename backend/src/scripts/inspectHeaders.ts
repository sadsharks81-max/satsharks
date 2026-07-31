import fs from "fs";
import path from "path";

function findHeaders(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    return;
  }
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  console.log(`=== HEADERS IN ${path.basename(filePath)} ===`);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.toUpperCase().includes("SECTION") ||
      line.toUpperCase().includes("MODULE") ||
      line.toUpperCase().includes("HARD") ||
      line.toUpperCase().includes("EASY")
    ) {
      if (line.length < 100 && !line.includes("Question") && !line.includes("Skill:") && !line.includes("Why other")) {
        console.log(`${i + 1}: ${line}`);
      }
    }
  }
}

async function main() {
  findHeaders(path.resolve(__dirname, "../../../reference_data/qText_10.txt"));
  findHeaders(path.resolve(__dirname, "../../../reference_data/sText_10.txt"));
}

main().catch(console.error);
