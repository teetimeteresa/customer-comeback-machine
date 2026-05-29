'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/Button';
import { 
  ModernMinimalistSign, 
  RusticWarmthSign, 
  LuxuryGoldSign 
} from '@/components/templates/QRSignVariations';
import { 
  ComingSoonTemplate, 
  VIPClubTemplate, 
  BirthdayInviteTemplate, 
  SocialProofTemplate, 
  SupportLocalTemplate,
  SuggestedCaptions
} from '@/components/templates/SocialTemplates';
import { 
  Layout, 
  Image as ImageIcon, 
  Instagram, 
  Printer, 
  Copy, 
  Check,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

export default function AssetShowcase() {
  const [activeCategory, setActiveCategory] = useState<'signs' | 'social'>('signs');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const businessInfo = {
    name: "The Velvet Rose",
    type: "Boutique",
    url: "https://customer-comeback.machine/optin/velvet-rose"
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
              <Layout size={20} />
            </div>
            <h1 className="text-xl font-bold">Premium Asset Library</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveCategory('signs')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeCategory === 'signs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              QR Signs
            </button>
            <button 
              onClick={() => setActiveCategory('social')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeCategory === 'social' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Social Templates
            </button>
          </div>
        </header>

        <div className="p-12">
          {activeCategory === 'signs' ? (
            <div className="space-y-20">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Printable QR Signs</h2>
                    <p className="text-slate-500 mt-2">Premium variations for the $497 Setup Package.</p>
                  </div>
                </div>

                <div className="grid gap-16">
                  {/* Modern Minimalist */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">01. Modern Minimalist</h3>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} /> Export PDF
                      </Button>
                    </div>
                    <div className="bg-slate-200 p-10 rounded-[3rem] shadow-inner flex justify-center">
                      <div className="scale-[0.5] origin-top transform transition-transform hover:scale-[0.52]">
                        <ModernMinimalistSign {...businessInfo} />
                      </div>
                    </div>
                  </div>

                  {/* Rustic Warmth */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">02. Rustic Warmth</h3>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} /> Export PDF
                      </Button>
                    </div>
                    <div className="bg-slate-200 p-10 rounded-[3rem] shadow-inner flex justify-center">
                      <div className="scale-[0.5] origin-top transform transition-transform hover:scale-[0.52]">
                        <RusticWarmthSign {...businessInfo} />
                      </div>
                    </div>
                  </div>

                  {/* Luxury Gold */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">03. Luxury Gold</h3>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} /> Export PDF
                      </Button>
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[3rem] shadow-inner flex justify-center border-4 border-slate-900">
                      <div className="scale-[0.5] origin-top transform transition-transform hover:scale-[0.52]">
                        <LuxuryGoldSign {...businessInfo} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-20">
              <section>
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-slate-900">Social Media Templates</h2>
                  <p className="text-slate-500 mt-2">1080x1080 square templates for Instagram and Facebook.</p>
                </div>

                <div className="grid gap-24">
                  {/* Template 1 */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-slate-200 p-8 rounded-[2.5rem] shadow-inner">
                      <div className="scale-[0.4] origin-top-left transform transition-transform">
                        <ComingSoonTemplate {...businessInfo} brandTone="Friendly" />
                      </div>
                      <div className="h-[432px]"></div> {/* Spacer for scaled content */}
                    </div>
                    <div className="space-y-6 pt-4">
                      <h3 className="text-2xl font-black text-slate-900">"Something is Arriving"</h3>
                      <p className="text-slate-500">Perfect for the pre-launch phase to build anticipation.</p>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <p className="text-slate-700 italic">"{SuggestedCaptions.comingSoon(businessInfo.name)}"</p>
                        <button 
                          onClick={() => handleCopy(SuggestedCaptions.comingSoon(businessInfo.name), 'cap1')}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          {copiedIndex === 'cap1' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template 2 */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-slate-200 p-8 rounded-[2.5rem] shadow-inner">
                      <div className="scale-[0.4] origin-top-left transform transition-transform">
                        <VIPClubTemplate {...businessInfo} brandTone="Luxury" />
                      </div>
                      <div className="h-[432px]"></div>
                    </div>
                    <div className="space-y-6 pt-4">
                      <h3 className="text-2xl font-black text-slate-900">"Join the VIP Club"</h3>
                      <p className="text-slate-500">Direct call-to-action for customers to join the list.</p>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <p className="text-slate-700 italic">"{SuggestedCaptions.vipClub(businessInfo.name)}"</p>
                        <button 
                          onClick={() => handleCopy(SuggestedCaptions.vipClub(businessInfo.name), 'cap2')}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          {copiedIndex === 'cap2' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template 3 */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-slate-200 p-8 rounded-[2.5rem] shadow-inner">
                      <div className="scale-[0.4] origin-top-left transform transition-transform">
                        <BirthdayInviteTemplate {...businessInfo} brandTone="Friendly" />
                      </div>
                      <div className="h-[432px]"></div>
                    </div>
                    <div className="space-y-6 pt-4">
                      <h3 className="text-2xl font-black text-slate-900">"Birthday Gift"</h3>
                      <p className="text-slate-500">Focuses on the high-value birthday club offer.</p>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <p className="text-slate-700 italic">"{SuggestedCaptions.birthday()}"</p>
                        <button 
                          onClick={() => handleCopy(SuggestedCaptions.birthday(), 'cap3')}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          {copiedIndex === 'cap3' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template 4 */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-slate-200 p-8 rounded-[2.5rem] shadow-inner">
                      <div className="scale-[0.4] origin-top-left transform transition-transform">
                        <SocialProofTemplate {...businessInfo} brandTone="Professional" />
                      </div>
                      <div className="h-[432px]"></div>
                    </div>
                    <div className="space-y-6 pt-4">
                      <h3 className="text-2xl font-black text-slate-900">"Loved Your Visit?"</h3>
                      <p className="text-slate-500">Optimized for getting more Google reviews.</p>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <p className="text-slate-700 italic">"{SuggestedCaptions.socialProof()}"</p>
                        <button 
                          onClick={() => handleCopy(SuggestedCaptions.socialProof(), 'cap4')}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          {copiedIndex === 'cap4' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template 5 */}
                  <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-slate-200 p-8 rounded-[2.5rem] shadow-inner">
                      <div className="scale-[0.4] origin-top-left transform transition-transform">
                        <SupportLocalTemplate {...businessInfo} brandTone="Heartfelt" />
                      </div>
                      <div className="h-[432px]"></div>
                    </div>
                    <div className="space-y-6 pt-4">
                      <h3 className="text-2xl font-black text-slate-900">"Shop Small"</h3>
                      <p className="text-slate-500">Heartfelt community-focused message.</p>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                        <p className="text-slate-700 italic">"{SuggestedCaptions.supportLocal(businessInfo.type)}"</p>
                        <button 
                          onClick={() => handleCopy(SuggestedCaptions.supportLocal(businessInfo.type), 'cap5')}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          {copiedIndex === 'cap5' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
