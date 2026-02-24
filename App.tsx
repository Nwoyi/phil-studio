import React, { useState } from 'react';
import { AppView } from './types';
import { LayoutDashboard, Camera, Wand2, Clapperboard, BrainCircuit, Mic2, Menu, X, Layers, BookOpen } from 'lucide-react';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { LandingPage } from './views/LandingPage';
import { Dashboard } from './views/Dashboard';
import { StudioImage } from './views/StudioImage';
import { StudioVideo } from './views/StudioVideo';
import { BatchStudio } from './views/BatchStudio';
import { Editor } from './views/Editor';
import { Analyst } from './views/Analyst';
import { Voice } from './views/Voice';
import { Guide } from './views/Guide';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on landing page, render it exclusively without layout
  if (currentView === AppView.LANDING) {
      return <LandingPage onEnter={() => setCurrentView(AppView.DASHBOARD)} />;
  }

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        currentView === view
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
          : 'text-brand-400 hover:bg-brand-900 hover:text-brand-200'
      }`}
    >
      <Icon className={`w-5 h-5 ${currentView === view ? 'text-indigo-400' : 'group-hover:text-white'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-brand-950 text-brand-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-950 border-r border-brand-800 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-serif font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-tight">Phil Fash</h1>
              <p className="text-xs text-brand-500 font-medium tracking-widest uppercase">AI Studio</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Studio Overview" />
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Production</p>
            </div>
            <NavItem view={AppView.STUDIO_IMAGE} icon={Camera} label="Catalog Generation" />
            <NavItem view={AppView.BATCH_STUDIO} icon={Layers} label="Batch Production" />
            <NavItem view={AppView.EDITOR} icon={Wand2} label="Magic Editor" />
            <NavItem view={AppView.STUDIO_VIDEO} icon={Clapperboard} label="Runway (Video)" />
            <NavItem view={AppView.VOICE} icon={Mic2} label="Voiceover" />
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Intelligence</p>
            </div>
            <NavItem view={AppView.ANALYST} icon={BrainCircuit} label="Trend Analyst" />

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Help</p>
            </div>
            <NavItem view={AppView.GUIDE} icon={BookOpen} label="Studio Manual" />
          </nav>

          <div className="mt-auto pt-6 border-t border-brand-900">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-brand-800 border border-brand-700"></div>
              <div className="text-sm">
                <p className="font-medium text-brand-200">Creative Director</p>
                <p className="text-brand-500 text-xs">Pro License Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-brand-800 bg-brand-950">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="font-serif font-bold text-xs">P</span>
            </div>
            <span className="font-serif font-bold">Phil Fash</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <ApiKeyChecker>
            <div className={currentView === AppView.DASHBOARD ? 'block h-full' : 'hidden'}>
              <Dashboard onViewChange={setCurrentView} />
            </div>
            <div className={currentView === AppView.STUDIO_IMAGE ? 'block h-full' : 'hidden'}>
              <StudioImage />
            </div>
            <div className={currentView === AppView.BATCH_STUDIO ? 'block h-full' : 'hidden'}>
              <BatchStudio />
            </div>
            <div className={currentView === AppView.STUDIO_VIDEO ? 'block h-full' : 'hidden'}>
              <StudioVideo />
            </div>
            <div className={currentView === AppView.EDITOR ? 'block h-full' : 'hidden'}>
              <Editor />
            </div>
            <div className={currentView === AppView.ANALYST ? 'block h-full' : 'hidden'}>
              <Analyst />
            </div>
            <div className={currentView === AppView.VOICE ? 'block h-full' : 'hidden'}>
              <Voice />
            </div>
            <div className={currentView === AppView.GUIDE ? 'block h-full' : 'hidden'}>
              <Guide />
            </div>
          </ApiKeyChecker>
        </div>
      </main>
    </div>
  );
};