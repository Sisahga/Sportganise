/**For now, this is the content shown on the Calendar Page. Might be changed later */

//import React from "react";
import { useEffect, useState } from "react";

// Component imports
import TrainingSessionCard from "./TrainingSessionCard";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for now
const mockAttendees: Attendees[] = [
  {
    accountId: 1000,
    participantType: "PLAYER",
    email: "email1@gmail.com",
    address: "8889 Rue Street",
    phone: "514-555-555",
    firstName: "John1",
    lastName: "Doe1",
  },
  {
    accountId: 2000,
    participantType: "COACH",
    email: "email2@gmail.com",
    address: "8889 Rue Street",
    phone: "514-555-555",
    firstName: "John2",
    lastName: "Doe2",
  },
  {
    accountId: 3000,
    participantType: "ADMIN",
    email: "email3@gmail.com",
    address: "8889 Rue Street",
    phone: "514-555-555",
    firstName: "John3",
    lastName: "Doe3",
  },
];

const mockProgramDetails1: ProgramDetails = {
  programId: 1000,
  title: "Training Session Fun Title",
  type: "TRAINING",
  description: "This is the description of a training session event.",
  capacity: 90,
  occurenceDate: new Date(),
  duration: 90,
  recurring: true,
  expiryDate: new Date(2025, 1, 20),
  coach: "Coach Benjamin Luijan",
  location: "Rue Valois, Vaudreuil-Dorion, QC J7V 0H4",
  attachment: null,
};

const mockProgramDetails2: ProgramDetails = {
  programId: 1000,
  title: "2 Training Session Fun Title",
  type: "FUNDRAISOR",
  description: "2 This is the description of a training session event.",
  capacity: 92,
  occurenceDate: new Date(),
  duration: 92,
  recurring: true,
  expiryDate: new Date(2025, 1, 20),
  coach: "2 Coach Benjamin Luijan",
  location: "2 Rue Valois, Vaudreuil-Dorion, QC J7V 0H4",
  attachment: null,
};

// Data structure for data received from API call
interface Attendees {
  accountId: number;
  participantType: "COACH" | "ADMIN" | "PLAYER";
  email: string;
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface ProgramDetails {
  programId: number;
  title: string;
  type: string;
  description: string;
  capacity: number;
  occurenceDate: Date;
  duration: number;
  recurring: boolean;
  expiryDate: Date;
  coach: string;
  location: string;
  attachment: File[] | null;
}

interface Event {
  programId: number;
  programDetails: ProgramDetails;
  attendees: Attendees[];
}

export default function TrainingSessionsList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const accountId = ""; // TODO : FIGURE OUT HOW TO GET ACCOUNTID FOR USER CLICKING ON THE TRAINING SESSION CARD

  // Fetch data on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const mockEvents: Event[] = [
          {
            programId: 1000,
            programDetails: mockProgramDetails1,
            attendees: mockAttendees,
          },
          {
            programId: 2000,
            programDetails: mockProgramDetails2,
            attendees: mockAttendees,
          },
          {
            programId: 3000,
            programDetails: mockProgramDetails2,
            attendees: mockAttendees,
          },
        ];
        setEvents(mockEvents);

        /*
        const response = await fetch(
          `/api/${accountId}/${trainingSessionId}/details`
          //"https://catfact.ninja/facts?limit=4" //a testing api
        );

        if (response.ok) {
          const data = await response.json();
          setAttendees(data.attendees);
        } else {
          console.log(
            "Error fetching registered players content: ",
            response.status
          );
          setError(
            "Error fetching registered players content: " + response.status
          );
          throw new Error(
            `Fetching registered players content: HTTP error! status: ${response.status}`
          ); // re-throw for the catch block below
        }
        */
      } catch (error) {
        console.error(
          "Error fetching registered players content HTTP error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="mb-32">
      {/**Title */}
      <h2 className="font-semibold text-2xl text-center">Schedule</h2>

      {/**Tabs content */}
      <div className="my-5">
        <Tabs defaultValue="month" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day">Day view here...</TabsContent>
          <TabsContent value="week">Week view here...</TabsContent>
          <TabsContent value="month">
            <div>
              <Calendar />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      {/**List of events */}
      {events.map((event) => (
        <div key={event.programId} className="my-5">
          <TrainingSessionCard
            programId={event.programId}
            programDetails={event.programDetails}
            attendees={event.attendees}
          />
        </div>
      ))}
    </div>
  );
}
