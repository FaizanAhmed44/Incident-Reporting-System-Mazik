import React from "react";
import { Info } from "lucide-react";

// Define the Category interface based on provided array
interface Category {
  value: string;
  label: string;
  description: string;
  icon: string; // Emoji
  color: string; // Tailwind classes (e.g., 'bg-blue-50 border-blue-200 text-blue-700')
}

const categories: Category[] = [
  {
    value: "it-support",
    label: "IT Support",
    description: "Hardware, software, network issues",
    icon: "💻",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    value: "hr",
    label: "Human Resources",
    description: "Policy, benefits, workplace issues",
    icon: "👥",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    value: "facilities",
    label: "Facilities",
    description: "Building, equipment, maintenance",
    icon: "🏢",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    value: "security",
    label: "Security",
    description: "Unauthorized access, theft, threats",
    icon: "🔒",
    color: "bg-red-50 border-red-200 text-red-700",
  },
  {
    value: "finance",
    label: "Finance",
    description: "Budget issues, reimbursements, fraud",
    icon: "💰",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    value: "health-safety",
    label: "Health & Safety",
    description: "Injuries, hazards, compliance concerns",
    icon: "🩺",
    color: "bg-pink-50 border-pink-200 text-pink-700",
  },
  {
    value: "legal",
    label: "Legal",
    description: "Compliance, legal risks, disputes",
    icon: "⚖️",
    color: "bg-gray-50 border-gray-200 text-gray-700",
  },
  {
    value: "other",
    label: "Other",
    description: "Anything not covered above",
    icon: "❓",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
];

const CategoryDisplay: React.FC = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <label className="flex items-center text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 mb-4 space-x-2">
        <span>Available Categories</span>
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </label>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {categories.map((category) => (
          <div
            key={category.value}
            className={`min-w-[240px] sm:min-w-[280px] rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-gradient-to-br ${category.color} dark:bg-gray-800 dark:border-gray-600 hover:shadow-lg`}
          >
            <div className="text-center">
              <div className="mx-auto text-4xl sm:text-5xl mb-3">
                {category.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {category.label}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDisplay;