
import React from "react";
import { Star, StarOff } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  readOnly?: boolean;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            tabIndex={readOnly ? -1 : 0}
            aria-label={`Nível ${i + 1}`}
            className={`cursor-pointer group disabled:cursor-default bg-transparent border-none p-0`}
            onClick={() => !readOnly && onChange(i + 1)}
            onKeyPress={e => {
              if (!readOnly && (e.key === "Enter" || e.key === " ")) onChange(i + 1);
            }}
          >
            {filled ? (
              <Star className="text-yellow-500 fill-yellow-400" size={24} absoluteStrokeWidth={true} />
            ) : (
              <StarOff className="text-gray-300" size={24} absoluteStrokeWidth={true} />
            )}
          </button>
        );
      })}
    </div>
  );
};
