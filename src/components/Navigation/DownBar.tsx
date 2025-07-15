import React from 'react';

interface DownBarProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const DownBar: React.FC<DownBarProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="bg-white shadow-md border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange?.(category)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownBar;
