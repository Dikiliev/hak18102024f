import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button, Container, Typography } from '@mui/material';

import ProfileMenu from './ProfileMenu';
import styles from './Header.module.css';
import Logo from '@assets/favicon.svg?react';
import IconWithLabel from './IconWithLabel';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import IconButton from '@mui/material/IconButton';
import theme from '@styles/theme';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';

import { useCart } from '@hooks/useCart';
import { useFavorites } from '@hooks/useFavorites';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = observer(() => {
    const navigate = useNavigate();

    const { authStore, cartStore, favoritesStore } = useStore();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const { cart } = useCart();
    const { favoritesList } = useFavorites();

    useEffect(() => {
        if (cart) {
            const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
            cartStore.setCartItemCount(totalCount);
        }
    }, [cart]);

    useEffect(() => {
        if (favoritesList) {
            const totalCount = favoritesList.items.length;
            favoritesStore.setFavoritesCount(totalCount);
        }
    }, [favoritesList]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Container maxWidth='xl' sx={{ pt: 1 }}>
                    {/*<Toolbar variant={'dense'} disableGutters sx={{ justifyContent: 'center', gap: 5 }}>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        О компании*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        Доставка и оплата*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        Самовывоз*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        Гарантия и возврат*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        FAQ*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant='body2' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>*/}
                    {/*        Контакты*/}
                    {/*    </Typography>*/}
                    {/*</Toolbar>*/}
                </Container>

                <Container maxWidth='xl'>
                    <Toolbar disableGutters sx={{ gap: 3 }}>
                        <Logo className={styles.logo} onClick={() => navigate('/')} />


                        <Box flexGrow={1}></Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex', gap: theme.spacing(5), alignItems: 'center' } }}>

                            <Typography variant='body1' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>
                                Главная
                            </Typography>
                            <Typography variant='body1' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>
                                Справки
                            </Typography>
                            <Typography variant='body1' component='a' href='#' sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}>
                                Мои заявления
                            </Typography>

                            {authStore.isAuthenticated ? (
                                <IconButton sx={{ color: theme.palette.text.primary}} size={'small'} aria-label="profile" onClick={handleProfileMenuOpen}>
                                    <AccountCircle style={{ fontSize: 28 }}/>
                                </IconButton>
                            ) : (
                                <Button variant='contained' onClick={() => navigate('/login')}>
                                    Войти
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size='large' aria-label='show more' aria-haspopup='true' onClick={handleMobileMenuOpen} color='inherit'>
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <ProfileMenu
                anchorEl={anchorEl}
                mobileMoreAnchorEl={mobileMoreAnchorEl}
                isMenuOpen={isMenuOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                handleMenuClose={handleMenuClose}
                handleMobileMenuClose={handleMobileMenuClose}
                handleProfileMenuOpen={handleProfileMenuOpen}
            />
        </Box>
    );
});

export default Header;
