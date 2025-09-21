import React from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import BookItem from "../BookItem";
import BookTopItem from "../BookItem/BookTopItem";
import Carousel from "../../../../components/Carousel";
import { useMostOrderedBooksQuery } from "../../../../services/books/booksService";

const Top10Book = () => {
  const {
    data: mostOrderedBooks,
    isLoading,
    isError,
    error,
  } = useMostOrderedBooksQuery();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h2" component="p" mb={2}>
          Top 10 sách bán chạy nhất:
        </Typography>
        <Typography variant="body1" color="error">
          Không thể tải dữ liệu sách bán chạy. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  const books = mostOrderedBooks || [];
  const topBooks = books.slice(0, 10); // Ensure we only get top 10

  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top 10 sách bán chạy nhất:
      </Typography>

      <Carousel
        items={
          topBooks?.map((book, index) => (
            <BookTopItem key={book.id} top={index + 1} book={book} />
          )) || []
        }
      />
    </Box>
  );
};

export default Top10Book;
