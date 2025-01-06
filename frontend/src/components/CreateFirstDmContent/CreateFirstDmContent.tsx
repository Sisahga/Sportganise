import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ArrowLeft } from "lucide-react";
import { useState } from "react";

//using mock players for now
type Player = {
  id: number;
  name: string;
  username: string;
  avatar: string;
};

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "test case1",
    username: "@tc1",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "test case2",
    username: "@tc2",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "test case3",
    username: "@tc3",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "john doe",
    username: "@johndoe",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "john smith",
    username: "@johnsmith",
    avatar: "/placeholder.svg",
  },
];

export default function CreateFirstDmContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // fetch all users from the backend
  // useEffect(() => {
  //   const fetchPlayers = async () => {
  //     try {
  //       const response = await fetch("/api/..."); // Replace with your API endpoint
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch players");
  //       }
  //       const data: Player[] = await response.json();
  //       setPlayers(data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchPlayers();
  // }, []);
  // will need to replace mock data with real data once API endpoint created.

  //updates user search to be more specific by letter as they type player's name
  const filteredPlayers = mockPlayers.filter((player: Player) =>
    player.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  //user can also select more than one user when creating a msg at first
  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers((prevSelected) => {
      if (prevSelected.some((p) => p.id === player.id)) {
        return prevSelected.filter((p) => p.id !== player.id);
      } else {
        return [...prevSelected, player];
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* header for the messages page, different from main layout */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex-1 flex items-center">
          <Button
            variant="ghost"
            className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="text-gray-800" size={24} />
          </Button>
        </div>
        <div className="flex-1 flex justify-center">
          <h2 className="text-lg font-font font-medium text-textColour">
            Messages
          </h2>
        </div>
        <div className="flex-1" />
      </header>
      {/* user can search for any players to send his first message */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 relative">
        <div className="max-w-md mx-auto space-y-6 sm:space-y-8 mt-[-12rem]">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-font text-center leading-tight px-4 animate-textPulse">
            Chat with other players and coaches!
          </h1>
          <div className="relative w-full px-4 sm:px-0">
            {/* search bar for user's to search for players */}
            <Search className="absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for a player"
              className="font-font pl-10 h-10 sm:h-12 w-full bg-white border border-gray-200 rounded-full text-sm sm:text-base"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearching(event.target.value.length > 0);
              }}
            />
          </div>
          {/* once user searches for a player, results will start to show */}
          {isSearching && (
            <ScrollArea className="flex-1 w-full max-h-[400px] rounded-md border overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Render selected players at the top */}
                {selectedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium font-font text-sm">
                        {player.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePlayerSelection(player)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <Button
                      key={player.id}
                      variant="ghost"
                      className="w-full flex items-center space-x-4 h-auto p-4 justify-start hover:bg-white"
                      onClick={() => togglePlayerSelection(player)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium font-font text-sm">
                          {player.name}
                        </span>
                        <span className="text-sm font-font text-textColour">
                          {player.username}
                        </span>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-center font-light font-font text-textColour">
                    No players found
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
          {selectedPlayers.length > 0 && (
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full font-font text-sm text-light text-textColour bg-secondaryColour rounded-lg"
              >
                New Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
