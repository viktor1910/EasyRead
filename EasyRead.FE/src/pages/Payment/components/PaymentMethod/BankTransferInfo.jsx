import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
  Grid,
  Chip,
  IconButton
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BankTransferInfo = () => {
  const [copiedField, setCopiedField] = useState("");

  const bankAccounts = [
    {
      bankName: "Vietcombank",
      accountNumber: "1234567890",
      accountName: "CONG TY TNHH EASYREAD",
      branch: "Chi nhánh Hà Nội",
      logo: "🏦"
    },
    {
      bankName: "Techcombank", 
      accountNumber: "0987654321",
      accountName: "CONG TY TNHH EASYREAD",
      branch: "Chi nhánh TP.HCM",
      logo: "🏛️"
    },
    {
      bankName: "BIDV",
      accountNumber: "1122334455",
      accountName: "CONG TY TNHH EASYREAD", 
      branch: "Chi nhánh Đống Đa",
      logo: "🏪"
    }
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateTransferNote = () => {
    // Generate a simple transfer note with order ID
    const orderId = `ER${Date.now().toString().slice(-6)}`;
    return `EasyRead ${orderId}`;
  };

  const transferNote = generateTransferNote();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalanceIcon />
        Thông tin chuyển khoản
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1" fontWeight="medium">
          Hướng dẫn chuyển khoản
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          1. Chọn một trong các tài khoản ngân hàng bên dưới<br/>
          2. Thực hiện chuyển khoản với đúng số tiền và nội dung<br/>
          3. Đơn hàng sẽ được xử lý sau khi nhận được thanh toán (1-2 giờ)
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        {bankAccounts.map((bank, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                height: '100%',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h4">{bank.logo}</Typography>
                <Typography variant="h6" color="primary">
                  {bank.bankName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Số tài khoản
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontFamily="monospace">
                    {bank.accountNumber}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(bank.accountNumber, `account-${index}`)}
                    color={copiedField === `account-${index}` ? "success" : "default"}
                  >
                    {copiedField === `account-${index}` ? <CheckCircleIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tên tài khoản
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {bank.accountName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Chi nhánh
                </Typography>
                <Typography variant="body2">
                  {bank.branch}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Transfer Note */}
      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
        <Typography variant="h6" color="warning.dark" gutterBottom>
          ⚠️ Nội dung chuyển khoản (Quan trọng)
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip 
            label={transferNote}
            color="warning"
            variant="outlined"
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 'bold',
              fontFamily: 'monospace',
              py: 2
            }}
          />
          <Button
            variant="outlined"
            startIcon={copiedField === 'transfer-note' ? <CheckCircleIcon /> : <ContentCopyIcon />}
            onClick={() => copyToClipboard(transferNote, 'transfer-note')}
            color={copiedField === 'transfer-note' ? "success" : "warning"}
          >
            {copiedField === 'transfer-note' ? 'Đã copy' : 'Copy'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Lưu ý:</strong> Vui lòng ghi chính xác nội dung chuyển khoản để chúng tôi có thể xác nhận thanh toán nhanh chóng.
        </Typography>
      </Paper>

      {/* Additional Info */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" fontWeight="medium" gutterBottom>
          📋 Thông tin bổ sung
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Phí chuyển khoản (nếu có) sẽ do khách hàng chi trả
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Đơn hàng sẽ được xác nhận và xử lý trong vòng 1-2 giờ làm việc
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Liên hệ hotline 1900-1234 nếu cần hỗ trợ
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Đơn hàng sẽ tự động hủy nếu không nhận được thanh toán trong 24 giờ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BankTransferInfo;
