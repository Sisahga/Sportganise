export interface FormValues {
  title: string;
  type: string;
  coaches?: number[];
  startDate: Date;
  endDate?: Date;
  frequency: string;
  visibility: string;
  description: string;
  attachment?: File[];
  capacity: number;
  startTime: string;
  endTime: string;
  location: string;
}

export interface ResponseFormValues {
  title: string;
  type: string;
  coaches: number[];
  startDate: Date;
  endDate: Date;
  recurring: boolean;
  visibility: string;
  description: string;
  attachment: string[];
  capacity: number;
  startTime: string;
  endTime: string;
  location: string;
}
