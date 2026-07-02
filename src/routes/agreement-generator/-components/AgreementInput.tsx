import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface AgreementInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function AgreementInput({ placeholder, className, onChange, ...props }: AgreementInputProps) {
  const [value, setValue] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);
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
        type="text"
        value={value}
        style={{ width: width ? `${Math.max(width, 96)}px` : undefined }}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
        className={cn(
          "bg-transparent border-b border-current outline-none px-1 mx-1.5 align-baseline text-primary",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    </span>
  );
}
