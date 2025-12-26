import React, { ReactNode } from 'react';

interface CalculatorWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  category?: string;
}

const CalculatorWrapper = ({ children, title, description, category }: CalculatorWrapperProps) => {
  return (
    <div className="min-h-screen bg-brand-background p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-brand-primary">{title}</h1>
          <p className="text-slate-500 mt-2">{description}</p>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};
export default CalculatorWrapper;
