import { Country } from "@/models/forntEndCountry";
import axios, { AxiosError } from "axios";

export const getCountries = async (): Promise<Country[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<Country[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipping-zones/countries-with-cities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

