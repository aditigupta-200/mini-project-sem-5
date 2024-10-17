import React from 'react';

const Logo = ({ alt, className, ...props }) => (
  <img
    src="/yatrasahayaklogo.jpg"  // Replace with the actual path to your logo image
    alt={alt || "Company Logo"}
    className={`h-24 w-auto ${className || ''}`}  // Adjust the default height as needed
    {...props}
  />
);

export default Logo;