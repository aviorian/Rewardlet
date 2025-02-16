import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import MetaMaskIcon from "./MetaMask_Fox.svg.png"; // Assuming you have a MetaMask icon file

const AddressBar = ({ address }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDroppedDown, setIsDroppedDown] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsDroppedDown(!isDroppedDown);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsDroppedDown(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {/* MetaMask Logo */}
      <img
        src={MetaMaskIcon}
        alt="MetaMask Logo"
        style={{ width: "24px", height: "24px", marginRight: "8px" }}
      />

      {/* Address display */}
      <Typography variant="body1" noWrap>
        {isDroppedDown
          ? address
          : `${address.slice(0, 6)}...${address.slice(-4)}`}
      </Typography>

      {/* Dropdown icon */}
      <IconButton onClick={handleMenuClick}>
        <ArrowDropDown />
      </IconButton>

      {/* Address Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isDroppedDown}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 200, // Set max height for dropdown menu
            width: "200px",
          },
        }}
      >
        <MenuItem>{address}</MenuItem>
      </Menu>
    </div>
  );
};

export default AddressBar;
