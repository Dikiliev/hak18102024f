import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import BoxWithImage from "@components/boxWithImage/BoxWithImage";

interface BoxImageProps {
    src: string;
    text: string;
    alt: string;
    sx?: object;
}

const ImageWithText: React.FC<BoxImageProps> = ({ src, text, alt, sx }) => {
    return (
        <BoxWithImage imageUrl={src} sx={{ position: "relative", height: "100%", width: "100%", ...sx }}>
            <Typography
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    height: "100%",
                    alignContent: "end",

                    p: "1rem 2rem",
                }}
            >
                {text}
            </Typography>
        </BoxWithImage>
    );
};

// const ImageWithText: React.FC<BoxImageProps> = ({ src, text, alt, sx }) => {
//     return (
//         <Box sx={{ position: "relative", height: "100%", width: "100%", ...sx }}>
//             <Image src={src} alt={alt} />
//             <Typography
//                 variant={"body1"}
//                 sx={{
//                     position: "absolute",
//                     bottom: 10,
//                     left: 10,
//                     color: "white",
//                     fontWeight: "bold",
//                 }}
//             >
//                 {text}
//             </Typography>
//         </Box>
//     );
// };

export default ImageWithText;
