import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, CircularProgress, Paper } from '@mui/material';
import { useCart } from '@hooks/useCart';
import ErrorText from '@components/errorText/ErrorText';
import CartItemComponent from './CartItemComponent';
import CartSummaryComponent from './CartSummaryComponent';
import CartActionsComponent from './CartActionsComponent';
import FixedBottomBar from './FixedBottomBar';
import theme from '@styles/theme';
import { useNavigate } from 'react-router-dom';
import CartEmptyStateComponent from '@pages/cartPage/CartEmptyStateComponent';
import { useStore } from '@stores/StoreContext';

const CartPage: React.FC = () => {
    const { authStore } = useStore();

    const {
        cart,
        isLoadingCart,
        isErrorCart,
        error,
        updateCartItem,
        removeProductFromCart,
        bulkUpdateCartItems,
        removeSelectedItems,
        isRemovingSelected,
    } = useCart();

    const [allSelected, setAllSelected] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (cart) {
            const allItemsSelected = cart.items.every((item) => item.is_selected);
            setAllSelected(allItemsSelected);
        }

        const handleScroll = () => {
            if (summaryRef.current) {
                const summaryTop = summaryRef.current.getBoundingClientRect().top;
                setIsSummaryVisible(summaryTop <= window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [cart]);

    const handleIncrease = (itemId: number, currentQuantity: number) => {
        updateCartItem({ itemId, quantity: currentQuantity + 1 });
    };

    const handleDecrease = (itemId: number, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateCartItem({ itemId, quantity: currentQuantity - 1 });
        }
    };

    const handleRemove = (itemId: number) => {
        removeProductFromCart(itemId);
    };

    const handleSelectItem = (itemId: number, isSelected: boolean) => {
        bulkUpdateCartItems({ items: [{ item_id: itemId, is_selected: !isSelected }] });
    };

    const handleRemoveSelectedItems = () => {
        removeSelectedItems();
    };

    const handleToggleSelectAll = () => {
        if (!cart) return;

        const itemsToUpdate = cart.items.map((item) => ({
            item_id: item.id,
            is_selected: !allSelected,
        }));

        bulkUpdateCartItems({ items: itemsToUpdate });
        setAllSelected(!allSelected);
    };

    const getTotalAmount = () => {
        if (!cart) return 0;
        return cart.items.filter((item) => item.is_selected).reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const getSelectedItems = () => {
        if (!cart) return [];
        return cart.items.filter((item) => item.is_selected);
    };

    const handleCheckout = () => {
        if (authStore.isAuthenticated) {
            navigate('/checkout');
            return;
        }

        navigate('/login');
    };

    if (isLoadingCart) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
            </Box>
        );
    }

    if (isErrorCart || !cart) {
        console.log(error);
        return <ErrorText>Ошибка загрузки корзины.</ErrorText>;
    }

    if (cart.items.length === 0) {
        return <CartEmptyStateComponent />;
    }

    return (
        <Container maxWidth='lg' sx={{ py: 4 }}>
            <Box display='flex' justifyContent='space-between' flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                <Box width={{ xs: '100%', sm: '70%' }} mb={{ xs: 2, sm: 0 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            padding: theme.spacing(3),
                            borderRadius: 2,
                            boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
                        }}
                    >
                        <CartActionsComponent
                            onRemoveSelectedItems={handleRemoveSelectedItems}
                            isRemovingSelected={isRemovingSelected}
                            onToggleSelectAll={handleToggleSelectAll}
                            areAllItemsSelected={allSelected}
                        />
                        {cart.items.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                selected={item.is_selected}
                                onSelect={() => handleSelectItem(item.id, item.is_selected)}
                                onIncrease={() => handleIncrease(item.id, item.quantity)}
                                onDecrease={() => handleDecrease(item.id, item.quantity)}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))}
                    </Paper>
                </Box>
                <Box width={{ xs: '100%', sm: '30%' }} ref={summaryRef}>
                    <CartSummaryComponent
                        selectedItems={getSelectedItems()}
                        totalAmount={getTotalAmount()}
                        isCheckoutDisabled={getSelectedItems().length === 0}
                        onCheckout={handleCheckout}
                    />
                </Box>
            </Box>
            {!isSummaryVisible && (
                <FixedBottomBar totalAmount={getTotalAmount()} isCheckoutDisabled={getSelectedItems().length === 0} onCheckout={handleCheckout} />
            )}
        </Container>
    );
};

export default CartPage;
