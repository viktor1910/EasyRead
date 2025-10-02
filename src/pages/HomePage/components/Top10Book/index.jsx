import React from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import MotopartItem from "../MotopartItem";
import MotopartTopItem from "../MotopartItem/MotopartTopItem";
import Carousel from "../../../../components/Carousel";
import { useMostOrderedMotopartsQuery } from "../../../../services/motoparts/motopartsService";

const Top10Motopart = () => {
  const {
    data: mostOrderedMotoparts,
    isLoading,
    isError,
    error,
  } = useMostOrderedMotopartsQuery();

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
          Top 10 phụ tùng bán chạy nhất:
        </Typography>
        <Typography variant="body1" color="error">
          Không thể tải dữ liệu phụ tùng bán chạy. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  const motoparts = mostOrderedMotoparts || [];
  const topMotoparts = motoparts.slice(0, 10); // Ensure we only get top 10

  return (
    <Box>
      <Typography variant="h2" component="p" mb={2}>
        Top 10 phụ tùng bán chạy nhất:
      </Typography>

      <Carousel
        items={
          topMotoparts?.map((motopart, index) => (
            <MotopartTopItem
              key={motopart.id}
              top={index + 1}
              motopart={motopart}
            />
          )) || []
        }
      />
    </Box>
  );
};

export default Top10Motopart;
