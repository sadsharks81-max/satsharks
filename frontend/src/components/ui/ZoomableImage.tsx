import { useState } from "react";
import { Icon } from "../common/Icon";

interface ZoomableImageProps {
  src: string;
  alt?: string;
}

export function ZoomableImage({ src, alt = "Question Reference" }: ZoomableImageProps) {
  const [zoom, setZoom] = useState(100);
  
  const handleZoomIn = () => setZoom(z => Math.min(z + 20, 300));
  const handleZoomOut = () => setZoom(z => Math.max(z - 20, 40));
  const handleReset = () => setZoom(100);

  return (
    <div className="w-full flex flex-col border border-outline-variant/50 rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm mb-6">
      {/* Toolbar */}
      <div className="bg-surface-container-low px-4 py-1.5 flex items-center justify-center gap-3 border-b border-outline-variant/30 text-[13px] text-on-surface font-medium select-none">
        <button onClick={handleZoomIn} className="p-1 hover:text-primary transition-colors cursor-pointer" title="Zoom In">
          <Icon name="zoom_in" className="text-[18px]" />
        </button>
        <button onClick={handleZoomOut} className="p-1 hover:text-primary transition-colors cursor-pointer" title="Zoom Out">
          <Icon name="zoom_out" className="text-[18px]" />
        </button>
        <span className="w-12 text-center">{zoom}%</span>
        <div className="w-[1px] h-4 bg-outline-variant/50 mx-1"></div>
        <button onClick={handleReset} className="hover:text-primary transition-colors cursor-pointer font-semibold px-2">
          Reset
        </button>
      </div>
      
      {/* Image Container */}
      <div className="relative w-full h-[320px] overflow-auto flex items-center justify-center bg-surface-container-lowest p-2 custom-scrollbar">
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: zoom === 100 ? '100%' : `${zoom}%`,
            height: zoom === 100 ? '100%' : 'auto',
            objectFit: zoom === 100 ? 'contain' : 'initial',
            transition: 'width 0.2s ease-out' 
          }} 
          className="rounded-md"
        />
      </div>
    </div>
  );
}
