// src/components/header/ProfileMenu.tsx
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

interface ProfileMenuProps {
    anchorEl: null | HTMLElement;
    mobileMoreAnchorEl: null | HTMLElement;
    isMenuOpen: boolean;
    isMobileMenuOpen: boolean;
    handleMenuClose: () => void;
    handleMobileMenuClose: () => void;
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    anchorEl,
    mobileMoreAnchorEl,
    isMenuOpen,
    isMobileMenuOpen,
    handleMenuClose,
    handleMobileMenuClose,
    handleProfileMenuOpen,
}) => {
    const navigate = useNavigate();
    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const handleNavigate = (to: string) => {
        handleMenuClose();
        handleMobileMenuClose();
        navigate(to);
    };

    return (
        <>
            <Menu
                elevation={1}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={menuId}
                keepMounted
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleNavigate('/profile')}>Профиль</MenuItem>
                <MenuItem onClick={() => handleNavigate('/logout')}>Выйти с аккаунта</MenuItem>
            </Menu>
            <Menu
                elevation={1}
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={mobileMenuId}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem onClick={() => handleNavigate('/favorites')}>
                    <IconButton size='large' aria-label='show favorites' color='inherit'>
                        <Badge badgeContent={2} color='primary'>
                            <FavoriteIcon />
                        </Badge>
                    </IconButton>
                    <p>Избранное</p>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/cart')}>
                    <IconButton size='large' aria-label='show shopping cart' color='inherit'>
                        <Badge badgeContent={3} color='primary'>
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                    <p>Заказы</p>
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/profile')}>
                    <IconButton size='large' aria-label='account of current user' aria-controls={menuId} aria-haspopup='true' color='inherit'>
                        <AccountCircle />
                    </IconButton>
                    <p>Профиль</p>
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('/logout')}>
                    <IconButton size='large' aria-label='account of current user' aria-controls={menuId} aria-haspopup='true' color='inherit'>
                        <Logout />
                    </IconButton>
                    <p>Выйти</p>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ProfileMenu;
