import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Paper, List, ListItem, Divider, Avatar } from '@mui/material';
import { fetchProductReviews } from '@api/products';
import { RatingLite } from '@components/rating/CustomRating';
import theme from '@styles/theme';
import ErrorText from '@components/errorText/ErrorText';
import LoadingBox from '@components/loadingBox/LoadingBox';
import FlexBox from '@components/flexBox/FlexBox';
import { toDatetime } from '@utils/datetime';

const ProductReviews: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    const {
        data: reviews,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['productReviews', productId],
        queryFn: () => fetchProductReviews(productId!),
        staleTime: 5 * 60 * 1000,
        enabled: !!productId,
    });

    if (isLoading) {
        return <LoadingBox minHeight={'200px'} />;
    }

    if (isError || !reviews) {
        return <ErrorText>Ошибка загрузки отзывов.</ErrorText>;
    }

    return (
        <Paper variant='outlined' sx={{ mt: 2, p: 2 }}>
            {reviews.length > 0 ? (
                <List>
                    {reviews.map((review, index) => (
                        <>
                            <ListItem key={index}>
                                <Box sx={{ width: '100%' }}>
                                    <FlexBox sx={{ mb: 1 }}>
                                        <Avatar src={review.avatar} alt={review.username} />
                                        <Typography variant='h6' sx={{ mt: 2 }}>
                                            {review.username}
                                        </Typography>
                                    </FlexBox>
                                    <RatingLite rating={review.rating} />
                                    <Typography variant='body2'>{review.text}</Typography>
                                    <Typography variant='caption' color='textSecondary' sx={{ width: '100%', display: 'block', textAlign: 'end' }}>
                                        {toDatetime(review.created_at)}
                                    </Typography>
                                </Box>
                            </ListItem>

                            <Divider component='li' sx={{ borderColor: theme.palette.grey[800] }} />
                        </>
                    ))}
                </List>
            ) : (
                <Typography variant='body2'>Нет отзывов</Typography>
            )}
        </Paper>
    );
};

export default ProductReviews;
