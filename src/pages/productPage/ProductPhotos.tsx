// src/components/ProductPhotos.tsx

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { IProductPhoto } from 'types/products';
import theme from '@styles/theme';
import { DEFAULT_PRODUCT_IMAGE } from '@utils/constans';

interface ProductPhotosProps {
    photos: IProductPhoto[];
}

const ProductPhotos: React.FC<ProductPhotosProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    if (photos.length === 0) {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    component='img'
                    src={DEFAULT_PRODUCT_IMAGE}
                    alt={`Фото товара`}
                    loading='lazy'
                    sx={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        borderRadius: 2,
                    }}
                />

                <Typography variant='body2' color='text.secondary'>
                    Нет доступных фотографий
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden', borderRadius: 2 }}>
            <Carousel
                height={400}
                indicators={false}
                navButtonsAlwaysVisible={true}
                animation='fade'
                duration={500}
                index={currentIndex}
                onChange={(index) => setCurrentIndex(index as number)}
                autoPlay={false}
                navButtonsWrapperProps={{
                    style: {
                        display: photos.length > 1 ? 'block' : 'none',
                    },
                }}
                navButtonsProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: theme.palette.text.primary,
                    },
                }}
            >
                {photos.map((photo, index) => (
                    <Box
                        key={index}
                        component='img'
                        src={photo.photo}
                        alt={`Фото товара ${index + 1}`}
                        loading='lazy'
                        sx={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                            borderRadius: 2,
                        }}
                    />
                ))}
            </Carousel>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2,
                    overflowX: 'auto', // Горизонтальная прокрутка для миниатюр
                }}
            >
                {photos.map((photo, index) => (
                    <Box
                        key={index}
                        component='img'
                        src={photo.photo}
                        alt={`Миниатюра товара ${index + 1}`}
                        onClick={() => handleThumbnailClick(index)}
                        sx={{
                            width: index === currentIndex ? '100px' : '70px',
                            height: '75px',
                            objectFit: 'cover',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: '0.3s',
                            borderBottom: index === currentIndex ? `5px solid ${theme.palette.primary.main}` : `5px solid ${theme.palette.grey[800]}`,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ProductPhotos;
