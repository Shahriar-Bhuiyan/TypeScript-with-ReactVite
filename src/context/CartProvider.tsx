import { useReducer, createContext, useMemo, ReactElement } from "react";

type CartItemType = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type CartStateType = {
  cart: CartItemType[];
};

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT"
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerActions = {
  type: keyof ReducerActionType;
  payload?: CartItemType;
};

const reducer = (
  state: CartStateType,
  action: ReducerActions
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error("action.payload missing in ADD action");
      }
      const { id, title, price } = action.payload;

      const filterItems: CartItemType[] = state.cart.filter(
        (item) => item.id !== id
      );

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.id === id
      );

      const quantity: number = itemExists ? itemExists.quantity + 1 : 1;

      return {
        ...state,
        cart: [...filterItems, { id, title, price, quantity }]
      };
    }

    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload missing in ADD action");
      }

      const { id } = action.payload;

      const filterItem: CartItemType[] = state.cart.filter(
        (item) => item.id !== id
      );

      return { ...state, cart: [...filterItem] };
    }

    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload missing in QUantity action");
      }

      const { id, quantity } = action.payload;

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.id === id
      );
      if (!itemExists) {
        throw new Error("tem must exist in order to update quantity");
      }

      const updatedItem: CartItemType = { ...itemExists, quantity };

      const filterItem = state.cart.filter((item) => item.id !== id);

      return { ...state, cart: [...filterItem, updatedItem] };
    }

    case REDUCER_ACTION_TYPE.SUBMIT: {
      if (!action.payload) {
        throw new Error("action.payload missing in Submit action");
      }

      return { ...state, cart: [] };
    }
    default:
      throw new Error("If The action will undefined this will not work");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  const totalItem = state.cart.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(
    state.cart.reduce((previousValue, cartItem) => {
      return previousValue + cartItem.quantity * cartItem.price;
    }, 0)
  );

  const cart = state.cart.sort((a, b) => {
    const ItemA = Number(a);
    const ItemB = Number(b);
    return ItemA - ItemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItem, totalPrice, cart };
};

export type UseCartContextType = ReturnType<typeof useCartContext>;

const initContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItem: 0,
  totalPrice: "",
  cart: []
};
const CartContext = createContext<UseCartContextType>(initContextState);

type Children = {
  children?: ReactElement | ReactElement[];
};

export const CartProvider = ({ children }: Children): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
