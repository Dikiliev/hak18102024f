import React from 'react';
import {Container, Typography} from '@mui/material';

import './Home.module.css';
import HomeCarousel from '@pages/home/HomeCarousel';
import HitCatalog from '@pages/home/HitCatalog';

const Home = () => {
    return (
        <Container maxWidth={'xl'} sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Home</Typography>
        </Container>
    );
};

export default Home;
