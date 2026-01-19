const fs = require('fs');
const path = require('path');

const PROJECT_NAME = 'DeskSpace-Pro';
const ROOT_DIR = path.join(process.cwd(), PROJECT_NAME);

// --- FILE CONTENTS ---

const fileContents = {
  'package.json': `{
  "name": "deskspace-ai-pro",
  "private": true,
  "version": "1.0.0",
  "description": "DeskSpace AI Pro Desktop Application",
  "main": "electron/main.js",
  "author": "DeskSpace Team",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "electron:dev": "concurrently -k \\"cross-env BROWSER=none npm run dev\\" \\"wait-on http://localhost:5173 && electron .\\"",
    "electron:make": "vite build && electron-forge make"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@electron-forge/cli": "^7.3.0",
    "@electron-forge/maker-deb": "^7.3.0",
    "@electron-forge/maker-rpm": "^7.3.0",
    "@electron-forge/maker-squirrel": "^7.3.0",
    "@electron-forge/maker-zip": "^7.3.0",
    "@electron-forge/plugin-auto-unpack-natives": "^7.3.0",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "concurrently": "^8.2.2",
    "cross-env": "^7.0.3",
    "electron": "^29.1.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "wait-on": "^7.2.0"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Electron to load assets relative to the file
  server: {
    port: 5173,
    strictPort: true,
  }
})`,

  'forge.config.js': `module.exports = {
  packagerConfig: {
    // icon: './public/icon' // Add your icon path here (without extension)
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'DeskSpaceAI',
        authors: 'DeskSpace Team',
        exe: 'DeskSpaceAI.exe',
        setupExe: 'DeskSpaceAISetup.exe',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DeskSpace AI Pro</title>
    <link rel="icon" type="image/webp" href="https://www.deskspace.in.th/wp-content/uploads/2026/01/Logo_DeskSpace_Full.webp">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              ds: {
                bg: '#f9fafb', // Light Grayish White
                surface: '#ffffff', // Pure White
                gold: '#b69652', // The requested Gold
                'gold-light': '#d4c08e',
                'gold-dark': '#8e7336',
                text: '#1f2937', // Dark Gray for primary text
                muted: '#9ca3af', // Light Gray for secondary text
                border: '#e5e7eb',
              }
            },
            fontFamily: {
              sans: ['Prompt', 'Segoe UI', 'sans-serif'],
            },
            boxShadow: {
              'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
              'glow-gold': '0 0 15px rgba(182, 150, 82, 0.3)',
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #f9fafb;
        color: #1f2937;
        font-family: 'Prompt', sans-serif;
        overflow-x: hidden;
      }
      .luxury-panel {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #b69652;
      }
      /* Smooth transitions for inputs */
      input, select, textarea, button {
        transition: all 0.2s ease-in-out;
      }
    </style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "vite": "https://esm.sh/vite@^7.3.1",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,

  'metadata.json': `{
  "name": "DeskSpace AI Pro",
  "description": "Advanced AI Studio for generating product photography and video ads using Multi-Shot consistency workflows.",
  "requestFramePermissions": []
}`,

  'Tutorial.txt': `================================================================================
คู่มือการติดตั้ง DeskSpace AI Pro และการตั้งค่า n8n (ฉบับจับมือทำ)
================================================================================

ส่วนที่ 1: การติดตั้งโปรแกรม Front-end (DeskSpace Desktop App)
--------------------------------------------------------------------------------

1. ติดตั้ง Library (Dependencies)
   - เปิด Terminal ในโฟลเดอร์ DeskSpace-Pro
   - พิมพ์คำสั่งแล้วกด Enter:
     npm install

2. การทดสอบรันโปรแกรม (Developer Mode)
   - พิมพ์คำสั่ง:
     npm run electron:dev

3. การสร้างไฟล์ติดตั้ง .exe (Production Build)
   - พิมพ์คำสั่ง:
     npm run electron:make
   - รอสักพัก เมื่อเสร็จแล้วไฟล์ .exe จะอยู่ที่โฟลเดอร์:
     out/make/squirrel.windows/x64/DeskSpaceAI-Setup.exe

** อย่าลืมนำไฟล์ icon.ico มาใส่ในโฟลเดอร์ public ด้วยนะครับ หากต้องการให้ icon โปรแกรมเปลี่ยน **

================================================================================
ส่วนที่ 2: การตั้งค่า n8n (Back-end Workflow)
================================================================================
(ดูรายละเอียดในไฟล์ Tutorial.txt เดิม หรือนำเข้าไฟล์ n8n_workflow.json)
`,

  'n8n_workflow.json': `{
  "name": "DeskSpace AI Backend",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "deskspace-gen",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "dataType": "string",
        "value1": "={{ $json.body.action }}",
        "rules": {
          "rules": [
            { "value2": "generate_draft_plan", "output": 0 },
            { "value2": "generate_final_prompt", "output": 1 },
            { "value2": "generate_image", "output": 2 }
          ]
        }
      },
      "id": "router-switch",
      "name": "Action Router",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "modelId": "gemini-pro",
        "prompt": "=คุณคือ Creative Director มืออาชีพ\\n\\nโจทย์: สร้าง Storyboard สำหรับถ่ายภาพสินค้าจำนวน {{ $json.body.count }} ภาพ\\nConcept ลูกค้า: {{ $json.body.concept }}\\nสินค้า: {{ $json.body.products.map(p => p.product.name).join(', ') }}\\n\\nOutput Requirements:\\n- ตอบกลับมาเป็น JSON Array ของ Strings เท่านั้น (ห้ามมี Markdown หรือคำอธิบายอื่น)\\n- ภาษาไทย\\n- แต่ละ string อธิบายฉาก แสง และมุมกล้อง",
        "options": {}
      },
      "id": "gemini-plan",
      "name": "Gemini - Draft Plan",
      "type": "n8n-nodes-base.googleGemini",
      "typeVersion": 1,
      "position": [940, 100]
    },
    {
      "parameters": {
        "modelId": "gemini-pro",
        "prompt": "=You are an expert AI Prompt Engineer for Stable Diffusion/Nano Banana Pro.\\n\\nTask: Convert this Thai description into a highly technical English prompt.\\n\\nInput Description: {{ $json.body.draftDescription }}\\nProduct: {{ $json.body.products[0].product.name }}\\nRef Background: {{ $json.body.backgroundRefImage ? 'MUST MATCH BACKGROUND from: ' + $json.body.backgroundRefImage : 'Create new environment' }}\\n\\nFormat:\\nSubject: [Subject]\\nAction: [Action]\\nLighting: [Lighting]\\nCamera: [Camera Angle]\\nEngine: Unreal Engine 5, Octane Render, 8k.\\n\\nOutput only the raw prompt text.",
        "options": {}
      },
      "id": "gemini-prompt",
      "name": "Gemini - Tech Prompt",
      "type": "n8n-nodes-base.googleGemini",
      "typeVersion": 1,
      "position": [940, 300]
    },
    {
      "parameters": {
        "url": "https://picsum.photos/1024/576",
        "options": {
          "response": { "response": { "fullResponse": true } }
        }
      },
      "id": "mock-image-gen",
      "name": "Mock Image Gen (Picsum)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [940, 500]
    },
    {
      "parameters": { "options": {} },
      "id": "respond-plan",
      "name": "Respond Plan",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1160, 100],
      "inputAlias": "gemini-plan"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\\n  \\"finalPrompt\\": \\"{{ $json.text }}\\"\\n}",
        "options": {}
      },
      "id": "respond-prompt",
      "name": "Respond Prompt",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1160, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\\n  \\"imageUrl\\": \\"{{ $json.url }}\\"\\n}",
        "options": {}
      },
      "id": "respond-image",
      "name": "Respond Image",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1160, 500]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Action Router", "type": "main", "index": 0 }]] },
    "Action Router": {
      "main": [
        [{ "node": "Gemini - Draft Plan", "type": "main", "index": 0 }],
        [{ "node": "Gemini - Tech Prompt", "type": "main", "index": 0 }],
        [{ "node": "Mock Image Gen (Picsum)", "type": "main", "index": 0 }]
      ]
    },
    "Gemini - Draft Plan": { "main": [[{ "node": "Respond Plan", "type": "main", "index": 0 }]] },
    "Gemini - Tech Prompt": { "main": [[{ "node": "Respond Prompt", "type": "main", "index": 0 }]] },
    "Mock Image Gen (Picsum)": { "main": [[{ "node": "Respond Image", "type": "main", "index": 0 }]] }
  }
}`,

  'electron/main.js': `const { app, BrowserWindow } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#f9fafb',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webSecurity: false // ⚠️ IMPORTANT: Allows CORS for local development (n8n connection)
    },
    autoHideMenuBar: true,
    // icon: path.join(__dirname, '../public/icon.ico')
  });

  const isDev = !app.isPackaged;
  
  if (isDev) {
    // Retry logic: Try to load URL, if fails (Vite not ready), wait 1s and try again
    const loadDevServer = () => {
      mainWindow.loadURL('http://127.0.0.1:5173').catch(() => {
        console.log('🚧 Server not ready, retrying in 1s...');
        setTimeout(loadDevServer, 1000);
      });
    };
    loadDevServer();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});`,

  'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'src/App.tsx': `import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewGallery from './components/PreviewGallery';
import { MediaType, SelectedProduct, AspectRatio, Resolution, GenerationStep } from './types';
import { generateDraftPlan } from './services/workflowService';

const App: React.FC = () => {
    const [mode, setMode] = useState<MediaType>(MediaType.IMAGE);
    const [isPlanning, setIsPlanning] = useState(false);
    
    const [steps, setSteps] = useState<GenerationStep[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    const handleModeChange = (newMode: MediaType) => {
        setMode(newMode);
    };

    const handleGeneratePlan = async (
        concept: string, 
        count: number, 
        products: SelectedProduct[], 
        ratio: AspectRatio, 
        res: Resolution
    ) => {
        setIsPlanning(true);
        setSelectedProducts(products);
        
        try {
            const planDescriptions = await generateDraftPlan(products, count, concept);
            
            const newSteps: GenerationStep[] = planDescriptions.map((desc, index) => ({
                id: index,
                status: 'waiting',
                draftDescription: desc,
                finalPrompt: '',
            }));
            
            setSteps(newSteps);
        } catch (error) {
            console.error("Planning failed", error);
            alert("Failed to generate plan. Please try again.");
        } finally {
            setIsPlanning(false);
        }
    };

    const updateStep = (id: number, updates: Partial<GenerationStep>) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteStep = (id: number) => {
        updateStep(id, { 
            status: 'waiting', 
            thumbnailUrl: undefined, 
            finalPrompt: '' 
        });
    };
    
    const refreshStep = (id: number) => {
        deleteStep(id);
    };

    return (
        <div className="ds-root-container w-screen h-screen overflow-hidden flex flex-col md:flex-row p-4 md:p-6 gap-6 relative bg-[#f9fafb]">
             <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-ds-gold/5 blur-[120px] rounded-full pointer-events-none z-0" />
             <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-ds-gold/5 blur-[100px] rounded-full pointer-events-none z-0" />

            <ControlPanel 
                currentMode={mode}
                onModeChange={handleModeChange}
                onGeneratePlan={handleGeneratePlan}
                isPlanning={isPlanning}
            />

            <PreviewGallery 
                steps={steps}
                onUpdateStep={updateStep}
                onDeleteStep={deleteStep}
                onRefreshStep={refreshStep}
                selectedProducts={selectedProducts}
            />
        </div>
    );
};

export default App;`,

  'src/constants.ts': `import { Product } from './types';

// Mock Data representing what would come from Google Sheets via n8n
export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'ErgoChair Pro',
        sku: 'EC-PRO-01',
        variants: [
            { name: 'Obsidian Black', sku: 'EC-PRO-01-BK' },
            { name: 'Cool Gray', sku: 'EC-PRO-01-GY' },
            { name: 'Baby Blue', sku: 'EC-PRO-01-BL' }
        ]
    },
    {
        id: '2',
        name: 'Nebula Gaming Desk',
        sku: 'DK-NEB-X',
        variants: [
            { name: 'Carbon Fiber', sku: 'DK-NEB-X-CF' },
            { name: 'White Gloss', sku: 'DK-NEB-X-WG' }
        ]
    },
    {
        id: '3',
        name: 'Monitor Arm Single',
        sku: 'MA-S1',
        variants: [
            { name: 'Standard', sku: 'MA-S1-STD' }
        ]
    }
];

export const N8N_WEBHOOK_URL = "https://horrifically-interlinear-nola.ngrok-free.dev/webhook-test/deskspace-gen";`,

  'src/types.ts': `export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
}

export enum AspectRatio {
    R_1_1 = '1:1',
    R_4_3 = '4:3',
    R_16_9 = '16:9',
    R_9_16 = '9:16'
}

export enum Resolution {
    RES_1K = '1K',
    RES_2K = '2K'
}

export interface ProductVariant {
    name: string;
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string; // Base SKU
    variants: ProductVariant[];
    driveFolderId?: string;
}

export interface SelectedProduct {
    product: Product;
    selectedVariant: ProductVariant;
}

export interface GenerationStep {
    id: number;
    status: 'waiting' | 'synced' | 'prompting' | 'prompt_ready' | 'generating' | 'complete' | 'failed';
    thumbnailUrl?: string; // High res or preview
    draftDescription: string; // From the "Master Plan"
    finalPrompt: string; // Technical prompt for the model
}

export interface MasterPlan {
    concept: string; // The user's rough thai input
    steps: GenerationStep[];
}`,

  'src/services/workflowService.ts': `import { GenerationStep, SelectedProduct, Product } from '../types';
import { N8N_WEBHOOK_URL } from '../constants';

const cleanJsonString = (str: string): string => {
    return str.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
};

async function callN8N(payload: any, timeoutMs = 60000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        console.log(\`🔌 [N8N] Action: \${payload.action} -> Connecting to \${N8N_WEBHOOK_URL}...\`);
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(\`N8N Server Error: \${response.status} \${response.statusText}\`);
        }
        
        const data = await response.json();
        console.log(\`✅ [N8N] Success:\`, data);
        return data;
    } catch (error: any) {
        clearTimeout(id);
        console.error(\`⚠️ [N8N] Failed:\`, error);
        if (payload.action !== 'search_products') {
            alert(\`ไม่สามารถเชื่อมต่อ n8n ได้\\n\\nError: \${error.message}\`);
        }
        return null;
    }
}

export const searchProducts = async (term: string): Promise<Product[]> => {
    const n8nResult = await callN8N({
        action: 'search_products',
        query: term
    }, 10000); 

    if (n8nResult && Array.isArray(n8nResult)) {
        return n8nResult;
    } else if (n8nResult && n8nResult.products) {
        return n8nResult.products;
    }

    return []; 
};

export const generateDraftPlan = async (
    products: SelectedProduct[],
    count: number,
    userConcept: string
): Promise<string[]> => {
    const n8nResult = await callN8N({
        action: 'generate_draft_plan',
        products,
        count,
        concept: userConcept
    });

    if (n8nResult) {
        if (Array.isArray(n8nResult)) return n8nResult;
        if (n8nResult.plan && Array.isArray(n8nResult.plan)) return n8nResult.plan;
        
        if (typeof n8nResult === 'string' || (n8nResult.text && typeof n8nResult.text === 'string')) {
            try {
                const rawText = typeof n8nResult === 'string' ? n8nResult : n8nResult.text;
                const parsed = JSON.parse(cleanJsonString(rawText));
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                console.error("Failed to parse N8N plan JSON", e);
            }
        }
    }

    console.log("🤖 [Fallback] Using Simulation Data for Plan");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const steps: string[] = [];
    const pName = products[0]?.product.name || "Product";
    for(let i=0; i<count; i++) {
        if (i === 0) steps.push(\`ภาพที่ 1: [Cover Shot] \${pName} มุม Wide เต็มตัว บรรยากาศ \${userConcept}\`);
        else steps.push(\`ภาพที่ \${i+1}: [Lifestyle] การใช้งานจริงในห้องทำงาน \${userConcept}\`);
    }
    return steps;
};


export const generateFinalPrompt = async (
    stepIndex: number,
    draftDescription: string,
    products: SelectedProduct[],
    backgroundRefImage?: string 
): Promise<string> => {
    const n8nResult = await callN8N({
        action: 'generate_final_prompt',
        stepIndex,
        draftDescription,
        products,
        backgroundRefImage
    });

    if (n8nResult) {
        if (n8nResult.finalPrompt) return n8nResult.finalPrompt;
        if (n8nResult.text) return n8nResult.text;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    return \`Subject: \${products.map(p => p.product.name).join(' and ')}. Action: \${draftDescription}\`;
};


export const generateImageTask = async (
    finalPrompt: string,
    products: SelectedProduct[],
    backgroundRefImage?: string
): Promise<string> => {
    const n8nResult = await callN8N({
        action: 'generate_image',
        finalPrompt,
        products,
        backgroundRefImage
    }, 120000);

    if (n8nResult && (n8nResult.imageUrl || n8nResult.url)) return n8nResult.imageUrl || n8nResult.url;
    
    await new Promise(resolve => setTimeout(resolve, 4000)); 
    const randomSeed = Math.floor(Math.random() * 1000);
    return \`https://picsum.photos/seed/\${randomSeed + Math.random()}/1024/576\`;
};`,

  'src/components/ControlPanel.tsx': `import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, SelectedProduct, MediaType, AspectRatio, Resolution } from '../types';
import { searchProducts } from '../services/workflowService'; 
import { MOCK_PRODUCTS } from '../constants'; 

interface ControlPanelProps {
    onModeChange: (mode: MediaType) => void;
    currentMode: MediaType;
    onGeneratePlan: (concept: string, count: number, products: SelectedProduct[], ratio: AspectRatio, res: Resolution) => void;
    isPlanning: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    onModeChange, 
    currentMode, 
    onGeneratePlan,
    isPlanning 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    
    const [imageCount, setImageCount] = useState<number>(5);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.R_16_9);
    const [resolution, setResolution] = useState<Resolution>(Resolution.RES_1K);
    const [conceptInput, setConceptInput] = useState<string>('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const realResults = await searchProducts(searchTerm);
                if (realResults && realResults.length > 0) {
                    setSearchResults(realResults);
                } else {
                    const lowerTerm = searchTerm.toLowerCase();
                    const mockResults = MOCK_PRODUCTS.filter(p => 
                        p.name.toLowerCase().includes(lowerTerm) || 
                        p.sku.toLowerCase().includes(lowerTerm)
                    );
                    setSearchResults(mockResults);
                }
            } catch (error) {
                console.error("Search failed", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 800); 
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSelectProduct = (product: Product) => {
        if (selectedProducts.length >= 2) {
            alert("Maximum 2 products allowed.");
            return;
        }
        const safeProduct = {
            ...product,
            variants: product.variants?.length > 0 ? product.variants : [{ name: 'Default', sku: product.sku }]
        };
        setSelectedProducts([...selectedProducts, { product: safeProduct, selectedVariant: safeProduct.variants[0] }]);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleRemoveProduct = (index: number) => {
        const newProds = [...selectedProducts];
        newProds.splice(index, 1);
        setSelectedProducts(newProds);
    };

    const handleVariantChange = (index: number, sku: string) => {
        const newProds = [...selectedProducts];
        const variant = newProds[index].product.variants.find(v => v.sku === sku);
        if (variant) {
            newProds[index].selectedVariant = variant;
            setSelectedProducts(newProds);
        }
    };

    return (
        <aside className="luxury-panel w-full md:w-[420px] flex flex-col h-full rounded-3xl p-8 gap-8 overflow-y-auto custom-scrollbar relative z-10">
            <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-6 gap-3">
                <img 
                    src="https://www.deskspace.in.th/wp-content/uploads/2026/01/Logo_DeskSpace_Full.webp" 
                    alt="DeskSpace AI Pro" 
                    className="h-14 w-auto object-contain"
                />
                <p className="text-[10px] font-medium text-ds-muted tracking-[0.2em] uppercase opacity-70">AI Production Suite</p>
            </div>

            <div className="flex p-1.5 bg-gray-100/80 rounded-2xl">
                <button 
                    onClick={() => onModeChange(MediaType.IMAGE)}
                    className={\`flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all \${currentMode === MediaType.IMAGE ? 'bg-white text-ds-gold shadow-sm' : 'text-ds-muted hover:text-ds-text'}\`}
                >
                    IMAGE GENERATION
                </button>
                <button 
                    onClick={() => onModeChange(MediaType.VIDEO)}
                    className={\`flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all \${currentMode === MediaType.VIDEO ? 'bg-white text-ds-gold shadow-sm' : 'text-ds-muted hover:text-ds-text'}\`}
                >
                    VIDEO GENERATION
                </button>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-ds-text uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ds-gold"></span>
                    Select Products
                </label>
                <div className="relative group">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search product name or SKU (from Sheets)..."
                        className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl px-4 py-4 text-sm text-ds-text placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-ds-gold/50 focus:outline-none transition-all"
                    />
                    <div className="absolute right-4 top-4 text-gray-400 group-hover:text-ds-gold transition-colors">
                        {isSearching ? (
                            <svg className="animate-spin w-5 h-5 text-ds-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        )}
                    </div>

                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white ring-1 ring-gray-100 mt-2 rounded-xl shadow-xl z-50 overflow-hidden py-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {searchResults.map(p => (
                                <div 
                                    key={p.id || p.sku} 
                                    onClick={() => handleSelectProduct(p)}
                                    className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group/item transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover/item:text-ds-gold">{p.name}</span>
                                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">{p.sku}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {selectedProducts.map((sp, idx) => (
                        <div key={idx} className="bg-white ring-1 ring-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fadeIn">
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="text-sm font-bold text-ds-text truncate mb-1">{sp.product.name}</div>
                                <select 
                                    className="bg-gray-50 border-0 rounded-lg text-xs px-2 py-1.5 w-full text-gray-600 focus:ring-1 focus:ring-ds-gold cursor-pointer"
                                    value={sp.selectedVariant.sku}
                                    onChange={(e) => handleVariantChange(idx, e.target.value)}
                                >
                                    {sp.product.variants.map(v => (
                                        <option key={v.sku} value={v.sku}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                onClick={() => handleRemoveProduct(idx)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">Total Images</label>
                    <select 
                        value={imageCount}
                        onChange={(e) => setImageCount(Number(e.target.value))}
                        className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold/50 outline-none shadow-sm"
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Shots</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">Ratio</label>
                    <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold/50 outline-none shadow-sm"
                    >
                        {(Object.values(AspectRatio) as string[]).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">Output Quality</label>
                    <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value as Resolution)}
                        className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold/50 outline-none shadow-sm"
                    >
                        {(Object.values(Resolution) as string[]).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-ds-text uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ds-gold"></span>
                    Briefing & Mood (Thai)
                </label>
                <textarea 
                    value={conceptInput}
                    onChange={(e) => setConceptInput(e.target.value)}
                    placeholder='เช่น "ช่วยคิดคอนเซปต์ของ ads gallery โดยให้เป็นสไตล์ห้องเกมเมอร์สไตล์ ที่จะดูไฟสลัวๆ"'
                    className="flex-1 min-h-[120px] w-full bg-white ring-1 ring-gray-200 rounded-xl p-4 text-sm text-ds-text placeholder-gray-300 focus:ring-2 focus:ring-ds-gold/50 focus:outline-none resize-none shadow-inner transition-all"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => setConceptInput('')} 
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-400 hover:text-ds-text hover:border-gray-300 font-semibold text-sm transition-all bg-white"
                >
                    Clear
                </button>
                <button 
                    onClick={() => onGeneratePlan(conceptInput, imageCount, selectedProducts, aspectRatio, resolution)}
                    disabled={isPlanning || !conceptInput || selectedProducts.length === 0}
                    className="flex-1 bg-ds-gold hover:bg-[#a38647] text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_0_rgba(182,150,82,0.39)] hover:shadow-[0_6px_20px_rgba(182,150,82,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2"
                >
                    {isPlanning ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Plan...
                        </>
                    ) : (
                        <>
                            Generate Master Plan
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default ControlPanel;`,

  'src/components/PreviewGallery.tsx': `import React, { useState, useEffect } from 'react';
import { GenerationStep, SelectedProduct } from '../types';
import { generateFinalPrompt, generateImageTask } from '../services/workflowService';

interface PreviewGalleryProps {
    steps: GenerationStep[];
    onUpdateStep: (id: number, updates: Partial<GenerationStep>) => void;
    onDeleteStep: (id: number) => void;
    onRefreshStep: (id: number) => void;
    selectedProducts: SelectedProduct[];
}

const PreviewGallery: React.FC<PreviewGalleryProps> = ({ 
    steps, 
    onUpdateStep, 
    onDeleteStep,
    onRefreshStep,
    selectedProducts 
}) => {
    const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

    useEffect(() => {
        if (steps.length > 0 && selectedStepId === null) {
            setSelectedStepId(steps[0].id);
        }
    }, [steps]);

    const currentStep = steps.find(s => s.id === selectedStepId);
    
    const backgroundRefImage = steps.find(s => s.id === 0 && s.status === 'complete')?.thumbnailUrl;

    const handleSync = () => {
        if (!currentStep) return;
        onUpdateStep(currentStep.id, { status: 'synced' });
    };

    const handleGeneratePrompt = async () => {
        if (!currentStep) return;
        onUpdateStep(currentStep.id, { status: 'prompting' });
        
        try {
            const finalPrompt = await generateFinalPrompt(
                currentStep.id, 
                currentStep.draftDescription, 
                selectedProducts,
                currentStep.id > 0 ? backgroundRefImage : undefined
            );
            onUpdateStep(currentStep.id, { status: 'prompt_ready', finalPrompt });
        } catch (e) {
            onUpdateStep(currentStep.id, { status: 'failed' });
        }
    };

    const handleGenerateImage = async () => {
        if (!currentStep) return;
        onUpdateStep(currentStep.id, { status: 'generating' });
        
        try {
            const url = await generateImageTask(
                currentStep.finalPrompt, 
                selectedProducts,
                currentStep.id > 0 ? backgroundRefImage : undefined
            );
            onUpdateStep(currentStep.id, { status: 'complete', thumbnailUrl: url });
        } catch (e) {
            onUpdateStep(currentStep.id, { status: 'failed' });
        }
    };

    if (steps.length === 0) {
        return (
            <div className="flex-1 luxury-panel rounded-3xl flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                 <div className="w-24 h-24 mb-6 text-gray-200">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                 </div>
                 <h2 className="text-2xl font-bold text-ds-text mb-2">Workspace Empty</h2>
                 <p className="text-gray-500 font-light">Configure your settings on the left to begin.</p>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col gap-6 h-full min-w-0">
            <div className="flex-1 luxury-panel rounded-3xl p-6 relative flex flex-col min-h-0">
                <div className="absolute top-6 right-6 z-10 flex gap-2">
                    {currentStep?.thumbnailUrl && (
                        <button 
                            onClick={() => onDeleteStep(currentStep.id)}
                            className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 p-2.5 rounded-xl shadow-sm transition-all"
                            title="Delete Image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-50 rounded-2xl border border-dashed border-gray-200 relative group">
                    {currentStep?.status === 'generating' ? (
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-ds-gold/30 border-t-ds-gold rounded-full animate-spin"></div>
                            <div className="text-ds-gold font-bold tracking-widest animate-pulse text-sm">RENDERING AI SCENE...</div>
                         </div>
                    ) : currentStep?.thumbnailUrl ? (
                        <img src={currentStep.thumbnailUrl} alt="Generated" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                    ) : (
                        <div className="text-gray-400 text-sm tracking-widest font-light flex flex-col items-center gap-2">
                            <span>WAITING FOR GENERATION</span>
                            <span className="w-8 h-[1px] bg-gray-300"></span>
                        </div>
                    )}
                    
                    <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold border border-gray-100 uppercase text-ds-text tracking-wider">
                        STATUS: <span className="text-ds-gold ml-1">{currentStep?.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            <div className="h-[320px] flex gap-6">
                <div className="w-[120px] luxury-panel rounded-2xl p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                    {steps.map((step, idx) => (
                        <div 
                            key={step.id}
                            onClick={() => setSelectedStepId(step.id)}
                            className={\`aspect-square rounded-xl border-2 cursor-pointer relative overflow-hidden transition-all duration-300 \${selectedStepId === step.id ? 'border-ds-gold shadow-lg shadow-ds-gold/20 scale-[1.02]' : 'border-transparent bg-gray-100 hover:bg-gray-200'}\`}
                        >
                            {step.thumbnailUrl ? (
                                <img src={step.thumbnailUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-gray-50">
                                    {idx + 1}
                                </div>
                            )}
                            {step.status === 'generating' && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="w-4 h-4 border-2 border-ds-gold border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex-1 luxury-panel rounded-2xl p-8 flex flex-col gap-5">
                    {currentStep && (
                        <>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-ds-text uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        Concept Plan (Thai)
                                    </label>
                                    <button 
                                        onClick={handleSync}
                                        className="text-ds-gold hover:text-[#a38647] transition-colors p-1"
                                        title="Sync Draft from Master Plan"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </button>
                                </div>
                                <div className="relative flex-1">
                                    <textarea 
                                        className="w-full h-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 focus:text-ds-text resize-none outline-none focus:ring-1 focus:ring-ds-gold/50 shadow-inner transition-all"
                                        value={currentStep.draftDescription}
                                        onChange={(e) => onUpdateStep(currentStep.id, { draftDescription: e.target.value })}
                                        placeholder="Click Sync to load plan..."
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-ds-text uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        Technical Prompt (Engine)
                                    </label>
                                    <button 
                                        onClick={handleGeneratePrompt}
                                        disabled={!currentStep.draftDescription}
                                        className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-ds-gold hover:text-white hover:border-ds-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium tracking-wide"
                                    >
                                        GENERATE PROMPT
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full h-full bg-gray-900 border border-transparent rounded-xl p-4 text-sm text-green-400 font-mono resize-none outline-none focus:ring-1 focus:ring-green-500 shadow-inner"
                                    value={currentStep.finalPrompt}
                                    readOnly
                                    placeholder="// Waiting for prompt generation..."
                                />
                            </div>

                            <button 
                                onClick={handleGenerateImage}
                                disabled={!currentStep.finalPrompt || currentStep.status === 'generating'}
                                className="w-full py-3.5 bg-ds-text hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {currentStep.status === 'generating' ? 'PROCESSING...' : 'RENDER IMAGE'}
                                {!currentStep.status.includes('generating') && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default PreviewGallery;`,
};

// --- INSTALLATION LOGIC ---

console.log(`🚀 Starting installation for ${PROJECT_NAME}...`);

if (!fs.existsSync(ROOT_DIR)) {
  fs.mkdirSync(ROOT_DIR);
  console.log(`📁 Created root directory: ${ROOT_DIR}`);
}

const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

Object.keys(fileContents).forEach(filePath => {
  const fullPath = path.join(ROOT_DIR, filePath);
  const dirName = path.dirname(fullPath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
    console.log(`📂 Created directory: ${dirName}`);
  }

  fs.writeFileSync(fullPath, fileContents[filePath]);
  console.log(`✅ Created file: ${filePath}`);
});

console.log(`
=========================================================
🎉 Installation Complete!
=========================================================

To start the application:

1. cd ${PROJECT_NAME}
2. npm install
3. npm run electron:dev
`);