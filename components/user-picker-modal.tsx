import {
  Avatar,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { UserData } from "~/types";

type Props = {
  isOpen: boolean;
  users: UserData[];
  onPick: (u: UserData) => void;
};

export default function UserPickerModal({ isOpen, users, onPick }: Props) {
  const { onClose } = useDisclosure();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Usuarios</ModalHeader>
        <ModalBody display="flex" flexDir="column" gap={3}>
          {users.map((u) => (
            <Card key={u.userId} onClick={() => onPick(u)} cursor="pointer">
              <CardBody display="flex" alignItems="center" gap={3}>
                <Avatar name={u.fullName} />
                <Text>{u.fullName}</Text>
              </CardBody>
            </Card>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
