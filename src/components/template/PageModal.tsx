'use client';

import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ElementRef, ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  url?: string;
}

export default function PageModal({ children, url }: Props) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  const onDismiss = useCallback(() => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  }, []);

  return createPortal(
    <dialog
      className="rounded-md px-2 py-4"
      ref={dialogRef}
      onClose={onDismiss}
    >
      <div>
        <div className="absolute top-2 right-2">
          <button className="my-1" onClick={onDismiss}>
            ✕
          </button>
        </div>
        <div className="px-3">{children}</div>
      </div>
    </dialog>,
    document.getElementById('modal-root')!
  );
}
