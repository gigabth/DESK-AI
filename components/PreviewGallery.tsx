
import React, { useState, useEffect } from 'react';
import { GenerationStep, SelectedProduct } from '../types';
import { generateFinalPrompt, generateImageTask } from '../services/workflowService';

interface PreviewGalleryProps {
    steps: GenerationStep[];
    onUpdateStep: (id: number, updates: Partial<GenerationStep>) => void;
    onDeleteStep: (id: number) => void;
    onRefreshStep: (id: number) => void;
    selectedProducts: SelectedProduct[];
    isPlanning: boolean;
}

const PreviewGallery: React.FC<PreviewGalleryProps> = ({ 
    steps, 
    onUpdateStep, 
    onDeleteStep,
    onRefreshStep,
    selectedProducts,
    isPlanning
}) => {
    const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
    const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

    const contextMessages = [
        "ARCHITECTING STORYBOARD...",
        "ANALYZING BRAND AESTHETICS...",
        "SEQUENCING VISUAL FLOW...",
        "OPTIMIZING PRODUCTION PARAMETERS...",
        "SYNCHRONIZING MASTER PLAN..."
    ];

    useEffect(() => {
        if (steps.length > 0 && selectedStepId === null) {
            setSelectedStepId(steps[0].id);
        }
    }, [steps]);

    useEffect(() => {
        let interval: any;
        if (isPlanning) {
            interval = setInterval(() => {
                setLoadingMsgIdx(prev => (prev + 1) % contextMessages.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isPlanning]);

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

    const DualCoreLoader = () => (
        <div className="flex flex-col items-center gap-10 animate-in fade-in duration-500">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 border-[3px] border-ds-gold/5 rounded-full" />
                <div className="absolute inset-0 border-t-[3px] border-ds-gold rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-6 border-[1px] border-ds-gold/10 rounded-full" />
                <div className="absolute inset-6 border-b-[4px] border-ds-gold/40 rounded-full animate-[reverse-spin_1.8s_linear_infinite]" />
                <div className="relative w-10 h-10 bg-ds-gold shadow-[0_0_30px_rgba(182,150,82,0.6)] animate-pulse rounded-sm rotate-45" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ds-gold/10 to-transparent h-full w-full animate-[scan-y_2.5s_ease-in-out_infinite] pointer-events-none" />
            </div>
            <div className="flex flex-col items-center gap-3">
                <span className="text-ds-gold text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">
                    {contextMessages[loadingMsgIdx]}
                </span>
            </div>
        </div>
    );

    // Initial Empty State (Only if not planning and no steps)
    if (steps.length === 0 && !isPlanning) {
        return (
            <div className="flex-1 luxury-panel rounded-3xl flex flex-col items-center justify-center p-12 text-center border border-white/50">
                 <div className="w-20 h-20 mb-8 border border-ds-gold/20 rounded-full flex items-center justify-center text-ds-gold/30">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                 </div>
                 <h2 className="text-xl font-bold text-ds-text uppercase tracking-[0.3em] mb-4">Workspace Standby</h2>
                 <p className="text-xs font-light text-ds-muted max-w-xs leading-relaxed">
                    ระบบพร้อมทำงาน กรุณาระบุสินค้าและคอนเซปต์<br/>ทางซ้ายมือเพื่อเริ่มการผลิต
                 </p>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col gap-6 h-full min-w-0 animate-in fade-in duration-700">
            {/* 1. Main Stage (Top) */}
            <div className="flex-1 luxury-panel rounded-3xl p-6 relative flex flex-col min-h-0 bg-white shadow-2xl overflow-hidden group border border-white/50">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b69652 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                {isPlanning || currentStep?.status === 'generating' || currentStep?.status === 'prompting' ? (
                    <div className="flex-1 flex items-center justify-center">
                        <DualCoreLoader />
                    </div>
                ) : currentStep?.thumbnailUrl ? (
                    <div className="flex-1 flex items-center justify-center bg-gray-50/30 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={currentStep.thumbnailUrl} alt="Output" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-1000" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-20">
                        <div className="w-16 h-16 border-2 border-ds-gold rounded-full animate-ping" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-ds-gold">System Awaiting Instruction</span>
                    </div>
                )}
                
                {currentStep?.thumbnailUrl && !isPlanning && currentStep.status !== 'generating' && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => onDeleteStep(currentStep.id)} className="bg-white/90 text-red-500 p-3 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all scale-110">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Timeline & Controls (Bottom) */}
            <div className="h-[340px] flex gap-6 shrink-0">
                {/* Timeline Sidebar */}
                <div className="w-[140px] luxury-panel rounded-3xl p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-gray-50/50 border border-white/50">
                    <span className="text-[9px] font-bold text-ds-muted uppercase tracking-[0.2em] text-center opacity-40 mb-1">Production Timeline</span>
                    {isPlanning ? (
                        Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-white/80 border border-ds-gold/10 animate-pulse flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-ds-gold/5" />
                            </div>
                        ))
                    ) : (
                        steps.map((step, idx) => (
                            <div 
                                key={step.id}
                                onClick={() => setSelectedStepId(step.id)}
                                className={`aspect-square rounded-2xl border-2 cursor-pointer relative transition-all duration-300 ${selectedStepId === step.id ? 'border-ds-gold scale-[1.05] shadow-xl z-10' : 'border-transparent bg-white hover:bg-gray-50'}`}
                            >
                                {step.thumbnailUrl ? <img src={step.thumbnailUrl} className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">SHOT {idx + 1}</div>}
                                {step.status === 'generating' && <div className="absolute inset-0 bg-ds-gold/10 flex items-center justify-center rounded-xl backdrop-blur-[1px]"><div className="w-5 h-5 border-2 border-ds-gold border-t-transparent rounded-full animate-spin"></div></div>}
                            </div>
                        ))
                    )}
                </div>

                {/* Workflow Interface */}
                <div className="flex-1 luxury-panel rounded-3xl p-8 flex flex-col gap-6 bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
                    {/* Neural Pulse Background for Loading */}
                    {isPlanning && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-ds-gold/5 via-transparent to-transparent animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ds-gold/20 to-transparent animate-[scan-x_3s_infinite]" />
                        </div>
                    )}

                    {/* Master Description Box */}
                    <div className="flex-1 flex flex-col gap-3 relative z-10">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-ds-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isPlanning || currentStep?.status === 'prompting' ? 'bg-ds-gold animate-ping' : 'bg-ds-gold/30'}`} />
                                รายละเอียดซีน (Master Description)
                            </label>
                            {currentStep && !isPlanning && (
                                <button onClick={handleSync} className="text-ds-gold p-1 hover:bg-ds-gold/5 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                            )}
                        </div>
                        <div className="relative flex-1 group">
                            <textarea 
                                className={`w-full h-full bg-gray-50/50 rounded-2xl p-4 text-sm text-gray-700 resize-none outline-none focus:ring-1 focus:ring-ds-gold/30 shadow-inner transition-all custom-scrollbar font-medium leading-relaxed border border-transparent ${isPlanning ? 'neural-pulse border-ds-gold/10' : ''}`} 
                                value={currentStep?.draftDescription || ''} 
                                onChange={(e) => currentStep && onUpdateStep(currentStep.id, { draftDescription: e.target.value })} 
                                placeholder={isPlanning ? "กำลังวิเคราะห์ลำดับการผลิต..." : "เลือกซีนเพื่อจัดการรายละเอียด..."}
                                disabled={isPlanning}
                            />
                            {isPlanning && (
                                <div className="absolute bottom-4 right-4 text-[9px] font-bold text-ds-gold/40 tracking-widest animate-pulse">PLANNING_ACTIVE</div>
                            )}
                        </div>
                    </div>

                    {/* AI Prompt Box */}
                    <div className="flex-1 flex flex-col gap-3 relative z-10">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-ds-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isPlanning || currentStep?.status === 'generating' ? 'bg-black animate-ping' : 'bg-black/30'}`} />
                                คำสั่ง AI เชิงเทคนิค (Final Prompt)
                            </label>
                            {currentStep && !isPlanning && (
                                <button onClick={handleGeneratePrompt} disabled={!currentStep.draftDescription || currentStep.status === 'prompting'} className="text-[10px] bg-ds-gold hover:bg-ds-gold-dark text-white px-5 py-2 rounded-xl font-bold tracking-widest transition-all shadow-lg shadow-ds-gold/20 disabled:opacity-20">SYNTHESIZE</button>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <textarea 
                                className={`w-full h-full bg-gray-900 rounded-2xl p-4 text-[11px] text-ds-gold font-mono resize-none outline-none shadow-2xl leading-loose custom-scrollbar border border-transparent ${isPlanning || currentStep?.status === 'generating' ? 'neural-pulse-dark border-ds-gold/20' : ''}`} 
                                value={currentStep?.finalPrompt || ''} 
                                readOnly 
                                placeholder={isPlanning ? "// Synchronizing knowledge base..." : "// Awaiting technical directives..."} 
                            />
                        </div>
                    </div>

                    {/* Final CTA Button */}
                    {!isPlanning && currentStep && (
                        <button 
                            onClick={handleGenerateImage} 
                            disabled={!currentStep.finalPrompt || currentStep.status === 'generating' || currentStep.status === 'prompting'} 
                            className="w-full py-4.5 bg-ds-text hover:bg-black text-white font-bold rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 group"
                        >
                            {currentStep.status === 'generating' ? 'RENDERING PRODUCTION...' : 'PRODUCE AI CONTENT'}
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes scan-y { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.6; } 100% { transform: translateY(100%); opacity: 0; } }
                @keyframes scan-x { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                @keyframes neural-pulse { 0% { background: rgba(249, 250, 251, 1); } 50% { background: rgba(182, 150, 82, 0.05); } 100% { background: rgba(249, 250, 251, 1); } }
                @keyframes neural-pulse-dark { 0% { background: #111; } 50% { background: #1a150a; } 100% { background: #111; } }
                .neural-pulse { animation: neural-pulse 2s ease-in-out infinite; }
                .neural-pulse-dark { animation: neural-pulse-dark 1.5s ease-in-out infinite; }
                .py-4\\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
            `}</style>
        </main>
    );
};

export default PreviewGallery;
