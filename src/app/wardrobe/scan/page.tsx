"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Camera, X, Check, RefreshCcw, Image as ImageIcon, Sparkles } from "lucide-react";
import { useAppStore, ClothingItem } from "@/lib/store";

export default function ScanPage() {
  const router = useRouter();
  const addClothingItem = useAppStore((state) => state.addClothingItem);
  const user = useAppStore((state) => state.user);
  
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("Initializing AI model...");
  const [scannedData, setScannedData] = useState<Partial<ClothingItem> | null>(null);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const processImage = async (base64Img: string) => {
    setIsScanning(true);
    setScanMessage("Waking up AI...");
    
    try {
      const { analyzeImage } = await import('@/lib/ai/clientPipeline');
      const result = await analyzeImage(base64Img, (msg) => {
        setScanMessage(msg);
      });
      
      setScannedData(result);
    } catch (error) {
      console.error("Analysis Error:", error);
      setScanMessage("Analysis failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      processImage(imageSrc);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Strings) => {
      const first = base64Strings[0];
      const rest = base64Strings.slice(1);
      
      setImage(first);
      setUploadQueue(rest);
      processImage(first);
    });
  };

  const handleSave = () => {
    if (isScanning) return; // Prevent double clicks
    
    if (image && scannedData && user) {
      addClothingItem({
        ...scannedData,
        id: Date.now().toString(),
        userId: user.id,
        image,
        createdAt: Date.now(),
      } as ClothingItem);
      
      if (uploadQueue.length > 0) {
        // Process next item
        const next = uploadQueue[0];
        setUploadQueue(prev => prev.slice(1));
        setImage(next);
        setScannedData(null);
        processImage(next);
      } else {
        router.push("/wardrobe");
      }
    }
  };

  const updateScannedData = (field: keyof ClothingItem, value: string) => {
    setScannedData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  if (scannedData && image) {
    return (
      <div className="flex flex-col md:flex-row gap-8 min-h-[100dvh] pb-32 pt-4 w-full max-w-5xl mx-auto">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h1 className="font-serif text-3xl font-bold text-brand-dark">
              {uploadQueue.length > 0 ? `Review (${uploadQueue.length + 1} left)` : 'Review Item'}
            </h1>
            <button onClick={() => { 
              if (uploadQueue.length > 0) {
                const next = uploadQueue[0];
                setUploadQueue(prev => prev.slice(1));
                setImage(next);
                setScannedData(null);
                processImage(next);
              } else {
                setImage(null); 
                setScannedData(null); 
              }
            }} className="p-2 bg-neutral-100 rounded-full">
              <X className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[3/4] w-full neo-border neo-shadow bg-neutral-100 sticky top-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Scanned clothing" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col md:py-8">
          <div className="hidden md:flex justify-between items-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-brand-dark">
              {uploadQueue.length > 0 ? `Review (${uploadQueue.length + 1} left)` : 'Review Item'}
            </h1>
            <button onClick={() => { 
              if (uploadQueue.length > 0) {
                const next = uploadQueue[0];
                setUploadQueue(prev => prev.slice(1));
                setImage(next);
                setScannedData(null);
                processImage(next);
              } else {
                setImage(null); 
                setScannedData(null); 
              }
            }} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors">
              <X className="w-6 h-6 text-neutral-500" />
            </button>
          </div>

          <div className="space-y-6 flex-1 mt-6 md:mt-0">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Type</label>
              <input 
                type="text" 
                value={scannedData.type} 
                onChange={(e) => updateScannedData('type', e.target.value)}
                className="w-full text-2xl border-b-4 border-neutral-200 py-3 focus:outline-none focus:border-brand-accent bg-transparent font-bold capitalize text-brand-dark transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Color</label>
                <input 
                  type="text" 
                  value={scannedData.color} 
                  onChange={(e) => updateScannedData('color', e.target.value)}
                  className="w-full text-xl border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-accent bg-transparent capitalize font-medium transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</label>
                <input 
                  type="text" 
                  value={scannedData.category} 
                  onChange={(e) => updateScannedData('category', e.target.value)}
                  className="w-full text-xl border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-accent bg-transparent capitalize font-medium transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Style</label>
                <input 
                  type="text" 
                  value={scannedData.style} 
                  onChange={(e) => updateScannedData('style', e.target.value)}
                  className="w-full text-xl border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-accent bg-transparent capitalize font-medium transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Fit</label>
                <input 
                  type="text" 
                  value={scannedData.fit} 
                  onChange={(e) => updateScannedData('fit', e.target.value)}
                  className="w-full text-xl border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-accent bg-transparent capitalize font-medium transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 mb-4">
            <button
              onClick={handleSave}
              disabled={isScanning}
              className="w-full bg-brand-dark text-brand-light neo-border neo-shadow rounded-full py-4 text-xl font-bold flex items-center justify-center gap-2 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Processing...' : 'Add to Wardrobe'}
              <Check className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40">
        <button onClick={() => router.back()} className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera / Loading Area */}
      <div className="flex-1 relative w-full h-full">
        {!image ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full absolute inset-0 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Captured" className="w-full h-full object-cover blur-md brightness-[0.3]" />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className="w-48 h-48 border-2 border-brand-accent rounded-full relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-brand-accent/20"
                    animate={{ top: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-brand-accent" />
                  </div>
                </motion.div>
                <motion.p 
                  className="text-white mt-8 font-medium tracking-wide text-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {scanMessage}
                </motion.p>
              </div>
            )}
          </div>
        )}

        {/* Framing Guides */}
        {!image && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
            <div className="w-full max-w-sm aspect-[3/4] border-2 border-white/30 rounded-[3rem]" />
          </div>
        )}
      </div>

      {/* Controls */}
      {!image && (
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex items-center justify-center gap-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <label className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors border border-white/10">
            <ImageIcon className="w-6 h-6" />
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          
          <button 
            onClick={capture}
            className="w-24 h-24 rounded-full border-[6px] border-white/80 flex items-center justify-center p-1 hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-white rounded-full" />
          </button>
          
          <div className="w-14 h-14" /> {/* Empty div for flex balance */}
        </div>
      )}
    </div>
  );
}
