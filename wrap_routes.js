const fs = require('fs');

function wrapComponent(sourceFile, targetFile, routeName, componentName) {
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // Remove the import { useState, useEffect } from "react";
  content = content.replace(/import {.*?useState.*?}.*?;/, '');
  
  // Remove export default function
  content = content.replace(new RegExp(`export default function ${componentName}\\(\\) {`), `function ${componentName}() {`);

  // Wrap the return value with Header and Footer
  const returnRegex = /return \([\s\S]*?(<div style={{ background: "#F7F9FC"[\s\S]*?)(\n  \);\n})/m;
  const match = content.match(returnRegex);
  
  if (match) {
    const wrappedReturn = `return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        ${match[1]}
      </main>
      <Footer />
    </div>
  );
}`;
    content = content.replace(returnRegex, wrappedReturn);
  }

  const newFileContent = `import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

${content}

export const Route = createFileRoute("/${routeName}")({
  component: ${componentName},
});
`;

  fs.writeFileSync(targetFile, newFileContent);
  console.log(`Wrote ${targetFile}`);
}

// 1. SAT Prep
wrapComponent(
  'D:/github/my-daily-compass/Clienttierrequirments/sat_sharks_prep_geo.jsx',
  'D:/github/my-daily-compass/frontend/src/routes/sat.tsx',
  'sat',
  'SATPrepPage'
);

// 2. Counseling Abroad
wrapComponent(
  'D:/github/my-daily-compass/Clienttierrequirments/sat_sharks_tiers.jsx',
  'D:/github/my-daily-compass/frontend/src/routes/counseling-abroad.tsx',
  'counseling-abroad',
  'SATSharksTiers'
);

// 3. LUMS Counseling (overwriting consulting.tsx)
wrapComponent(
  'D:/github/my-daily-compass/Clienttierrequirments/lums-counselling-tiers.jsx',
  'D:/github/my-daily-compass/frontend/src/routes/consulting.tsx',
  'consulting',
  'LUMSCounselling'
);
