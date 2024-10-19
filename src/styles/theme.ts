import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface TypographyVariants {
        actayWide: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        actayWide?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        actayWide: true;
    }
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#006BFF',
            contrastText: '#ffffff',
        },
        secondary: {
            // main: '#FF407D',
            main: '#1E3E62',
            contrastText: '#ffffff',
        },
        error: {
            // main: '#E41749',
            main: '#FF2626',
        },
        background: {
            default: '#F5F5F5',
            paper: '#fff',
        },
        text: {
            primary: '#000',
            secondary: '#0B192C',
        },
        info: {
            main: '#307ef2',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#FF885B',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Manrope',
        h1: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h2: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h5: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h6: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        button: {
            fontFamily: 'Manrope',
        },

        actayWide: {
            fontFamily: 'ActayWide',
        },
    },

    shape: {
        borderRadius: 8,
    },

    shadows: [
        'none', // shadow 0 (нет тени)
        '0px 1px 5px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.12)', // shadow 1
        '0px 2px 8px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.1)', // shadow 2
        '0px 4px 10px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.09)', // shadow 3
        '0px 6px 15px rgba(0, 0, 0, 0.05), 0px 3px 6px rgba(0, 0, 0, 0.08)', // shadow 4
        '0px 8px 20px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.07)', // shadow 5
        '0px 10px 25px rgba(0, 0, 0, 0.03), 0px 5px 10px rgba(0, 0, 0, 0.06)', // shadow 6
        '0px 12px 30px rgba(0, 0, 0, 0.03), 0px 6px 12px rgba(0, 0, 0, 0.05)', // shadow 7
        '0px 14px 35px rgba(0, 0, 0, 0.02), 0px 7px 14px rgba(0, 0, 0, 0.04)', // shadow 8
        '0px 16px 40px rgba(0, 0, 0, 0.02), 0px 8px 16px rgba(0, 0, 0, 0.04)', // shadow 9
        '0px 18px 45px rgba(0, 0, 0, 0.02), 0px 9px 18px rgba(0, 0, 0, 0.03)', // shadow 10
        '0px 20px 50px rgba(0, 0, 0, 0.01), 0px 10px 20px rgba(0, 0, 0, 0.03)', // shadow 11
        '0px 22px 55px rgba(0, 0, 0, 0.01), 0px 11px 22px rgba(0, 0, 0, 0.02)', // shadow 12
        '0px 24px 60px rgba(0, 0, 0, 0.01), 0px 12px 24px rgba(0, 0, 0, 0.02)', // shadow 13
        '0px 26px 65px rgba(0, 0, 0, 0.01), 0px 13px 26px rgba(0, 0, 0, 0.02)', // shadow 14
        '0px 28px 70px rgba(0, 0, 0, 0.01), 0px 14px 28px rgba(0, 0, 0, 0.01)', // shadow 15
        '0px 30px 75px rgba(0, 0, 0, 0.01), 0px 15px 30px rgba(0, 0, 0, 0.01)', // shadow 16
        '0px 32px 80px rgba(0, 0, 0, 0.01), 0px 16px 32px rgba(0, 0, 0, 0.01)', // shadow 17
        '0px 34px 85px rgba(0, 0, 0, 0.01), 0px 17px 34px rgba(0, 0, 0, 0.01)', // shadow 18
        '0px 36px 90px rgba(0, 0, 0, 0.01), 0px 18px 36px rgba(0, 0, 0, 0.01)', // shadow 19
        '0px 38px 95px rgba(0, 0, 0, 0.01), 0px 19px 38px rgba(0, 0, 0, 0.01)', // shadow 20
        '0px 40px 100px rgba(0, 0, 0, 0.01), 0px 20px 40px rgba(0, 0, 0, 0.01)', // shadow 21
        '0px 42px 105px rgba(0, 0, 0, 0.01), 0px 21px 42px rgba(0, 0, 0, 0.01)', // shadow 22
        '0px 44px 110px rgba(0, 0, 0, 0.01), 0px 22px 44px rgba(0, 0, 0, 0.01)', // shadow 23
        '0px 46px 115px rgba(0, 0, 0, 0.01), 0px 23px 46px rgba(0, 0, 0, 0.01)', // shadow 24
    ],
});

theme.components = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                '&.Mui-disabled': {},
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                background: 'none',
                backgroundColor: theme.palette.background.paper,
                boxShadow: 'none',
            },
        },
    },
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
    },
};

export default theme;
