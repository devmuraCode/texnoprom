"use client";

import React from "react";

type Item = {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
};

type Props = {
  items: Item[];
  activeKey?: string;
  onChange?: (key: string) => void;
};

export function Accordion({ items, activeKey, onChange }: Props) {
  return (
    <div className="divide-y rounded-lg border">
      {items.map((it) => {
        const open = it.key === activeKey;

        return (
          <div key={it.key}>
            <button
              type="button"
              onClick={() => onChange?.(open ? "" : it.key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-medium">{it.label}</span>
              <span
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {open && <div className="px-4 pb-4">{it.children}</div>}
          </div>
        );
      })}
    </div>
  );
}
