export interface FormValues {
  title: string;
  type: string;
  start_date: Date;
  end_date: Date;
  recurring: boolean;
  visibility: string;
  description: string;
  attachment?: File[];
  capacity: number;
  start_time: string;
  end_time: string;
  location: string;
}

export interface ResponseFormValues {
  title: string;
  type: string;
  start_date: Date;
  end_date: Date;
  recurring: boolean;
  visibility: string;
  description: string;
  attachment: string[];
  capacity: number;
  start_time: string;
  end_time: string;
  location: string;
}
