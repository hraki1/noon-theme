import axios, { AxiosError } from "axios";

export interface ShippingMethod {
  methodId: number;
  name: string;
  carrier: string;
  cost: number;
  created_at: string;
}

export const getShippingMethod = async (
  cartId: number,
  addressId: number
): Promise<ShippingMethod[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<ShippingMethod[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cartId}/shipping-methods/${addressId}`,
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
