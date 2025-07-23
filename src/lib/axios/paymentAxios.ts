import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";

interface OrderPayload {
  cartId: number;
  paymentMethod: "stripe" | "cash_on_delivery";
}

export const placeOrder = async (payload: OrderPayload) => {
  try {
    const response = await tokenIpAxios.post(
      "/orders",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع أثناء دفع";
    throw new Error(message);
  }
};
