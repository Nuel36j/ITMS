import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";

const inputClasses =
  "w-full rounded-sm border border-ink/25 bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint " +
  "focus:border-stamp focus:outline-none focus:ring-1 focus:ring-stamp disabled:bg-paper disabled:text-ink-faint";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-rust"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p className="text-xs text-rust" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, required, className = "", ...props }, ref) => {
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          className={`${inputClasses} ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, required, className = "", children, ...props }, ref) => {
    const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} htmlFor={selectId} error={error} hint={hint} required={required}>
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          className={`${inputClasses} ${className}`}
          {...props}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, required, className = "", ...props }, ref) => {
    const areaId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} htmlFor={areaId} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          id={areaId}
          required={required}
          aria-invalid={!!error}
          className={`${inputClasses} min-h-[6rem] resize-y`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";
