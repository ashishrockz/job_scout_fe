import React from 'react';

export const ZoomIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div
        className="animate-in fade-in zoom-in fill-mode-forwards opacity-0"
        style={{ animationDelay: `${delay}ms` }}
    >
        {children}
    </div>
);
