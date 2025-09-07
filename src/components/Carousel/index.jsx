import React, { useRef } from "react";
import { Box, Button, styled } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const Carousel = ({ items }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth;
    const maxScrollLeft = container.scrollWidth - container.offsetWidth;
    const threshold = 5; // để tránh lỗi do float

    if (direction === "right") {
      if (container.scrollLeft + threshold >= maxScrollLeft) {
        // Đã ở cuối → quay về đầu
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= threshold) {
        // Đã ở đầu → quay về cuối
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <SCButton
        sx={{
          left: 0,
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.14)",
            boxShadow: "14px 3px 5px 13px rgba(0,0,0,0.14)",
          },
        }}
        onClick={() => scroll("left")}
      >
        <ArrowBack />
      </SCButton>
      <SCButton
        sx={{
          right: 0,
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.14)",
            boxShadow: "-21px 3px 5px 13px rgba(0,0,0,0.14)",
          },
        }}
        onClick={() => scroll("right")}
      >
        <ArrowForward />
      </SCButton>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        ref={containerRef}
      >
        {items.map((item, index) => (
          <SCItemContainer key={index}>{item}</SCItemContainer>
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;

const SCItemContainer = styled(Box)(({ theme }) => ({
  scrollSnapAlign: "start",
}));

const SCButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  height: 300,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.14)",
    boxShadow: "14px 3px 5px 13px rgba(0,0,0,0.14)",
    "& > svg": {
      opacity: 1,
    },
  },
  "& > svg": {
    opacity: 0.3,
    color: theme.palette.secondary.main,
  },
}));
