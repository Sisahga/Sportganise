import { Button } from "@/components/ui/Button";
import logo from "../../assets/Logo.png";
import { ArrowLeft } from "lucide-react";

export default function SecondaryHeader() {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-white">
        <Button className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black border-black hover:bg-secondaryColour">
          <ArrowLeft className="w-8 h-8" />
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <img src={logo} alt="Logo" className="h-20 rounded-lg" />
        </div>
      </header>
    </div>
  );
}
