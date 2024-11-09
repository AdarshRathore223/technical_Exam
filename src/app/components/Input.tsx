import React, { useState } from "react";

interface InputProps {
  label: string;
  name: string;
  required?: boolean;
  type: "text" | "date" | "number" | "textarea"; 
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  charLimit?: number; 
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  required,
  type,
  className,
  placeholder,
  onChange,
  charLimit,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [value, setValue] = useState("");

  // Handle input changes and enforce character limit
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let inputValue = e.target.value;

    if (type === "number") {
      const numericValue = inputValue.replace(/\./g, "");
      if (charLimit && numericValue.length > charLimit) return;

      if ((inputValue.match(/\./g) || []).length > 1) return;
    } else {
      if (charLimit && inputValue.length > charLimit) return;
    }

    setValue(inputValue);
    if (onChange) onChange(e);
  };

  const inputProps = {
    id: name,
    name,
    placeholder,
    onChange: handleChange,
    className: "w-full p-2 border border-gray-300 rounded-md",
    value,
  };

  return (
    <div className={`input-container ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600 font-extrabold">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          {...inputProps}
          className="w-full p-2 border border-gray-300 rounded-md"
          maxLength={charLimit} 
        />
      ) : (
        <input
          {...inputProps}
          type={type}
          {...(type === "date" && { max: today })}
          maxLength={type === "text" && charLimit ? charLimit : undefined} 
        />
      )}
      {charLimit && (
        <p className="text-xs text-gray-500 mt-1">
          {type === "number"
            ? `${value.replace(/\./g, "").length}/${charLimit} characters`
            : `${value.length}/${charLimit} characters`}
        </p>
      )}
    </div>
  );
};

export default Input;
