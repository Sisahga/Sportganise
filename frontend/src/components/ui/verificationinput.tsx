import React from "react";

interface VerificationInputProps {
  id: number;
  handleInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    nextInputId: string | undefined,
  ) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevInputId: string | undefined,
  ) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  id,
  handleInput,
  handleKeyDown,
}) => {
  const nextInputId = id < 6 ? `code-${id + 1}` : undefined;
  const prevInputId = id > 1 ? `code-${id - 1}` : undefined;
  return (
    <div>
      <label htmlFor={`code-${id}`} className="sr-only">
        Verification Code
      </label>
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        maxLength={1}
        id={`code-${id}`}
        onChange={(e) => handleInput(e, nextInputId)}
        onKeyDown={(e) => handleKeyDown(e, prevInputId)}
        className="w-full aspect-square text-3xl font-bold text-center text-gray-500 bg-gray-300 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        required
      />
    </div>
  );
};
export { VerificationInput };
