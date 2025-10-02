import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
// ...existing code...
const CategoryItem = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/categories/${category?.id}`)}
    >
      <Box
        sx={{
          height: "150px",
          width: "150px",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={
            category?.image_url ||
            "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/06/Memoir-vs.-Autobiography-437x233.jpg"
          }
          alt={category?.name || "Motopart Category"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            textShadow: "-4px 1px 6px rgba(0,0,0,0.58)",
          }}
        >
          {category?.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textShadow: "-4px 1px 6px rgba(0,0,0,0.58)",
          }}
        >
          300 motoparts
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryItem;
