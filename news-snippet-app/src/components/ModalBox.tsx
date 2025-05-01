import { Modal, Typography } from 'antd';

interface ModalBoxProps {
  loading: boolean;
  open: boolean;
  onClose: () => void;
  data: {
    AB: string;
  };
}

const { Text } = Typography;
export const ModalBox = ({ open, onClose, data, loading }: ModalBoxProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title='Info'
      loading={loading}
    >
      <Text>{data.AB}</Text>
    </Modal>
  );
};
