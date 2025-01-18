import { Button } from "@/components/ui/Button";
import logo from "../../assets/Logo.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SecondaryHeader() {
  const navigate = useNavigate();

  // Function to handle navigation to previous page using the history
  const handleGoBack = () => {
    navigate(-1); //Brings you to previous page
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-white md:p-6">
        <Button
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black border-black hover:bg-secondaryColour"
          onClick={handleGoBack}
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <img
            src={logo}
            alt="Logo"
            className="h-12 md:h-16 lg:h-20 rounded-lg object contain"
          />
        </div>
      </header>
    </div>
  );
}
