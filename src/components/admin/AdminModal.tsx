"use client";

import type { ReactNode } from "react";
import { useId, useRef } from "react";

type Props = {
  title: string;
  triggerLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  eyebrow?: string;
  triggerClassName?: string;
};

export function AdminModal({ title, triggerLabel, children, footer, eyebrow = "EDIÇÃO", triggerClassName = "btn" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => dialogRef.current?.showModal()}>{triggerLabel}</button>
      <dialog ref={dialogRef} className="admin-modal" aria-labelledby={titleId}>
        <div className="admin-modal-header">
          <div><span>{eyebrow}</span><h2 id={titleId}>{title}</h2></div>
          <button type="button" className="admin-icon-button" onClick={() => dialogRef.current?.close()} aria-label="Fechar janela">Fechar</button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer ? <div className="admin-modal-footer">{footer}</div> : null}
      </dialog>
    </>
  );
}
