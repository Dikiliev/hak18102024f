import React from "react";
import { Box, BoxProps } from "@mui/material";
import theme from "@styles/theme";

interface BoxWithImageProps extends BoxProps {
    imageUrl: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    overlayColor?: string;
    overlayOpacity?: number;
}

const BoxWithImage: React.FC<BoxWithImageProps> = ({
    imageUrl,
    backgroundSize = "cover",
    backgroundPosition = "center",
    backgroundRepeat = "no-repeat",
    overlayColor = "black",
    overlayOpacity = 0.5,
    children,
    ...boxProps
}) => {
    return (
        <Box
            {...boxProps}
            sx={{
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: overlayColor,
                    opacity: overlayOpacity,
                    zIndex: 1,
                },
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition,
                backgroundRepeat: backgroundRepeat,
                zIndex: 0,
                borderRadius: 1,
                ...boxProps.sx,
            }}
        >
            <Box sx={{ position: "relative", zIndex: 2, height: "100%" }}>{children}</Box>
        </Box>
    );
};

export default BoxWithImage;
