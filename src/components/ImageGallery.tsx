"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import clsx from "clsx";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-[#151521] aspect-square group">
        <img
          src={images[active]}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1E1E2E]/90 text-[#FFFFFF] flex items-center justify-center shadow hover:bg-[#1E1E2E] transition-all opacity-0 group-hover:opacity-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1E1E2E]/90 text-[#FFFFFF] flex items-center justify-center shadow hover:bg-[#1E1E2E] transition-all opacity-0 group-hover:opacity-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        <button onClick={() => setZoom(true)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#1E1E2E]/90 text-[#FFFFFF] flex items-center justify-center shadow hover:bg-[#1E1E2E] transition-all opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-4 h-4" />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 text-xs bg-[#FF6B00]/50 text-white px-2 py-0.5 rounded-full">
            {active + 1}/{images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={clsx(
                "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                i === active ? "border-[#FF6B00] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              )}>
              <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoom(false)}>
          <button onClick={() => setZoom(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-[#1E1E2E]/30 transition-all">
            <X className="w-5 h-5" />
          </button>
          <img
            src={images[active]}
            alt={alt}
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
