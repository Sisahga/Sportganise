import logo from "../../assets/Logo.png";
import BackButton from "../ui/back-button";

export default function SecondaryHeader() {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-transparent">
        <BackButton />
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
