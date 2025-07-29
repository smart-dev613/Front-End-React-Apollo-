export interface Props {
  eventId: string;
  data: any[];
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  deleteCartItem: (id: string) => Promise<void>;
}
