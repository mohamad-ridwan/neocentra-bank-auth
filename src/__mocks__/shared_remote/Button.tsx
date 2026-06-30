import React from 'react';
export const Button = React.forwardRef<HTMLButtonElement, any>(
  ({ children, loading, ...props }, ref) => (
    <button ref={ref} disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  )
);
Button.displayName = 'Button';
