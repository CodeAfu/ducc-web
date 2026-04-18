import React, { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

interface ElementCardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: number[];
  onValueChange?: (val: number) => void;
  min?: number;
  max?: number;
}

export default function ElementCardInput({
  defaultValue,
  options,
  onValueChange,
  className,
  min = 0,
  max = 100,
  ...props
}: ElementCardInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState(defaultValue);

  useEffect(() => {
    setVal(defaultValue ?? "");
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isControlKey = [
      "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter"
    ].includes(e.key);

    const isNumber = /^[0-9]$/.test(e.key);

    if (!isControlKey && !isNumber) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    if (rawValue === "") {
      setVal("");
      return;
    }

    const num = parseInt(rawValue, 10);
    if (isNaN(num)) return;

    const constrainedValue = Math.max(min, Math.min(max, num));
    setVal(constrainedValue);
    onValueChange?.(constrainedValue);
  };

  const handleSelect = (num: number) => {
    setVal(num);
    setIsOpen(false);
    onValueChange?.(num);
  };

  return (
    <div className="relative inline-block w-full">
      <input
        type="number"
        value={val}
        min={min}
        max={max}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        onFocus={(e) => {
          setIsOpen(true);
          e.currentTarget.select();
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={cn(
          "w-full bg-transparent text-center outline-none transition-colors",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          isOpen ? "text-primary font-bold ring-1 ring-primary/30 rounded" : "text-foreground",
          className
        )}
        {...props}
      />

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-60 bg-popover border rounded shadow-md max-h-32 overflow-y-auto min-w-16">
          {options.map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(num)}
              className={cn(
                "w-full px-2 py-1 text-[10px] hover:bg-accent transition-colors border-b last:border-0",
                Number(val) === num && "bg-primary/20 text-primary font-bold"
              )}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
