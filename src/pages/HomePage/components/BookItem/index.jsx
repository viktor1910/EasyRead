import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import PropTypes from "prop-types";

const BookItem = ({ book }) => {
  console.log("BookItem book", book);
  const navigate = useNavigate();
  BookItem.propTypes = {
    book: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      price: PropTypes.number,
      discount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf([null]),
      ]),
      stock: PropTypes.number,
      status: PropTypes.string,
      description: PropTypes.string,
      image_url: PropTypes.string,
      category_id: PropTypes.number,
      author_id: PropTypes.number,
      published_year: PropTypes.number,
      publisher: PropTypes.string,
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      image_full_url: PropTypes.string,
    }).isRequired,
  };
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        height: "300px",
        width: "236px",
        position: "relative",
        transition:
          "transform 0.3s cubic-bezier(.21,.6,.4,1.02), box-shadow 0.3s",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        zIndex: hovered ? 10 : 1,
        boxShadow: hovered
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          : "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <Box
        sx={{
          width: "236px",
          height: "236px",
        }}
        mb={1}
      >
        <img
          src={book.image_full_url || book.image_url}
          alt={book.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        {hovered && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "236px",
              height: "300px",
              bgcolor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              borderRadius: "8px",
              transition: "background 0.3s",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Quick View
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h6" fontWeight={700} pl={1} mb={0.5}>
        {book.title}
      </Typography>
      <Typography variant="body2" pl={1}>
        {book.publisher}
      </Typography>
    </Box>
  );
};

export default BookItem;
