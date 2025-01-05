import React from "react";

interface VerificationInputProps {
  id: string;
  nextInputId?: string;
  handleInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    nextInputId: string | undefined,
  ) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  id,
  nextInputId,
  handleInput,
}) => {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Verification Code
      </label>
      <input
        type="text"
        maxLength={1}
        id={id}
        onChange={(e) => handleInput(e, nextInputId)}
        className="block w-10 h-10 text-3xl font-bold text-center text-gray-500 bg-gray-300 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        required
      />
    </div>
  );
};

export { VerificationInput };
