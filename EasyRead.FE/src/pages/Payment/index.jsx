import React, { useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import PaymentStepper from "./components/PaymentStepper";
import CartReview from "./components/CartReview";
import ShippingInfo from "./components/ShippingInfo";
import PaymentMethod from "./components/PaymentMethod";
import OrderConfirmation from "./components/OrderConfirmation";

const PaymentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentData, setPaymentData] = useState({
    cart: {
      items: [
        {
          id: 1,
          title: "Effective TypeScript",
          author: "Dan Vanderkam",
          price: 299000,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300"
        },
        {
          id: 2,
          title: "Clean Code",
          author: "Robert C. Martin", 
          price: 399000,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300"
        }
      ],
      subtotal: 698000,
      shipping: 30000,
      tax: 0,
      discount: 0,
      total: 728000
    },
    shipping: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      notes: "",
      deliveryOption: "standard"
    },
    payment: {
      method: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: ""
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updatePaymentData = (section, data) => {
    setPaymentData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <CartReview
            cartData={paymentData.cart}
            onNext={handleNext}
            onUpdateCart={(data) => updatePaymentData('cart', data)}
          />
        );
      case 1:
        return (
          <ShippingInfo
            shippingData={paymentData.shipping}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateShipping={(data) => updatePaymentData('shipping', data)}
          />
        );
      case 2:
        return (
          <PaymentMethod
            paymentData={paymentData.payment}
            onNext={handleNext}
            onBack={handleBack}
            onUpdatePayment={(data) => updatePaymentData('payment', data)}
          />
        );
      case 3:
        return (
          <OrderConfirmation
            orderData={paymentData}
            onBack={handleBack}
            onConfirm={() => {
              // Handle order confirmation
              console.log("Order confirmed:", paymentData);
            }}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Thanh toán
        </Typography>
        
        <PaymentStepper activeStep={activeStep} />
        
        <Box sx={{ mt: 4 }}>
          {renderStepContent()}
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentPage;
