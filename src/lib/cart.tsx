"use client";

// ──────────────────────────────────────────────────────────────
// Giỏ hàng — quản lý state bằng React Context + lưu vào localStorage
// để giữ giỏ khi tải lại trang. Dùng toàn client-side (Sprint 2).
// ──────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

// Mỗi cây là độc bản → luôn mua số lượng 1, không có tồn kho.
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  toneLabel: string;
  typeLabel: string;
}

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const STORAGE_KEY = "trucam_cart_v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      // Đã có trong giỏ thì giữ nguyên (mỗi cây chỉ mua 1)
      if (state.items.some((i) => i.productId === action.item.productId)) {
        return state;
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return {
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number; // số cây trong giỏ
  total: number; // tổng tiền
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Đọc giỏ từ localStorage khi mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      // bỏ qua dữ liệu hỏng
    }
  }, []);

  // Ghi lại localStorage mỗi khi giỏ đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // bỏ qua nếu localStorage không khả dụng
    }
  }, [state]);

  const count = state.items.length;
  const total = state.items.reduce((s, i) => s + i.price, 0);

  const value: CartContextValue = {
    items: state.items,
    count,
    total,
    add: (item) => dispatch({ type: "ADD", item }),
    remove: (productId) => dispatch({ type: "REMOVE", productId }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong <CartProvider>");
  return ctx;
}
