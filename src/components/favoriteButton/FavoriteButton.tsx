// src/components/FavoriteButton.tsx
import React from 'react';
import { IconButton, CircularProgress, Theme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SxProps } from '@mui/system';

interface FavoriteButtonProps {
    productId: number;
    isFavorite: boolean;
    toggleFavorite: (productId: number, isFavorite: boolean) => void;
    isLoading: boolean;
    sx?: SxProps<Theme>;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId, isFavorite, toggleFavorite, isLoading, sx }) => {
    return (
        <IconButton
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(productId, isFavorite);
            }}
            disabled={isLoading}
            sx={{ color: isFavorite ? 'primary.main' : 'text.secondary', ...sx }}
        >
            {isLoading ? <CircularProgress size={24} /> : isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
};

export default FavoriteButton;
