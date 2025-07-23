import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { Order } from "../models/orderModal";

interface OrderPayload {
  cartId: number;
  paymentMethod: "stripe" | "cash_on_delivery";
}

interface SaveOrderPayload {
  cartId: number;
  addressId: number;
  DelevaryMethodId: number;
}

export const saveOrderData = async ({
  cartId,
  addressId,
  DelevaryMethodId,
}: SaveOrderPayload): Promise<void> => {
  try {
    await tokenIpAxios.put(
      `/carts/${cartId}/shipping-address/${addressId}`,
      {}
    );
    await tokenIpAxios.put(
      `/carts/${cartId}/shipping-method/${DelevaryMethodId}`,
      {}
    );
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع أثناء حفظ الطلب";
    throw new Error(message);
  }
};

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
    const error = err as AxiosError<{ message?: string }>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "حدث خطأ أثناء تنفيذ الطلب.";
    throw new Error(message);
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await tokenIpAxios.get<Order[]>(
      "/orders/user"
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
