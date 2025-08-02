export interface Snack {
  imageUrl: string;
  price: number;
  snackName: string;
  snackId?: string;
  snackTypeName: string;
  snackTypeId: number;
    id?: number;
    name?: string;
}

export interface SelectedSnackItem {
  snack: Snack;
  quantity: number;
}
export interface SnacksResponse {
  data: Snack[];
  total: number;
  page: number;
  pageSize: number;
}
