import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import image1 from "@assets/images/pcs/photo_2024-08-06_21-07-37.jpg";
import image2 from "@assets/images/pcs/photo_5_2024-08-06_18-07-11.jpg";
import image3 from "@assets/images/pcs/photo_5_2024-08-06_18-07-11.jpg";

// Стиль для изображения с objectFit: 'cover'
const Image = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%", // Заполняет всю высоту контейнера
  borderRadius: theme.shape.borderRadius,
  objectFit: "cover", // Заполняет всю ширину контейнера, сохраняя пропорции
}));

interface BoxImageProps {
  src: string;
  text: string;
  alt: string;
  sx?: object;
}

const ImageWithText: React.FC<BoxImageProps> = ({ src, text, alt, sx }) => {
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", ...sx }}>
      <Image src={src} alt={alt} />
      <Typography
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          color: "white",
          fontWeight: "bold",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const TestPage = () => {
  const totalHeight = 500; // Общая высота контейнера
  const gapSize = 2 * 8; // Размер отступа (MUI spacing unit: 1 = 8px)
  const numberOfImages = 3;
  const imageHeight = (totalHeight - gapSize * (numberOfImages - 1)) / numberOfImages;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} sx={{ height: totalHeight }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: `${gapSize}px`, // Устанавливаем gap в пикселях
          }}
        >
          <Box sx={{ flexGrow: 1, height: `${imageHeight}px`, width: "100%" }}>
            <ImageWithText src={image1} text="Image 1" alt="Image 1" />
          </Box>

          <Box sx={{ flexGrow: 1, height: `${imageHeight}px`, width: "100%" }}>
            <ImageWithText src={image2} text="Image 2" alt="Image 2" />
          </Box>

          <Box sx={{ flexGrow: 1, height: `${imageHeight}px`, width: "100%" }}>
            <ImageWithText src={image3} text="Image 3" alt="Image 3" />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TestPage;
