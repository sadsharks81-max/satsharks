const fs = require('fs');

const clientCode = fs.readFileSync('D:/github/my-daily-compass/Clienttierrequirments/sat_sharks_lums.jsx', 'utf-8');

let newCode = clientCode.replace('export default function LUMSCounselling()', 'function LUMSCounsellingContent()');

const headerImports = `import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const Route = createFileRoute("/consulting")({
  component: LUMSCounselling,
});

`;

newCode = newCode.replace('import { useState } from "react";', `import { useState } from "react";\n` + headerImports);

const wrapperCode = `

function LUMSCounselling() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LUMSCounsellingContent />
      </main>
      <Footer />
    </div>
  );
}
`;

newCode += wrapperCode;

fs.writeFileSync('D:/github/my-daily-compass/frontend/src/routes/consulting.tsx', newCode);
console.log('Successfully updated consulting.tsx');
