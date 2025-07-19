import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PDFViewerModal = ({ open, onClose, url }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Comprobante de Pago
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <iframe
          src={url}
          title="Comprobante PDF"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
