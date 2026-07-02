import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface AgreementInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (v: string) => void;
}

export function AgreementInput({ value, onChange, placeholder, className, ...props }: AgreementInputProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    if (spanRef.current) setWidth(spanRef.current.offsetWidth);
  }, [value, placeholder]);

  return (
    <span className="relative inline-block align-baseline">
      <span ref={spanRef} className="invisible absolute whitespace-pre px-1" aria-hidden>
        {value || placeholder || ""}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        style={{ width: width ? `${Math.max(width, 16)}px` : undefined }}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-transparent border-b border-current outline-none px-1 align-baseline text-primary",
          inputRef.current?.value === "" && "text-red-400",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    </span>
  );
}
