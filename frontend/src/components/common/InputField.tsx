import React, { forwardRef } from "react";

// 공통 InputField 컴포넌트
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // 라벨 텍스트
  helperText?: string; // 입력창 아래에 표시될 도움말 텍스트
  errorMessage?: string; // 에러 발생 시 표시될 텍스트
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helperText, errorMessage, className = "", ...props }, ref) => {
    const hasError = !!errorMessage;
    const labelColor = hasError ? "text-red-500" : "text-primary-blue";
    const borderColor = hasError ? "border-red-500" : "border-black";
    const helperTextColor = hasError ? "text-red-500" : "text-primary-blue";

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <label
          htmlFor={props.id || props.name}
          className={`text-base font-bold font-['Pretendard'] ${labelColor}`}
        >
          {label}
        </label>

        <input
          ref={ref}
          className={`w-full border-b pb-2 text-base font-light font-['Pretendard'] bg-transparent placeholder-neutral-400 focus:outline-none focus:border-blue-800 ${borderColor}`}
          {...props}
        />

        {(helperText || errorMessage) && (
          <p
            className={`text-xs font-bold font-['Pretendard'] ${helperTextColor}`}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
