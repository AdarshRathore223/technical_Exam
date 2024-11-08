import React, { useState } from "react";

interface DropdownInputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  charLimit?: number; // Added charLimit prop to restrict characters
  className?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  name,
  label,
  placeholder,
  options,
  required,
  onChange,
  charLimit,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Check character limit if the charLimit is set
    if (charLimit && value.length > charLimit) {
      value = value.slice(0, charLimit); // Trim the value to the limit
      setError(`Character limit of ${charLimit} exceeded!`);
    } else {
      setError(null); // Reset error if under the limit
    }

    setInputValue(value);

    setIsDropdownVisible(
      Boolean(
        value &&
          options.some((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          )
      )
    );
    onChange(value);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsDropdownVisible(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={name} className="block text-xs text-gray-700">
        {label} {required && <span className="text-red-600 font-extrabold">*</span>}
      </label>
      <input
        type="text"
        id={name}
        required={required}
        name={name}
        className="mt-1 block w-full border border-gray-400 shadow-sm bg-transparent p-2"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />

      {isDropdownVisible && (
        <div className="absolute mt-1 w-full border border-gray-400 bg-white shadow-lg z-10">
          {options
            .filter((option) =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((filteredOption) => (
              <div
                key={filteredOption}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOptionClick(filteredOption)}
              >
                {filteredOption}
              </div>
            ))}
        </div>
      )}

      {error && (
        <div className="text-red-600 text-xs mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
