import { EllipsisVertical } from "lucide-react";
import UploadTrainingPlanFiles from "./UploadTrainingPlanFiles";

export default function AddTrainingPlanButton() {
  const handleClick = () => {
    return <div></div>;
  };

  return (
    <button
      aria-label="Add new item"
      className="fixed bottom-20 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
      onClick={handleClick}
    >
      <EllipsisVertical />
    </button>
  );
}
