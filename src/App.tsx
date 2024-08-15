import React, { useState } from 'react';
import { Container, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import './App.css';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodeType, setQrCodeType] = useState('text');

  const handleGenerate = () => {
    let value = text;
    if (qrCodeType === 'link') {
      value = `https://${text}`;
    } else if (qrCodeType === 'app') {
      value = `app://${text}`;
    }
    setQrCodeValue(value);
  };

  const handleDownload = (format: any) => {
    const svg = document.getElementById('qrCode')!;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(`image/${format}`);
      saveAs(dataURL, `qrcode.${format}`);
    };
  };

  return (
    <Container>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" height="100vh">
        <Box width={{ xs: '100%', md: '50%' }} p={2}>
          <FormControl fullWidth>
            <InputLabel>Tipo de QR Code</InputLabel>
            <Select
              value={qrCodeType}
              onChange={(e) => setQrCodeType(e.target.value)}
              label="Tipo de QR Code"
            >
              <MenuItem value="text">Texto</MenuItem>
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="app">Abrir App</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Conteúdo para QR Code"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginTop: '16px' }}
          />
          <Button variant="contained" color="primary" onClick={handleGenerate} style={{ marginTop: '16px' }}>
            Gerar QR Code
          </Button>
        </Box>
        <Box width={{ xs: '100%', md: '50%' }} display="flex" flexDirection="column" alignItems="center" p={2}>
          {qrCodeValue && (
            <>
              <QRCode id="qrCode" value={qrCodeValue} size={256} />
              <Button variant="contained" color="secondary" onClick={() => handleDownload('png')} style={{ marginTop: '16px' }}>
                Baixar QR Code (PNG)
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleDownload('jpeg')} style={{ marginTop: '16px' }}>
                Baixar QR Code (JPEG)
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

function App() {
  return (<QRCodeGenerator />);
}

export default App;
