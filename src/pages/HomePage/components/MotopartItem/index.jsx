import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

const MotopartItem = ({ motopart }) => {
  console.log("MotopartItem motopart", motopart);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  MotopartItem.propTypes = {
    motopart: PropTypes.object.isRequired,
  };

  if (!motopart) {
    return (
      <Box
        sx={{
          width: "240px",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Typography>Không có dữ liệu</Typography>
      </Box>
    );
  }

  const discountedPrice = motopart.discount
    ? motopart.price - (motopart.price * motopart.discount) / 100
    : motopart.price;

  return (
    <Box
      sx={{
        width: "240px",
        height: "350px",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 1,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          : "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/motoparts/${motopart.id}`)}
    >
      <Box
        sx={{
          width: "236px",
          height: "236px",
        }}
        mb={1}
      >
        <img
          src={motopart.image_full_url || motopart.image_url || "/placeholder-motopart.jpg"}
          alt={motopart.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: "2.4em",
            lineHeight: "1.2em",
            mb: 1,
          }}
        >
          {motopart.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {motopart.supplier}
        </Typography>
      </Box>
    </Box>
  );
};

export default MotopartItem;
