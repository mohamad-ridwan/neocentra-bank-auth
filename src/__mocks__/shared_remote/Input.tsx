import React from 'react';
export const Input = React.forwardRef<HTMLInputElement, any>(
  ({ label, value, onChange, placeholder, type = 'text', required, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  )
);
Input.displayName = 'Input';
