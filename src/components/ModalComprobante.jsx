import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalComprobante = ({ url, onClose }) => {
  return (
    <Dialog open={Boolean(url)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Comprobante
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {url ? (
          <iframe
            src={url}
            title="PDF"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          ></iframe>
        ) : (
          "No hay comprobante disponible."
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalComprobante;
