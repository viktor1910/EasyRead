import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Number1,
  Number2,
  Number3,
  Number4,
  Number5,
  Number6,
  Number7,
  Number8,
  Number9,
  Number10,
} from "../../../../components/Icon/Top10Number";

const MotopartTopItem = ({ top, motopart }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Default fallback data when no motopart is provided
  const motopartName = motopart?.name || "Motopart Name";
  // Handle supplier as string
  const motopartSupplier = motopart?.supplier || "Supplier Name";
  const motopartImage =
    motopart?.image_full_url ||
    motopart?.image_url ||
    "https://salt.tikicdn.com/cache/750x750/ts/product/e2/9e/ed/e1dbece01b595a871eadb52369e3b20c.jpg.webp";

  console.log("MotopartTopItem motopart", motopart);
  const handleClick = () => {
    if (motopart?.id) {
      navigate(`/motoparts/${motopart.id}`);
    }
  };

  return (
    <Box
      width="420px"
      height="300px"
      sx={{
        position: "relative",
        transition: "transform 0.3s cubic-bezier(.21,1.02,.73,1)",
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        transform: hovered ? "scale(1.08)" : "scale(1)",
        boxShadow: hovered
          ? "0 8px 40px rgba(0,0,0,0.6), 0 1.5px 4px rgba(0,0,0,0.15)"
          : "none",
        borderRadius: hovered ? 12 : 0,
        background: "transparent",
        overflow: "visible",
        cursor: "pointer",
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="120px" height="300px" mb={1}>
          {top === 1 && <Number1 />}
          {top === 2 && <Number2 />}
          {top === 3 && <Number3 />}
          {top === 4 && <Number4 />}
          {top === 5 && <Number5 />}
          {top === 6 && <Number6 />}
          {top === 7 && <Number7 />}
          {top === 8 && <Number8 />}
          {top === 9 && <Number9 />}
          {top === 10 && <Number10 />}
        </Box>
        <Box
          sx={{
            height: "300px",
            width: "236px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "236px",
              height: "280px",
              position: "relative",
            }}
            mb={1}
          >
            <img
              src={motopartImage}
              alt={`${motopartName} image`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: hovered ? 8 : 0,
                transition: "border-radius 0.3s",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MotopartTopItem;
