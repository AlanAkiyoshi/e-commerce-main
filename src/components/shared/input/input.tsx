import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  inputCadastro?: boolean;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, inputCadastro, label, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label && (
          <label
            style={{
              paddingLeft: "5px",
              width: "100%",
              fontSize: "0.9rem",
              fontWeight: "550",
            }}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`${
            error ? "error" : inputCadastro ? "inputCadastro" : ""
          }`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
