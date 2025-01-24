/**TODO: Connect and fetch from real API endpoint. Navigate to PostDetail with correct sessionID**/

import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  MoveLeft,
  ThumbsUp,
  MessageSquare,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import "react-day-picker/dist/style.css";

interface TrainingSession {
  id: number;
  title: string;
  description: string;
  date: string;
  likes: number;
  comments: number;
}

const ForumContent: React.FC = () => {
  const [likedSessions, setLikedSessions] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 3;
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  //MOCK DATA
  const sessions: TrainingSession[] = [
    {
      id: 1,
      title: "Badminton Basics",
      description:
        "Badminton basics include learning the fundamental skills and techniques required to play the game.",
      date: "2024-12-29",
      likes: 25,
      comments: 5,
    },
    {
      id: 2,
      title: "Advanced Badminton Strategies",
      description: "Master advanced strategies for badminton matches.",
      date: "2024-12-05",
      likes: 100,
      comments: 20,
    },
    {
      id: 3,
      title: "Badminton Footwork",
      description: "Improve your footwork and agility on the court.",
      date: "2024-12-10",
      likes: 50,
      comments: 15,
    },
    {
      id: 4,
      title: "Badminton for Beginners",
      description: "A beginner-friendly session focusing on basic skills.",
      date: "2024-10-30",
      likes: 30,
      comments: 10,
    },
    {
      id: 5,
      title: "Badminton Smash Techniques",
      description: "Learn powerful smash techniques for aggressive play.",
      date: "2024-12-20",
      likes: 70,
      comments: 25,
    },
    {
      id: 6,
      title: "Badminton Fitness Training",
      description: "Focus on fitness training for badminton players.",
      date: "2024-09-15",
      likes: 10,
      comments: 3,
    },
  ];

  const handleLike = (sessionId: number) => {
    setLikedSessions((prev) => {
      const newLikedSessions = new Set(prev);
      if (newLikedSessions.has(sessionId)) {
        newLikedSessions.delete(sessionId);
      } else {
        newLikedSessions.add(sessionId);
      }
      return newLikedSessions;
    });
  };

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(
    indexOfFirstSession,
    indexOfLastSession,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const navigatePostDetail = () => {
    navigate(`/pages/PostDetailPage`);
  };

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <Button
        className="rounded-full w-2"
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </Button>

      <h2 className="font-semibold text-3xl text-secondaryColour text-center mb-8">
        Forum
      </h2>

      <div className="mt-4 mb-2 flex items-center lg:mx-24">
        {/* Menu Bar with Filters */}
        <div className="mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-start text-left font-normal flex items-center"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="space-y-2 p-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4" />
                      Select Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={1}
                      className="border rounded-sm"
                    />
                    <Button variant="outline" className="w-full">
                      Clear
                    </Button>
                  </PopoverContent>
                </Popover>

                {/* Sort Options */}
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Sort by Latest</SelectItem>
                    <SelectItem value="oldest">Sort by Oldest</SelectItem>
                    <SelectItem value="most-likes">
                      Sort by Most Likes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search bar */}
        <Input placeholder="Search..." className="w-full flex-grow" />
      </div>

      {/* Sessions Cards */}
      <div className="flex flex-col space-y-4 lg:mx-24">
        {currentSessions.map((session) => (
          <Card
            key={session.id}
            onClick={() => navigatePostDetail()}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <div className="mt-4 text-xs">{session.date}</div>
            </CardHeader>
            <CardContent>
              <CardDescription>{session.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                variant="outline"
                className={`flex items-center space-x-1 ${likedSessions.has(session.id) ? "text-secondaryColour" : "text-primaryColour"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(session.id);
                }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>
                  {session.likes + (likedSessions.has(session.id) ? 1 : 0)}
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center space-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePostDetail();
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{session.comments}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination UI */}
      <Pagination className="mt-6 flex justify-center space-x-2">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className="text-black"
        >
          Previous
        </PaginationPrevious>

        <PaginationContent className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(sessions.length / sessionsPerPage) },
            (_, index) => (
              <PaginationItem
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                <PaginationLink className="text-black">
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
        </PaginationContent>

        <PaginationNext
          onClick={() =>
            currentPage < Math.ceil(sessions.length / sessionsPerPage) &&
            handlePageChange(currentPage + 1)
          }
          className="text-black"
        >
          Next
        </PaginationNext>
      </Pagination>
    </div>
  );
};

export default ForumContent;
