import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface CustomRatingProps {
    averageRating: number | null;
    countOfReviews: number | null;
}

const CustomRating: React.FC<CustomRatingProps> = ({ averageRating, countOfReviews }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
                value={averageRating}
                precision={0.1}
                readOnly
                size='small'
                icon={<StarIcon fontSize='inherit' sx={{ color: 'primary.main' }} />}
                emptyIcon={<StarIcon fontSize='inherit' sx={{ color: 'text.primary', opacity: 0.5 }} />}
            />
            <Typography variant='body2' sx={{ ml: 1, color: 'text.secondary' }}>
                {averageRating ? averageRating.toFixed(1) : '0.0'} ({countOfReviews ? countOfReviews : 0} отзывов)
            </Typography>
        </Box>
    );
};

interface RatingLiteProps {
    rating: number | null;
}

export const RatingLite: React.FC<RatingLiteProps> = ({ rating }) => {
    return (
        <Rating
            value={rating}
            precision={0.1}
            readOnly
            size='small'
            icon={<StarIcon fontSize='inherit' sx={{ color: 'primary.main' }} />}
            emptyIcon={<StarIcon fontSize='inherit' sx={{ color: 'text.primary', opacity: 0.5 }} />}
        />
    );
};

export default CustomRating;
