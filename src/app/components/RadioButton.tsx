import React from "react";

interface RadioButtonProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="col-span-2">
      <label className="block text-sm font-bold mt-5">{label}</label>
      <div className="mt-2 flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="text-blue-600 border-gray-300 focus:ring-blue-500 m-3"
              aria-checked={selectedValue === option.value} // Improved accessibility
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
