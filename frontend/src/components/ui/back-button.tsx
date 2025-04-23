/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- TODO: fix a11y issues*/
import React from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      className="rounded-xl font-semibold relative -top-6 sm:mt-0"
      variant="outline"
      onClick={() => {
        navigate(-1);
      }}
      aria-label="back"
    >
      <ChevronLeft />
      <p className="sm:block hidden">Back</p>
    </Button>
  );
};

export default BackButton;
