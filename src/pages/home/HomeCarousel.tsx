import React, { CSSProperties } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Импортируйте useNavigate
import { styled } from '@mui/material/styles';

// Импортируем изображения
import info_1_desktop from '@assets/images/banners/desktop/info-1.png';
import info_1_mobile from '@assets/images/banners/mobile/info-1.png';

import banner_1_desktop from '@assets/images/banners/desktop/pubg-1.png';
import banner_1_mobile from '@assets/images/banners/mobile/pubg-1.png';

import banner_2_desktop from '@assets/images/banners/desktop/banner-1.png';
import banner_2_mobile from '@assets/images/banners/mobile/banner-1.png';

const carouselItems = [
    {
        imageUrlDesktop: info_1_desktop,
        imageUrlMobile: info_1_mobile,
        overlayOpacity: 0,
        title: (
            <Typography
                variant='h3'
                gutterBottom
                sx={{
                    fontSize: {
                        lg: '3rem',
                        md: '2.5rem',
                        sm: '1.5rem',
                    },
                }}
            >
                <Typography>EstechPC</Typography>
                Наш интернет-магазин теперь открыт в Beta-версии!
            </Typography>
        ),
        description: (
            <Typography
                variant='body1'
                sx={{
                    mb: 2,
                    fontSize: {
                        lg: '1.25rem',
                        sm: '1rem',
                    },
                }}
            >
                Будем рады вашей обратной связи и предложениям.
            </Typography>
        ),
        button: (
            <Button variant='contained' size='large' color='primary'>
                Узнать больше
            </Button>
        ),
        align: 'center',
        width: '80%',
        buttonLink: '/catalog',
    },
    {
        imageUrlDesktop: banner_1_desktop,
        imageUrlMobile: banner_1_mobile,
        overlayOpacity: 0,
        title: (
            <Typography
                variant='h3'
                gutterBottom
                sx={{
                    fontSize: {
                        lg: '3rem',
                        md: '2.5rem',
                        sm: '1.5rem',
                    },
                }}
            >
                Готовые игровые ПК
            </Typography>
        ),
        description: (
            <Typography
                variant='body1'
                sx={{
                    mb: 2,
                    fontSize: {
                        lg: '1.25rem',
                        sm: '1rem',
                    },
                }}
            >
                Заряжены и настроены на победу. Обеспечьте себе лучшее игровое впечатление.
            </Typography>
        ),
        button: (
            <Button variant='contained' size='large' color='primary'>
                Узнать больше
            </Button>
        ),
        align: 'right',
        width: '50%',
        buttonLink: '/catalog',
    },
    {
        imageUrlDesktop: banner_2_desktop,
        imageUrlMobile: banner_2_mobile,
        overlayOpacity: 0,
        title: (
            <Typography
                variant='h3'
                gutterBottom
                sx={{
                    fontSize: {
                        lg: '3rem',
                        md: '2.5rem',
                        sm: '1.5rem',
                    },
                }}
            >
                Новые поступления
            </Typography>
        ),
        description: (
            <Typography
                variant='body1'
                sx={{
                    mb: 2,
                    fontSize: {
                        lg: '1.25rem',
                        sm: '1rem',
                    },
                }}
            >
                Последние новинки в мире компьютерной техники уже в нашем каталоге.
            </Typography>
        ),
        button: (
            <Button variant='contained' size='large' color='primary'>
                Узнать больше
            </Button>
        ),
        align: 'left',
        width: '50%',
        buttonLink: '/new-arrivals',
    },
];

const CarouselItemBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '500px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
        height: '400px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '300px',
    },
}));

const ContentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(4),
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
        maxWidth: '70%',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        padding: theme.spacing(2),
    },
}));

const HomeCarousel: React.FC = () => {
    const navigate = useNavigate(); // Используйте useNavigate для получения функции navigate
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Стили для индикаторов в зависимости от размера экрана
    const indicatorStyles: CSSProperties = isSmallScreen
        ? {
              position: 'absolute',
              top: '10px',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
          }
        : {
              position: 'absolute',
              bottom: '20px',
              zIndex: 3,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
          };

    return (
        <Container maxWidth='xl' disableGutters sx={{ mb: 5 }}>
            <Carousel
                autoPlay={false}
                interval={6000}
                animation='fade'
                indicators={true}
                navButtonsAlwaysInvisible={true}
                indicatorContainerProps={{
                    style: indicatorStyles,
                }}
                indicatorIconButtonProps={{
                    style: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        ...(isSmallScreen && { transform: 'scale(0.8)' }), // Уменьшаем размер на мобильных
                    },
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: '#C4F230',
                        ...(isSmallScreen && { transform: 'scale(0.8)' }), // Уменьшаем размер на мобильных
                    },
                }}
            >
                {carouselItems.map((item, index) => {
                    const imageUrl = isSmallScreen ? item.imageUrlMobile : item.imageUrlDesktop;
                    return (
                        <Box key={index} sx={{ borderRadius: 1, overflow: 'hidden' }}>
                            <CarouselItemBox
                                sx={{
                                    backgroundImage: `url(${imageUrl})`,
                                    '&::before': !isSmallScreen
                                        ? {
                                              content: '""',
                                              position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              width: '100%',
                                              height: '100%',
                                              bgcolor: `rgba(0, 0, 0, ${item.overlayOpacity})`,
                                              zIndex: 0,
                                          }
                                        : undefined,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent:
                                        !isSmallScreen && item.align === 'left'
                                            ? 'flex-start'
                                            : !isSmallScreen && item.align === 'right'
                                              ? 'flex-end'
                                              : 'center',
                                }}
                            >
                                {!isSmallScreen && (
                                    <ContentBox
                                        sx={{
                                            textAlign: item.align,
                                            height: '50%',
                                            maxWidth: item.width,
                                        }}
                                    >
                                        {item.title}
                                        {item.description}
                                        <Button variant='contained' size='large' color='primary' onClick={() => navigate(item.buttonLink)}>
                                            Узнать больше
                                        </Button>
                                    </ContentBox>
                                )}
                            </CarouselItemBox>

                            {isSmallScreen && (
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        padding: theme.spacing(2),
                                        textAlign: 'center',
                                    }}
                                >
                                    {item.title}
                                    {item.description}
                                    <Button variant='contained' size='large' color='primary' onClick={() => navigate(item.buttonLink)}>
                                        Узнать больше
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Carousel>
        </Container>
    );
};

export default HomeCarousel;
