// src/components/ProductTabs.tsx

import React from 'react';
import { Tabs, Tab, Box, Typography, Paper, List, ListItem } from '@mui/material';
import { IProductDetail } from 'types/products';
import theme from '@styles/theme';
import ProductReviews from '@pages/productPage/ProductReviews';

const ProductTabs: React.FC<{ product: IProductDetail }> = ({ product }) => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, value: number) => {
        setTabValue(value);
    };

    return (
        <Box>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label='Характеристики' />
                <Tab label='Описание' />
                <Tab label='Отзывы' />
            </Tabs>
            {tabValue === 0 && <ProductAttributes attributes={product.attributes} />}
            {tabValue === 1 && <ProductDescription description={product.description} />}
            {tabValue === 2 && <ProductReviews />}
        </Box>
    );
};

const ProductAttributes: React.FC<{ attributes: { name: string; value: string }[] }> = ({ attributes }) => (
    <Paper variant='outlined' sx={{ mt: 2, p: 2 }}>
        {attributes.length > 0 ? (
            <List dense>
                {attributes.map((attr, index) => (
                    <ListItem key={index}>
                        <Typography sx={{ width: '100%', display: 'flex', gap: '1rem', my: 0.5 }}>
                            <strong style={{ minWidth: '50%', borderBottom: `1px dashed ${theme.palette.grey[700]}` }}>{attr.name}:</strong>{' '}
                            {attr.value}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        ) : (
            <>
                <Typography variant='body2'>Не указаны</Typography>
            </>
        )}
    </Paper>
);

const ProductDescription: React.FC<{ description: string }> = ({ description }) => (
    <Paper variant='outlined' sx={{ mt: 2, p: 2 }}>
        {description ? (
            <>
                <Typography variant='h5' sx={{ mt: 2 }}>
                    Описание
                </Typography>
                <Typography variant='body1' sx={{ mt: 1 }}>
                    {description}
                </Typography>
            </>
        ) : (
            <>
                <Typography variant='body2'>Не указано</Typography>
            </>
        )}
    </Paper>
);

export default ProductTabs;
