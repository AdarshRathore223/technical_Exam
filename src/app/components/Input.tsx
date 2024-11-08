import React from "react";

// Define prop types for the Input component
interface InputProps {
  label: string;
  name: string;
  required?: boolean;
  type: "text" | "date" | "number" | "textarea"; // Add other types as needed
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Updated onChange for different input types
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  required,
  type,
  className,
  placeholder,
  onChange,
}) => {
  // Get today's date in YYYY-MM-DD format for the max date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`input-container ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600 font-extrabold">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>} // Casting for textareas
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} // Casting for other inputs
          className="w-full p-2 border border-gray-300 rounded-md"
          // If the type is 'date', set the max date to today
          {...(type === "date" && { max: today })}
        />
      )}
    </div>
  );
};

export default Input;
