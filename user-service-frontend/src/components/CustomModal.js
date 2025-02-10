import React from "react";
import { Modal } from "antd";

const CustomModal = ({ title, visible, onClose, children }) => {
  return (
    <Modal title={title} open={visible} onCancel={onClose} footer={null}>
      {children}
    </Modal>
  );
};

export default CustomModal;
