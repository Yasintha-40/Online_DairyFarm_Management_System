import { createContext, useEffect, useState } from "react";
import api from "../utils/axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const baseUrl = "http://localhost:4000";

    const addToCart = async (itemId) => {
        try {
            console.log('Attempting to add item to cart:', itemId);
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                console.log('No token found in localStorage');
                setError("Please login to add items to cart");
                return;
            }
            console.log('Token found, proceeding with add to cart');

            // Update local state first for immediate feedback
            setCartItems(prev => ({
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1
            }));

            // Then update the server
            console.log('Making API call to add item to cart');
            const response = await api.post("/api/cart/add", { itemId });
            console.log('API response:', response.data);
            
            if (response.data.success) {
                setCartItems(response.data.cartData);
                console.log('Cart updated successfully');
            } else {
                console.log('Server update failed:', response.data.message);
                // Revert local state if server update fails
                setCartItems(prev => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 1) - 1
                }));
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            console.log('Error details:', {
                status: error.response?.status,
                message: error.response?.data?.message,
                config: error.config
            });
            // Revert local state on error
            setCartItems(prev => ({
                ...prev,
                [itemId]: (prev[itemId] || 1) - 1
            }));
            setError(error.response?.data?.message || "Failed to add item to cart");
        }
    }

    const removeFromCart = async (itemId) => {
        try {
            console.log('Attempting to remove item from cart:', itemId);
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                console.log('No token found in localStorage');
                setError("Please login to remove items from cart");
                return;
            }
            console.log('Token found, proceeding with remove from cart');

            // Update local state first
            setCartItems(prev => {
                const newCount = (prev[itemId] || 0) - 1;
                if (newCount <= 0) {
                    const newCart = { ...prev };
                    delete newCart[itemId];
                    return newCart;
                }
                return {
                    ...prev,
                    [itemId]: newCount
                };
            });

            // Then update the server
            console.log('Making API call to remove item from cart');
            const response = await api.post("/api/cart/remove", { itemId });
            console.log('API response:', response.data);
            
            if (response.data.success) {
                setCartItems(response.data.cartData);
                console.log('Cart updated successfully');
            } else {
                console.log('Server update failed:', response.data.message);
                // Revert local state if server update fails
                setCartItems(prev => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1
                }));
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            console.log('Error details:', {
                status: error.response?.status,
                message: error.response?.data?.message,
                config: error.config
            });
            // Revert local state on error
            setCartItems(prev => ({
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1
            }));
            setError(error.response?.data?.message || "Failed to remove item from cart");
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await api.get("/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
            setError("Failed to load food items");
        }
    }
    
    const loadCartData = async () => {
        try {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) return;
            
            const response = await api.post("/api/cart/get");
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Failed to load cart data:", error);
            if (error.response?.status === 401) {
                setCartItems({});
                setToken("");
            } else {
                setError("Failed to load cart data");
            }
        }
    }
    
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData();
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        url: baseUrl,
        error,
        setError,
        searchTerm,
        setSearchTerm
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;
