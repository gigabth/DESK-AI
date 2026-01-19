
import { Product } from './types';

/**
 * [สำคัญ] การใช้งาน Webhook URL:
 * 1. ใช้ /webhook/ (โหมดจริง): ต้องกดปุ่ม "Active" ใน n8n ให้เป็นสีเขียว (แนะนำทางนี้)
 * 2. ใช้ /webhook-test/ (โหมดทดสอบ): ต้องกดปุ่ม "Execute Workflow" ใน n8n ทุกครั้งก่อนส่งข้อมูล
 */
export const N8N_WEBHOOK_URL = "https://horrifically-interlinear-nola.ngrok-free.dev/webhook/deskspace-gen";

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'ErgoChair Pro',
        sku: 'EC-PRO-01',
        brand: 'ErgoChair',
        driveFolderId: '194YRDfEte3ntWTpAW1sAdpIHFnieLELj',
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
        brand: 'DeskSpace',
        driveFolderId: '194YRDfEte3ntWTpAW1sAdpIHFnieLELj',
        variants: [
            { name: 'Carbon Fiber', sku: 'DK-NEB-X-CF' },
            { name: 'White Gloss', sku: 'DK-NEB-X-WG' }
        ]
    }
];
