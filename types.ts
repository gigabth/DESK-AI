
export enum MediaType { IMAGE = 'IMAGE', VIDEO = 'VIDEO' }
export enum AspectRatio { R_1_1 = '1:1', R_16_9 = '16:9', R_9_16 = '9:16', R_4_3 = '4:3' }
export enum Resolution { 
    RES_1K = '1K', 
    RES_2K = '2K', 
    RES_4K = '4K',
    RES_720P = '720p',
    RES_1080P = '1080p'
}

export interface ProductVariant { name: string; sku: string; }
export interface Product { id: string; name: string; brand?: string; sku: string; variants: ProductVariant[]; driveFolderId?: string; }
export interface SelectedProduct { product: Product; selectedVariant: ProductVariant; }

export interface GenerationStep {
    id: number;
    status: 'waiting' | 'synced' | 'prompting' | 'prompt_ready' | 'generating' | 'complete' | 'failed';
    thumbnailUrl?: string;
    draftDescription: string;
    finalPrompt: string;
    mediaType?: MediaType;
}
