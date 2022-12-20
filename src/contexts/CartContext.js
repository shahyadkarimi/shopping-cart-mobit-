import React, { useReducer, createContext } from "react";

const initialState = {
  selectedItems: [],
  itemsCounter: 0,
  total: 0,
  checkout: false
};

const CartCalculater = (products) => {
    const itemsCounter = products.reduce((total, product) => total + product.quantity, 0)
    const total = products.reduce((total, product) => total + product.offPrice * product.quantity, 0)

    return { itemsCounter, total }
}

const cartReducer = (state, action) => {
    switch(action.type) {

        // add items to cart
        case "ADD_ITEM" :
            if(!state.selectedItems.find(item => item.id === action.payload.id)){
                state.selectedItems.push({
                    ...action.payload,
                    quantity: 1,
                })
            }
            return {
                ...state,
                selectedItems: [...state.selectedItems],
                ...CartCalculater(state.selectedItems)
            }

        // remove items from cart
        case "REMOVE_ITEM" :
            const newSelectedItems = state.selectedItems.filter(item => item.id !== action.payload.id)
            
            return {
                ...state,
                selectedItems: [...newSelectedItems],
                ...CartCalculater(state.selectedItems)
            }

        // add items quantity
        case "INCREASE":
            const increaseIndex = state.selectedItems.findIndex(item => item.id === action.payload.id)
            state.selectedItems[increaseIndex].quantity++;

            return {
                ...state,
                ...CartCalculater(state.selectedItems)
            }
        
        // remove items quantity
        case "DECREASE":
            const decreaseIndex = state.selectedItems.findIndex(item => item.id === action.payload.id)
            state.selectedItems[decreaseIndex].quantity--;

            return {
                ...state,
                ...CartCalculater(state.selectedItems)
            }

        case "CHECKOUT": 
            return {
                selectedItems: [],
                itemsCounter: 0,
                total: 0,
                checkout: true
            }

        case "CLEAR": 
            return {
                selectedItems: [],
                itemsCounter: 0,
                total: 0,
                checkout: false
            }

        default:
            return state;
    }
}

// cart context
export const cartContext = createContext()

const CartContext = ({children}) => {

    const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
      <cartContext.Provider value={{state, dispatch}}>
          {children}
      </cartContext.Provider>
  )
};

export default CartContext;
