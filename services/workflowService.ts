
import { GenerationStep, SelectedProduct, Product, AspectRatio, Resolution } from '../types';
import { N8N_WEBHOOK_URL, MOCK_PRODUCTS } from '../constants';

const cleanJsonString = (str: string): string => {
    if (!str) return "[]";
    return str.replace(/```json/g, '').replace(/```/g, '').replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
};

const findFirstArray = (obj: any): any[] | null => {
    if (!obj) return null;
    if (obj.message === 'Workflow was started') return null;
    if (Array.isArray(obj)) {
        if (obj.length > 0 && typeof obj[0] === 'object') {
            const commonKeys = ['plan', 'output', 'data', 'items', 'products', 'json'];
            for (const key of commonKeys) {
                if (Array.isArray(obj[0][key])) return obj[0][key];
            }
            if (obj[0].json) return findFirstArray(obj[0].json);
        }
        return obj;
    }
    if (typeof obj === 'object') {
        const commonKeys = ['plan', 'output', 'data', 'items', 'products', 'json'];
        for (const key of commonKeys) {
            if (Array.isArray(obj[key])) return obj[key];
        }
        if (obj.json) return findFirstArray(obj.json);
    }
    return null;
};

async function callN8N(payload: any, timeoutMs = 120000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        console.log(`🚀 [N8N CALL] Action: ${payload.action}`, payload);
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(id);
        if (response.status === 404) return { error: '404_NOT_ACTIVE' };
        const data = await response.json();
        console.log(`✅ [N8N RESPONSE]`, data);
        if (data.message === 'Workflow was started') return { error: 'N8N_ASYNC_MODE', details: data };
        return data;
    } catch (error: any) {
        clearTimeout(id);
        console.error(`❌ [N8N FAILED]`, error);
        return { error: error.message || 'Connection Timeout' };
    }
}

export const searchProducts = async (term: string): Promise<Product[]> => {
    const res = await callN8N({ action: 'search_products', query: term }, 15000);
    const foundArray = findFirstArray(res);
    if (foundArray) return foundArray;
    const lower = term.toLowerCase();
    return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower));
};

export const generateDraftPlan = async (products: SelectedProduct[], count: number, concept: string, ratio?: AspectRatio, res?: Resolution): Promise<any> => {
    const resPayload = await callN8N({ 
        action: 'generate_draft_plan', 
        products, 
        count, 
        concept,
        aspectRatio: ratio,
        resolution: res
    });
    
    if (resPayload && !resPayload.error) {
        const planData = findFirstArray(resPayload);
        if (planData) return planData;
        const possibleString = typeof resPayload === 'string' ? resPayload : (resPayload.text || resPayload.output || (Array.isArray(resPayload) && typeof resPayload[0] === 'string' ? resPayload[0] : null));
        if (typeof possibleString === 'string') {
            try {
                const cleaned = cleanJsonString(possibleString);
                if (cleaned.startsWith('[')) {
                    const parsed = JSON.parse(cleaned);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) {
                return possibleString.split('\n').filter(l => l.trim().length > 10);
            }
        }
    }
    return resPayload; 
};

export const generateFinalPrompt = async (stepIndex: number, draft: string, products: SelectedProduct[], backgroundRefImage?: string): Promise<string> => {
    const res = await callN8N({ action: 'generate_final_prompt', stepIndex, draftDescription: draft, products, backgroundRefImage });
    if (res?.error) return `Error: ${res.error}`;
    const item = Array.isArray(res) ? res[0] : res;
    return item?.finalPrompt || item?.text || item?.output || (typeof res === 'string' ? res : "Prompt generation failed");
};

export const generateImageTask = async (prompt: string, products: SelectedProduct[], backgroundRefImage?: string, ratio?: AspectRatio, resQuality?: Resolution): Promise<string> => {
    const res = await callN8N({ 
        action: 'generate_image', 
        finalPrompt: prompt, 
        products, 
        backgroundRefImage,
        aspectRatio: ratio,
        resolution: resQuality
    });
    if (res?.error) throw new Error(res.error);
    const item = Array.isArray(res) ? res[0] : res;
    const url = item?.imageUrl || item?.url || item?.image;
    if (!url) throw new Error("No image URL received from n8n");
    return url;
};
