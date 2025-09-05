import React from "react";
import { Stepper, Step, StepLabel, Box, useTheme, useMediaQuery } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
  {
    label: "Giỏ hàng",
    icon: <ShoppingCartIcon />
  },
  {
    label: "Thông tin giao hàng",
    icon: <LocalShippingIcon />
  },
  {
    label: "Phương thức thanh toán",
    icon: <PaymentIcon />
  },
  {
    label: "Xác nhận đơn hàng",
    icon: <CheckCircleIcon />
  }
];

const PaymentStepper = ({ activeStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          '& .MuiStepLabel-root': {
            color: theme.palette.text.secondary,
          },
          '& .MuiStepLabel-label': {
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 500,
            display: { xs: isMobile ? 'block' : 'none', md: 'block' }
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: theme.palette.success.main,
            fontWeight: 600,
          },
          '& .MuiStepIcon-root': {
            fontSize: { xs: '1.5rem', md: '2rem' },
            color: theme.palette.grey[400],
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: theme.palette.primary.main,
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: theme.palette.success.main,
          },
          '& .MuiStepConnector-root': {
            top: { xs: 12, md: 16 },
          },
          '& .MuiStepConnector-line': {
            borderColor: theme.palette.grey[300],
            borderTopWidth: 2,
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: theme.palette.success.main,
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={({ active, completed }) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 },
                    borderRadius: '50%',
                    backgroundColor: completed 
                      ? theme.palette.success.main 
                      : active 
                        ? theme.palette.primary.main 
                        : theme.palette.grey[300],
                    color: completed || active ? '#fff' : theme.palette.grey[600],
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  {completed ? <CheckCircleIcon /> : step.icon}
                </Box>
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PaymentStepper;
