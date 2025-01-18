import { useReactTable } from "@tanstack/react-table";
import { useState } from "react";

const MockData = [
  { trainingPlan: "Document1.doc", author: "Coach Steven", date: new Date() },
  {
    trainingPlan: "ShuttleCock_techniques.doc",
    author: "Coach Micheal",
    date: new Date(),
  },
  {
    trainingPlan: "TrainingSessionNotes.dox",
    author: "Benjamin",
    date: new Date(),
  },
];

interface Columns {
  trainingPlan: string; //change to File
  author: string;
  date: Date;
}

export default function FileTable() {
  const [data, setData] = useState<Columns[]>(MockData);

  //const table = useReactTable();
}
