import { useEffect, useRef, useState } from "react";
import { Icon } from "../common/Icon";

interface ImageCropModalProps {
  file: File | null;
  onCancel: () => void;
  onCrop: (file: File) => void;
}

const CANVAS_SIZE = 600;

export function ImageCropModal({ file, onCancel, onCrop }: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [objectUrl, setObjectUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setZoom(1);
    setHorizontal(50);
    setVertical(50);
    setReady(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!ready) return;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const baseScale = Math.max(CANVAS_SIZE / image.naturalWidth, CANVAS_SIZE / image.naturalHeight);
    const scale = baseScale * zoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const x = Math.max(0, width - CANVAS_SIZE) * (horizontal / 100);
    const y = Math.max(0, height - CANVAS_SIZE) * (vertical / 100);

    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.drawImage(image, -x, -y, width, height);
  }, [ready, zoom, horizontal, vertical]);

  if (!file) return null;

  const finishCrop = () => {
    canvasRef.current?.toBlob(
      (blob) => {
        if (!blob) return;
        const baseName = file.name.replace(/\.[^.]+$/, "");
        onCrop(new File([blob], `${baseName}-cropped.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-on-surface">Crop student photo</h3>
            <p className="mt-1 text-xs text-on-surface-variant">Position the face inside the circular guide.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close crop tool" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-container-low cursor-pointer">
            <Icon name="close" />
          </button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-xl bg-surface-container-low">
          <img
            ref={imageRef}
            src={objectUrl}
            alt=""
            className="hidden"
            onLoad={() => setReady(true)}
          />
          <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-[7%] rounded-full border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.3)]" />
        </div>

        <div className="mt-5 space-y-3">
          <label className="grid grid-cols-[80px_1fr] items-center gap-3 text-xs font-bold text-on-surface-variant">
            Zoom
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <label className="grid grid-cols-[80px_1fr] items-center gap-3 text-xs font-bold text-on-surface-variant">
            Left / right
            <input type="range" min="0" max="100" value={horizontal} onChange={(e) => setHorizontal(Number(e.target.value))} />
          </label>
          <label className="grid grid-cols-[80px_1fr] items-center gap-3 text-xs font-bold text-on-surface-variant">
            Up / down
            <input type="range" min="0" max="100" value={vertical} onChange={(e) => setVertical(Number(e.target.value))} />
          </label>
        </div>

        <div className="mt-6 flex gap-3 border-t border-outline-variant/30 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm font-semibold cursor-pointer">Cancel</button>
          <button type="button" onClick={finishCrop} disabled={!ready} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50 cursor-pointer">
            Use cropped photo
          </button>
        </div>
      </div>
    </div>
  );
}
