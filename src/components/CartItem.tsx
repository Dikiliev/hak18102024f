// src/components/CartItem/CartItem.tsx

import React from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICartItem } from 'types/cart';
import { useCart } from '@hooks/useCart';
import QuantitySelector from '@components/quantitySelector/QuantitySelector';

export interface CartItemProps {
    item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { updateCartItem, removeProductFromCart, isUpdating, isRemoving } = useCart();

    const handleQuantityChange = (quantity: number) => {
        updateCartItem({ itemId: item.id, quantity });
    };

    const handleRemoveItem = () => {
        removeProductFromCart(item.id);
    };

    return (
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
            <Typography variant='body1'>{item.product.name}</Typography>
            <Box display='flex' alignItems='center'>
                <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => handleQuantityChange(item.quantity + 1)}
                    onDecrease={() => handleQuantityChange(item.quantity - 1)}
                    isLoading={isUpdating || isRemoving}
                />
                <Typography variant='body1' sx={{ ml: 2 }}>
                    {item.product.price * item.quantity} ₽
                </Typography>
                <IconButton onClick={handleRemoveItem} disabled={isRemoving}>
                    {isRemoving ? <CircularProgress size={24} /> : <DeleteIcon />}
                </IconButton>
            </Box>
        </Box>
    );
};

export default CartItem;
