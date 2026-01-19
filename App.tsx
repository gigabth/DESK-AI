
import React, { useState } from 'react';
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
        setSteps([]); 
        
        try {
            const planDescriptions = await generateDraftPlan(products, count, concept, ratio, res);
            
            if (planDescriptions && Array.isArray(planDescriptions)) {
                const newSteps: GenerationStep[] = planDescriptions.map((desc, index) => ({
                    id: index,
                    status: 'waiting', 
                    draftDescription: desc, 
                    finalPrompt: '',
                    mediaType: mode,
                }));
                setSteps(newSteps);
            } else {
                throw new Error("Invalid plan data received.");
            }
        } catch (error: any) {
            console.error("Planning failed", error);
            alert(`ไม่สามารถสร้างแผนงานได้: ${error.message || 'Network Timeout'}`);
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
                onRefreshStep={deleteStep}
                selectedProducts={selectedProducts}
                isPlanning={isPlanning}
            />
        </div>
    );
};

export default App;
