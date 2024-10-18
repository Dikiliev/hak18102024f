// src/components/header/SearchBar.tsx
import React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: "500px",
  margin: "auto",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.common.white,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SearchBar: React.FC = () => {
  return (
    <Box flexGrow={1} m={"auto"}>
      <Search>
        <StyledInputBase placeholder="Искать..." inputProps={{ "aria-label": "search" }} />
        <SearchIconButton aria-label="search">
          <SearchIcon />
        </SearchIconButton>
      </Search>
    </Box>
  );
};

export default SearchBar;
