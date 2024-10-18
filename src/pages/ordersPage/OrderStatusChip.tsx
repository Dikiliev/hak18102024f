import React from 'react';
import { Chip } from '@mui/material';

interface OrderStatusProps {
    status: string;
    statusDisplay: string;
}

const statusColorMapping: { [key: string]: 'default' | 'primary' | 'error' } = {
    completed: 'primary',
    canceled: 'error',
};

const OrderStatusChip: React.FC<OrderStatusProps> = ({ status, statusDisplay }) => {
    return <Chip label={statusDisplay} sx={{ fontWeight: 'bold' }} color={statusColorMapping[status] || 'default'} />;
};

export default OrderStatusChip;
