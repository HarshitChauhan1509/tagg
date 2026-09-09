"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Camera, X, Check, RefreshCcw, Image as ImageIcon } from "lucide-react";
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
  const workerRef = useRef<Worker | null>(null);
  const webcamRef = useRef<Webcam>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Create the worker
    const w = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module'
    });

    w.addEventListener('message', (e) => {
      const { status, message, result, error, progress } = e.data;
      if (status === 'progress_msg') {
        setScanMessage(message);
      } else if (status === 'progress') {
        if (progress.status === 'progress') {
          setScanMessage(`Downloading AI... ${progress.progress ? Math.round(progress.progress) : 0}%`);
        } else if (progress.status === 'ready') {
          setScanMessage("AI model ready!");
        } else if (progress.status === 'initiate') {
          setScanMessage("Initializing AI weights...");
        }
      } else if (status === 'complete') {
        setScannedData(result);
        setIsScanning(false);
      } else if (status === 'error') {
        console.error("AI Error:", error);
        setScanMessage("Analysis failed. Please try again.");
        setIsScanning(false);
      }
    });

    w.addEventListener('error', (e) => {
      console.error("Worker Global Error:", e);
      setScanMessage("Worker crashed. Check console.");
      setIsScanning(false);
    });

    workerRef.current = w;

    return () => {
      w.terminate();
    };
  }, []);

  const processImage = (base64Img: string) => {
    setIsScanning(true);
    setScanMessage("Waking up AI...");
    if (workerRef.current) {
      workerRef.current.postMessage({ imageBase64: base64Img });
    } else {
      setScanMessage("AI Worker not initialized. Please refresh.");
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
      <div className="flex flex-col min-h-[100dvh] px-6 py-6 pb-32 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 mt-4">
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

        <div className="rounded-2xl overflow-hidden aspect-[3/4] mb-6 shadow-md border border-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Scanned clothing" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</label>
            <input 
              type="text" 
              value={scannedData.type} 
              onChange={(e) => updateScannedData('type', e.target.value)}
              className="w-full text-xl border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-dark bg-transparent font-medium capitalize"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Color</label>
              <input 
                type="text" 
                value={scannedData.color} 
                onChange={(e) => updateScannedData('color', e.target.value)}
                className="w-full text-lg border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-dark bg-transparent capitalize"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</label>
              <input 
                type="text" 
                value={scannedData.category} 
                onChange={(e) => updateScannedData('category', e.target.value)}
                className="w-full text-lg border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-dark bg-transparent capitalize"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Style</label>
              <input 
                type="text" 
                value={scannedData.style} 
                onChange={(e) => updateScannedData('style', e.target.value)}
                className="w-full text-lg border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-dark bg-transparent capitalize"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Fit</label>
              <input 
                type="text" 
                value={scannedData.fit} 
                onChange={(e) => updateScannedData('fit', e.target.value)}
                className="w-full text-lg border-b-2 border-neutral-200 py-2 focus:outline-none focus:border-brand-dark bg-transparent capitalize"
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-50">
          <div className="max-w-md w-full pointer-events-auto">
            <button
              onClick={handleSave}
              className="w-full bg-brand-dark text-brand-light rounded-full py-4 text-lg font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-xl"
            >
              Add to Wardrobe
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <button onClick={() => router.back()} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera / Loading Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {!image ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Captured" className="w-full h-full object-cover blur-sm brightness-50" />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className="w-64 h-64 border-2 border-brand-accent rounded-3xl relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-brand-accent shadow-[0_0_15px_rgba(204,255,0,1)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
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
          <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none">
            <div className="w-full h-full border-2 border-white/30 rounded-3xl" />
          </div>
        )}
      </div>

      {/* Controls */}
      {!image && (
        <div className="h-32 bg-black flex items-center justify-around px-8 pb-8 pt-4 z-50">
          <label className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
            <ImageIcon className="w-5 h-5" />
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          
          <button 
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1"
          >
            <div className="w-full h-full bg-white rounded-full hover:scale-95 transition-transform" />
          </button>
          
          <div className="w-12 h-12" /> {/* Empty div for flex balance */}
        </div>
      )}
    </div>
  );
}
