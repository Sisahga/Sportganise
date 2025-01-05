// SectionWrapper.tsx
import React from "react";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children }) => {
  return (
    <div className="mt-4 px-4">
      <h2 className="font-semibold text-lg text-gray-700">{title}</h2>
      <div className="px-4 py-3 bg-white mt-4 rounded-lg shadow">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
