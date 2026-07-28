const fs = require('fs');

function wrapComponent(sourceFile, targetFile, routeName, componentName) {
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // Remove the import { useState, useEffect } from "react";
  content = content.replace(/import {.*?useState.*?}.*?;/, '');
  
  // Remove export default 
  content = content.replace(`export default function ${componentName}`, `function ${componentName}`);

  // We want to replace the `return (` that is inside the main component.
  // A safer way is to just wrap the whole `<div style={{ background: "#F7F9FC"`
  // Let's replace `<div style={{ background: "#F7F9FC"` with:
  // <div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><div style={{ background: "#F7F9FC"
  
  content = content.replace(
    '<div style={{ background: "#F7F9FC"', 
    '<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><div style={{ background: "#F7F9FC"'
  );

  // Then we need to add `</main><Footer /></div>` before the final `);` of the component.
  // Actually it's easier to just do a string replacement at the end of the file.
  // The file ends with:
  //   );
  // }
  
  content = content.replace(/\s*\);\n}\s*$/, '\n      </main>\n      <Footer />\n    </div>\n  );\n}\n');

  const newFileContent = `import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const Route = createFileRoute("/${routeName}")({
  component: ${componentName},
});

${content}
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

// 3. LUMS Counseling
wrapComponent(
  'D:/github/my-daily-compass/Clienttierrequirments/lums-counselling-tiers.jsx',
  'D:/github/my-daily-compass/frontend/src/routes/consulting.tsx',
  'consulting',
  'LUMSCounselling'
);
