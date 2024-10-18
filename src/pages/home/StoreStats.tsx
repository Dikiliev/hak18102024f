import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import FlexBox from '@components/flexBox/FlexBox';
import BoxWithImage from '@components/boxWithImage/BoxWithImage';

import workImage from '@assets/images/pcs/work.jpg';
import { useNavigate } from 'react-router-dom';

const StoreStats = () => {
    const navigate = useNavigate();
    return (
        <FlexBox flexDirection={'column'} bgColor={'background.paper'} sx={{ p: 4 }}>
            <Typography variant='h4' gutterBottom component='div' sx={{ color: '#fff' }}>
                ИНТЕРНЕТ-МАГАЗИН КОПЬЮТЕРНОЙ ТЕХНИКИ
            </Typography>

            <Grid container spacing={4}>
                <Grid item md={6} container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ bgcolor: 'background.default', p: 4, borderRadius: 1 }}>
                            <Typography variant='h5'>10+</Typography>
                            <Typography>сотрудников</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ bgcolor: 'background.default', p: 4, borderRadius: 1 }}>
                            <Typography variant='h5'>1 000+</Typography>
                            <Typography>довольных клиентов</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ bgcolor: 'background.default', p: 4, borderRadius: 1 }}>
                            <Typography variant='h5'>5 лет</Typography>
                            <Typography>на рынке электроники</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ bgcolor: 'background.default', p: 4, borderRadius: 1 }}>
                            <Typography variant='h5'>2 часа</Typography>
                            <Typography>среднее время доставки</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid item md={6}>
                    <BoxWithImage imageUrl={workImage as string} overlayOpacity={0.75} sx={{ p: 4, height: '100%' }}>
                        <Typography variant='h6'>Работаем круглосуточно</Typography>
                        <Typography>
                            Наш интернет-магазин работает 24/7. Для нас важен каждый клиент, поэтому мы делаем все, чтобы Вы остались довольны.
                        </Typography>
                        <Button variant='contained' color='primary' size='small' onClick={() => navigate('/categories')} sx={{ mt: 2 }}>
                            Посмотреть товары
                        </Button>
                    </BoxWithImage>
                </Grid>
            </Grid>
        </FlexBox>
    );
};

export default StoreStats;
