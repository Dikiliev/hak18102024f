import React from 'react';
import { Avatar, Box, Link, ListItem, Typography } from '@mui/material';
import { IOrderItem } from 'types/order';
import { DEFAULT_PRODUCT_IMAGE } from '@utils/constans';
import theme from '@styles/theme';
import { formatPrice } from '@utils/formatPrice';

interface OrderItemProps {
    item: IOrderItem;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
    return (
        <ListItem sx={{ p: 0, mb: 2 }}>
            <Avatar
                variant='rounded'
                src={(item.product.photos[0] && item.product.photos[0].photo) || DEFAULT_PRODUCT_IMAGE}
                alt={item.product.name}
                sx={{ width: 80, height: 80, mr: 2, borderRadius: 2 }}
            />
            <Box sx={{ width: '100%', minHeight: 80, display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <Box width='70%'>
                    <Link
                        href={`/products/${item.product.id}`}
                        variant='actayWide'
                        sx={{
                            color: theme.palette.text.primary,
                            textDecoration: 'none',

                            '&:hover': {
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                            },
                        }}
                        fontSize={{ xs: 14, md: 18 }}
                    >
                        {item.product.name}
                    </Link>
                    <Typography variant='body2' color='textSecondary' fontSize={{ xs: 12, md: 14 }}>
                        {item.product.short_characteristics}
                    </Typography>
                </Box>

                <Box width='30%'>
                    <Typography variant='body1' color='textSecondary' align={'right'} fontSize={{ xs: 14, md: 18 }}>
                        Цена:{' '}
                        <Typography component={'span'} variant={'actayWide'} color={'text.primary'}>
                            {formatPrice(item.total_price)}
                        </Typography>{' '}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' align={'right'} fontSize={{ xs: 12, md: 16 }}>
                        {item.quantity}шт. x {formatPrice(item.product.price)}
                    </Typography>
                </Box>
            </Box>
        </ListItem>
    );
};

export default OrderItem;
