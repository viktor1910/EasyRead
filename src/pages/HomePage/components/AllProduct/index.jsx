import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MotopartItem from "../MotopartItem";
import Carousel from "../../../../components/Carousel";
import { useMotoparts } from "../../../../services/motoparts";

const AllProduct = () => {
  const { data } = useMotoparts({
    page_size: 1000,
  });
  const motoparts = data?.results || [];
  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="h2" component="p" mb={2}>
        Tất cả sản phẩm
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {Array.isArray(motoparts) &&
          motoparts.map((motopart) => (
            <MotopartItem key={motopart.id} motopart={motopart} />
          ))}
      </Box>
    </Box>
  );
};

export default AllProduct;
