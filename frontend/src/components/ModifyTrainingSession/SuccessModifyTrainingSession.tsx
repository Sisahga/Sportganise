import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function SuccessModifyTrainingSessionForm() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold">Form edit was successful!</h2>
        <h2>The event was updated and saved.</h2>
      </div>
      <Button
        className="rounded-full"
        variant="outline"
        onClick={() => navigate("/")}
      >
        Return to Home Page
      </Button>
    </div>
  );
}
