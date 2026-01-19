
import React, { useState, useEffect } from 'react';
import { Product, SelectedProduct, MediaType, AspectRatio, Resolution } from '../types';
import { searchProducts } from '../services/workflowService'; 

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
                setSearchResults(realResults || []);
            } catch (error) {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 800); 
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSelectProduct = (product: Product) => {
        if (selectedProducts.length >= 2) {
            alert("เลือกสินค้าได้สูงสุด 2 อย่างต่อหนึ่งการผลิต");
            return;
        }
        const safeProduct = {
            ...product,
            variants: product.variants?.length > 0 ? product.variants : [{ name: 'Standard', sku: product.sku }]
        };
        setSelectedProducts([...selectedProducts, { product: safeProduct, selectedVariant: safeProduct.variants[0] }]);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <aside className="luxury-panel w-full md:w-[420px] flex flex-col h-full rounded-3xl p-8 gap-8 overflow-y-auto custom-scrollbar relative z-10 border-r border-white/40">
            <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-6 gap-3">
                <img src="https://www.deskspace.in.th/wp-content/uploads/2026/01/Logo_DeskSpace_Full.webp" alt="Logo" className="h-14 w-auto object-contain" />
                <p className="text-[10px] font-medium text-ds-muted tracking-[0.2em] uppercase opacity-70">AI Production Suite Pro</p>
            </div>

            <div className="flex p-1.5 bg-gray-100/80 rounded-2xl">
                <button onClick={() => onModeChange(MediaType.IMAGE)} className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-wider transition-all ${currentMode === MediaType.IMAGE ? 'bg-white text-ds-gold shadow-sm' : 'text-ds-muted hover:text-ds-text'}`}>IMAGE PRODUCTION</button>
                <button onClick={() => onModeChange(MediaType.VIDEO)} className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-wider transition-all ${currentMode === MediaType.VIDEO ? 'bg-white text-ds-gold shadow-sm' : 'text-ds-muted hover:text-ds-text'}`}>VIDEO PRODUCTION</button>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-ds-text uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ds-gold" />
                    ค้นหาและเลือกสินค้า
                </label>
                <div className="relative group">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ระบุแบรนด์, ชื่อสินค้า หรือ SKU..." className="w-full bg-white border-0 ring-1 ring-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-ds-gold/50 outline-none transition-all shadow-sm" />
                    {isSearching && <div className="absolute right-4 top-4 animate-spin h-5 w-5 border-2 border-ds-gold border-t-transparent rounded-full" />}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white ring-1 ring-gray-100 mt-2 rounded-xl shadow-2xl z-50 py-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {searchResults.map(p => (
                                <div key={p.id || p.sku} onClick={() => handleSelectProduct(p)} className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors border-b last:border-0">
                                    <div className="flex flex-col"><span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{p.brand || 'PRODUCT'}</span><span className="text-sm font-semibold group-hover:text-ds-gold">{p.name}</span></div>
                                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-mono text-gray-400">{p.sku}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {selectedProducts.map((sp, idx) => (
                        <div key={idx} className="bg-white ring-1 ring-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm border-l-4 border-ds-gold">
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sp.product.brand}</div>
                                <div className="text-sm font-bold text-ds-text truncate mb-1">{sp.product.name}</div>
                                <select className="bg-gray-50 border-0 rounded-lg text-xs px-2 py-1.5 w-full text-gray-600 focus:ring-ds-gold outline-none cursor-pointer" value={sp.selectedVariant.sku} onChange={(e) => {
                                    const newProds = [...selectedProducts];
                                    const variant = sp.product.variants.find(v => v.sku === e.target.value);
                                    if(variant) { newProds[idx].selectedVariant = variant; setSelectedProducts(newProds); }
                                }}>
                                    {sp.product.variants.map(v => <option key={v.sku} value={v.sku}>{v.name}</option>)}
                                </select>
                            </div>
                            <button onClick={() => { const n = [...selectedProducts]; n.splice(idx,1); setSelectedProducts(n); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">จำนวนช็อตภาพ</label>
                    <select value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} className="w-full bg-white ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold outline-none cursor-pointer">
                        {[1,3,5,8,10].map(n => <option key={n} value={n}>{n} Frames</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">สัดส่วน (Ratio)</label>
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="w-full bg-white ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold outline-none cursor-pointer">
                        <option value={AspectRatio.R_1_1}>1:1 Square</option>
                        <option value={AspectRatio.R_16_9}>16:9 Landscape</option>
                        <option value={AspectRatio.R_9_16}>9:16 Portrait</option>
                        <option value={AspectRatio.R_4_3}>4:3 Standard</option>
                    </select>
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-ds-text uppercase tracking-wider">คุณภาพผลลัพธ์</label>
                    <select value={resolution} onChange={(e) => setResolution(e.target.value as Resolution)} className="w-full bg-white ring-1 ring-gray-200 rounded-xl px-3 py-3 text-sm focus:ring-ds-gold outline-none cursor-pointer">
                        {Object.values(Resolution).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-ds-text uppercase tracking-wider">บรรยากาศและความต้องการ (ภาษาไทย)</label>
                <textarea value={conceptInput} onChange={(e) => setConceptInput(e.target.value)} placeholder='เช่น "ฉากโต๊ะทำงานระดับผู้บริหาร เน้นความหรูหรา แสงแดดยามเย็น..."' className="flex-1 min-h-[120px] w-full bg-white ring-1 ring-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-ds-gold/30 outline-none resize-none shadow-inner" />
            </div>

            <button onClick={() => onGeneratePlan(conceptInput, imageCount, selectedProducts, aspectRatio, resolution)} disabled={isPlanning || !conceptInput || selectedProducts.length === 0} className="w-full py-4.5 bg-ds-gold hover:bg-ds-gold-dark text-white font-bold rounded-2xl shadow-[0_15px_30px_-10px_rgba(182,150,82,0.4)] transition-all disabled:opacity-30 uppercase tracking-[0.25em] text-xs hover:-translate-y-1">
                {isPlanning ? "ARCHITECTING PLAN..." : "GENERATE PRODUCTION PLAN"}
            </button>
        </aside>
    );
};

export default ControlPanel;
