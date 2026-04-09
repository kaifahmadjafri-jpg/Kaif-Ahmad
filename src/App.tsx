import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Zap, 
  Home, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  Info,
  ChevronRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SolarSystemConfig, CalculationResults } from './types';
import { calculateSolarSystem } from './lib/solarUtils';
import { getSolarAdvice } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<'welcome' | 'inputs' | 'results'>('welcome');
  const [config, setConfig] = useState<SolarSystemConfig>({
    name: '',
    monthlyBill: 2000,
    availableSpace: 500,
    location: '',
  });
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleStart = () => {
    if (config.name.trim()) {
      setStep('inputs');
    }
  };

  const handleCalculate = async () => {
    const res = calculateSolarSystem(config);
    setResults(res);
    setStep('results');
    
    setLoadingAdvice(true);
    const aiAdvice = await getSolarAdvice(config, res);
    setAdvice(aiAdvice);
    setLoadingAdvice(false);
  };

  const reset = () => {
    setStep('welcome');
    setResults(null);
    setAdvice(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-yellow-200">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-yellow-100/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm mb-4">
                <Sun className="w-4 h-4 animate-spin-slow" />
                <span>Next-Gen Solar Advisor</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
                Go Solar with <span className="text-yellow-500">SolarWise</span>
              </h1>
              
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Ab solar lagwana hoga easy, smart aur fully guided. 
                Get expert advice for your home in seconds.
              </p>

              <Card className="max-w-md mx-auto border-none shadow-2xl shadow-yellow-100/50 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="name" className="text-slate-600">Aapka Naam?</Label>
                    <Input 
                      id="name"
                      placeholder="Enter your name" 
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="h-12 text-lg border-slate-200 focus:ring-yellow-500"
                    />
                  </div>

                  <Button 
                    onClick={handleStart}
                    disabled={!config.name.trim()}
                    className="w-full h-12 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg shadow-yellow-200 transition-all group"
                  >
                    Start Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
                {[
                  { icon: Zap, label: "Smart Tools" },
                  { icon: Calculator, label: "ROI Predictor" },
                  { icon: Sparkles, label: "AI Advisor" },
                  { icon: Leaf, label: "Eco Friendly" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-slate-400">
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'inputs' && (
            <motion.div
              key="inputs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => setStep('welcome')}>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </Button>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Hello, {config.name}! 👋</h2>
                  <p className="text-slate-500">Let's calculate the perfect solar system for your home.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Monthly Energy Bill
                    </CardTitle>
                    <CardDescription>Aapka mahine ka bijli ka bill kitna aata hai?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-4xl font-bold text-slate-900">₹{config.monthlyBill}</span>
                      <span className="text-slate-400 font-medium">INR / Month</span>
                    </div>
                    <Slider 
                      value={[config.monthlyBill]} 
                      max={50000} 
                      step={100} 
                      onValueChange={(val) => {
                        const value = Array.isArray(val) ? val[0] : val;
                        setConfig({ ...config, monthlyBill: value });
                      }}
                      className="py-4"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[1000, 2000, 5000, 10000].map(val => (
                        <Button 
                          key={val} 
                          variant="outline" 
                          size="sm"
                          onClick={() => setConfig({ ...config, monthlyBill: val })}
                          className={config.monthlyBill === val ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                        >
                          ₹{val}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-500" />
                      Rooftop Space
                    </CardTitle>
                    <CardDescription>Chhat par kitni jagah available hai?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-4xl font-bold text-slate-900">{config.availableSpace}</span>
                      <span className="text-slate-400 font-medium">Sq Ft</span>
                    </div>
                    <Slider 
                      value={[config.availableSpace]} 
                      max={5000} 
                      step={50} 
                      onValueChange={(val) => {
                        const value = Array.isArray(val) ? val[0] : val;
                        setConfig({ ...config, availableSpace: value });
                      }}
                      className="py-4"
                    />
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      <p>Standard 1kW system needs ~100 sq ft.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 border-none shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      Location & Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>City / Location</Label>
                      <Input 
                        placeholder="e.g. New York, Mumbai, London" 
                        value={config.location}
                        onChange={(e) => setConfig({ ...config, location: e.target.value })}
                        className="border-slate-200"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleCalculate}
                        disabled={!config.location}
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg"
                      >
                        Calculate My Savings
                        <Calculator className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 pb-20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Your Solar Blueprint ☀️</h2>
                  <p className="text-slate-500">Personalized for {config.name}</p>
                </div>
                <Button variant="outline" onClick={reset} className="self-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "System Size", value: `${results.recommendedCapacity} kW`, icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
                  { label: "Panel Count", value: results.estimatedPanels, icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50" },
                  { label: "Monthly Savings", value: `₹${results.monthlySavings.toFixed(0)}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
                  { label: "ROI Period", value: `${results.roiYears.toFixed(1)} Yrs`, icon: Zap, color: "text-blue-500", bg: "bg-blue-50" }
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-tight">{stat.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Detailed Breakdown */}
                <div className="md:col-span-1 space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Space Requirement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Required Space</span>
                        <span className="font-bold">{results.requiredArea} sq ft</span>
                      </div>
                      <Progress value={(results.requiredArea / config.availableSpace) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Used</span>
                        <span>{((results.requiredArea / config.availableSpace) * 100).toFixed(0)}% of available</span>
                      </div>
                      {results.requiredArea > config.availableSpace && (
                        <div className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex gap-2">
                          <Info className="w-4 h-4 flex-shrink-0" />
                          Warning: Required space exceeds available rooftop area.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg bg-green-600 text-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Leaf className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">Environmental Impact</p>
                          <p className="text-2xl font-bold">{results.carbonOffset.toFixed(1)} Tons</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Equivalent to planting <span className="text-white font-bold">{Math.round(results.carbonOffset * 45)} trees</span> every year.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: AI Advisor */}
                <div className="md:col-span-2">
                  <Card className="border-none shadow-2xl bg-white h-full flex flex-col overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          <CardTitle>Smart AI Advisor</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-none">
                          Expert Guidance
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Personalized suggestions based on your profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0">
                      <ScrollArea className="h-[500px] p-6">
                        {loadingAdvice ? (
                          <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 animate-pulse">Analyzing your energy profile...</p>
                          </div>
                        ) : advice ? (
                          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900">
                            <Markdown>{advice}</Markdown>
                          </div>
                        ) : (
                          <p className="text-center text-slate-400 py-20">No advice generated yet.</p>
                        )}
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="bg-slate-50 p-4 shrink-0">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Verified by SolarWise Smart Engine
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 backdrop-blur-md py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-slate-900">SolarWise</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 SolarWise Advisor. Go Solar. Save Future.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
