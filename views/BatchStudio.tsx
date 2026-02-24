import React, { useState } from 'react';
import { generateImagePro, optimizePrompt } from '../services/geminiService';
import { Plus, Play, Trash2, Download, Layers, CheckCircle2, AlertCircle, Loader2, Package, Sparkles, RefreshCw } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

interface BatchItem {
  id: string;
  name: string;
  description: string;
  style: string;
  status: 'idle' | 'generating' | 'completed' | 'error';
  imageUrl?: string;
  error?: string;
}

export const BatchStudio: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', style: 'Studio Minimal' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [mode, setMode] = useState<'form' | 'bulk'>('form');
  const [optimizing, setOptimizing] = useState(false);

  const styles = ['Studio Minimal', 'Urban Street', 'Nature/Outdoor', 'Futuristic Neon', 'Vintage Editorial'];

  const handleAddItem = () => {
    if (!newItem.name || !newItem.description) return;
    
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      ...newItem,
      status: 'idle'
    }]);
    setNewItem({ ...newItem, name: '', description: '' });
  };

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    
    // Simple parser: assumes "Name | Description | Style" per line
    const lines = bulkInput.trim().split('\n');
    const newItems: BatchItem[] = lines.map(line => {
      const [name, description, style] = line.split('|').map(s => s.trim());
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: name || 'Untitled Product',
        description: description || 'No description provided',
        style: style || 'Studio Minimal',
        status: 'idle'
      };
    });

    setItems([...items, ...newItems]);
    setBulkInput('');
    setMode('form');
  };

  const loadSampleData = () => {
    const samples: BatchItem[] = [
        { id: '1', name: 'Velvet Evening Gown', description: 'Deep red velvet, floor length, off-shoulder design, elegant drape', style: 'Studio Minimal', status: 'idle' },
        { id: '2', name: 'Cyberpunk Jacket', description: 'Holographic material, high collar, LED accents, oversized fit', style: 'Futuristic Neon', status: 'idle' },
        { id: '3', name: 'Linen Summer Set', description: 'Beige linen shirt and shorts, breathable fabric, relaxed fit', style: 'Nature/Outdoor', status: 'idle' }
    ];
    setItems([...items, ...samples]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const handleOptimize = async () => {
    if (!newItem.description) return;
    setOptimizing(true);
    try {
      const betterPrompt = await optimizePrompt(newItem.description, 'image');
      setNewItem({ ...newItem, description: betterPrompt });
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setOptimizing(false);
    }
  };

  const processBatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    // Process all items that are not 'completed'
    // We update state as we go to show progress
    const pendingItems = items.filter(i => i.status !== 'completed');
    
    // We'll process them concurrently but updating state individually
    await Promise.all(pendingItems.map(async (item) => {
        // Update to generating
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'generating' } : i));

        try {
            const prompt = `Professional fashion photography of ${item.name}. Description: ${item.description}. Style: ${item.style}. High quality, 4k, detailed textures, commercial look.`;
            const imageUrl = await generateImagePro(prompt, '1K'); // Use 1K for batch to be faster
            
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed', imageUrl } : i));
        } catch (error: any) {
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: error.message } : i));
        }
    }));

    setIsProcessing(false);
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="h-full flex flex-col gap-6">
      {isProcessing && <LoadingOverlay isVisible={true} message={`Processing Batch...`} subMessage={`${completedCount}/${items.length} Assets Generated`} />}

      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-serif font-bold">Batch Production</h2>
            <p className="text-brand-400 text-sm">Generate multiple catalog assets simultaneously from a product list.</p>
        </div>
        <div className="flex gap-3">
             <button onClick={loadSampleData} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-2">
                Load Sample Data
            </button>
            <button 
                onClick={clearAll}
                disabled={items.length === 0 || isProcessing}
                className="px-4 py-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 text-sm font-medium transition-colors disabled:opacity-50"
            >
                Clear Queue
            </button>
            <button 
                onClick={processBatch}
                disabled={items.length === 0 || isProcessing || completedCount === items.length}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20"
            >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Generate Batch
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Input Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-brand-900 border border-brand-800 rounded-2xl p-6">
                <div className="flex gap-2 mb-6 p-1 bg-brand-950 rounded-lg border border-brand-800">
                    <button 
                        onClick={() => setMode('form')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${mode === 'form' ? 'bg-brand-800 text-white shadow' : 'text-brand-400 hover:text-brand-300'}`}
                    >
                        Single Entry
                    </button>
                    <button 
                         onClick={() => setMode('bulk')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${mode === 'bulk' ? 'bg-brand-800 text-white shadow' : 'text-brand-400 hover:text-brand-300'}`}
                    >
                        Bulk Text
                    </button>
                </div>

                {mode === 'form' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1.5">Product Name</label>
                            <input 
                                type="text" 
                                value={newItem.name}
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                                className="w-full bg-brand-950 border border-brand-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Silk Evening Dress"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-semibold text-brand-500 uppercase tracking-wide">Visual Description</label>
                                <button 
                                    onClick={handleOptimize}
                                    disabled={optimizing || !newItem.description}
                                    className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-0.5 rounded-md"
                                >
                                    {optimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    {optimizing ? "Enhancing..." : "Optimize"}
                                </button>
                            </div>
                            <textarea 
                                value={newItem.description}
                                onChange={e => setNewItem({...newItem, description: e.target.value})}
                                className="w-full bg-brand-950 border border-brand-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                                placeholder="Details about fabric, fit, color, and mood..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1.5">Style / Setting</label>
                            <select 
                                value={newItem.style}
                                onChange={e => setNewItem({...newItem, style: e.target.value})}
                                className="w-full bg-brand-950 border border-brand-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {styles.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={handleAddItem}
                            disabled={!newItem.name || !newItem.description}
                            className="w-full py-3 mt-2 bg-brand-800 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            Add to Queue
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 h-full flex flex-col">
                         <div className="flex-1">
                            <label className="block text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1.5">Paste Data (Name | Desc | Style)</label>
                            <textarea 
                                value={bulkInput}
                                onChange={e => setBulkInput(e.target.value)}
                                className="w-full h-48 bg-brand-950 border border-brand-700 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder={`Silk Dress | Red, long | Studio Minimal\nDenim Jacket | Blue, vintage | Urban Street`}
                            />
                        </div>
                         <button 
                            onClick={handleBulkAdd}
                            disabled={!bulkInput.trim()}
                            className="w-full py-3 bg-brand-800 hover:bg-brand-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Layers className="w-4 h-4" />
                            Parse & Add
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-4 flex items-start gap-3">
                <Package className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-indigo-300">Batch Optimization</h4>
                    <p className="text-xs text-indigo-400/80 mt-1">
                        Images are generated using Gemini 3 Pro at 1K resolution for optimal speed.
                    </p>
                </div>
            </div>
        </div>

        {/* Queue / Results Column */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-brand-950 border border-brand-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-brand-800 bg-brand-900/50 flex justify-between items-center">
                <h3 className="font-semibold text-brand-200">Production Queue ({items.length})</h3>
                {items.length > 0 && (
                     <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-brand-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs text-brand-500">{Math.round(progress)}%</span>
                     </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-brand-700 opacity-50">
                        <Layers className="w-16 h-16 mb-4" />
                        <p>Queue is empty</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="bg-brand-900 border border-brand-800 rounded-xl p-4 flex gap-4 transition-all hover:border-brand-700 group">
                            {/* Thumbnail Area */}
                            <div className="w-24 h-24 bg-brand-950 rounded-lg border border-brand-800 shrink-0 overflow-hidden flex items-center justify-center relative">
                                {item.status === 'completed' && item.imageUrl ? (
                                     // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : item.status === 'generating' ? (
                                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                ) : item.status === 'error' ? (
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                ) : (
                                    <span className="text-xs text-brand-600 font-medium">Pending</span>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-brand-200 truncate pr-4">{item.name}</h4>
                                    <div className="flex items-center gap-2">
                                         {item.status === 'completed' ? (
                                            <span className="text-xs text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Done
                                            </span>
                                         ) : item.status === 'error' ? (
                                             <span className="text-xs text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/50">Failed</span>
                                         ) : (
                                            <span className="text-xs text-brand-500 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">{item.status}</span>
                                         )}
                                    </div>
                                </div>
                                <p className="text-xs text-brand-500 truncate mb-1">{item.description}</p>
                                <p className="text-[10px] text-brand-600 uppercase tracking-wider">{item.style}</p>
                            </div>

                            {/* Actions Area */}
                            <div className="flex flex-col justify-center gap-2 pl-4 border-l border-brand-800/50">
                                {item.status === 'completed' && item.imageUrl && (
                                    <a 
                                        href={item.imageUrl} 
                                        download={`tameyo-${item.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                                        className="p-2 text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-brand-600 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};