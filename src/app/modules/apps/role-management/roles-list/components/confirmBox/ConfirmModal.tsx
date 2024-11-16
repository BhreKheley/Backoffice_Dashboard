import { FC } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah Anda yakin ingin menyimpan pengguna ini?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
