export type ValidationDetail = {
  field: string;
  message: string;
};

export type Vehicle = {
  id?: number;
  submitted_by: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  asking_price: number;
  location: {
    zip: string;
    lat: number;
    lng: number;
  };
  timestamp: string;
  trim?: string | null | undefined;
  notes?: string | null | undefined;
};