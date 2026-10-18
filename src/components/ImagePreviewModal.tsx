import { useEffect, useRef, useState } from 'react';
import type { ListItem } from '../types';

const EXIT_DURATION_MS = 220;

type ImagePreviewModalProps = {
  item: ListItem | null;
  onClose: () => void;
};

export function ImagePreviewModal({ item, onClose }: ImagePreviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item) return;

    if (!dialog.open) dialog.showModal();
    setClosing(false);
    setEntered(false);
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(frame);
  }, [item]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      dialogRef.current?.close();
      onClose();
    }, EXIT_DURATION_MS);
  };

  const isOpen = entered && !closing;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
      className={`m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-[#17221dcc] backdrop:transition-opacity backdrop:duration-[220ms] ${
        isOpen ? 'backdrop:opacity-100' : 'backdrop:opacity-0'
      }`}
    >
      {item && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
          <img
            className={`pointer-events-auto max-h-[80vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-[0_20px_60px_#00000055] transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[40vh] opacity-0'
            }`}
            src={item.image}
            alt=""
          />
        </div>
      )}
    </dialog>
  );
}
