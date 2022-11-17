import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";

import { Appointment } from "../types";

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  appointments: Appointment[];
  selectedId: number;
  bookAppointment: (eventId: string) => Promise<void>;
}

const AppointmentConfirmationModal = ({
  modalDisclosure,
  appointments,
  selectedId,
  bookAppointment,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const a = appointments[selectedId];
  if (!a) {
    return <></>;
  }

  const handleBooking = async () => {
    setLoading(true);
    await bookAppointment(a.eventId);
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={modalDisclosure.isOpen} onClose={modalDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <>
            {loading ? (
              <ModalBody className="flex min-h-[500px] flex-col items-center justify-center">
                <Spinner
                  thickness="5px"
                  speed="0.75s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </ModalBody>
            ) : (
              <>
                <ModalHeader>Confirmacion de Cita</ModalHeader>
                <ModalCloseButton />
                <ModalBody className="flex flex-col gap-1">
                  <p className="place-self-center text-lg font-bold">
                    Esta seguro que desea confirmar esta cita?
                  </p>
                  <Divider className="py-1" />
                  <p className="font-bold">Fecha</p>
                  <p>{a.date}</p>
                  <p className="font-bold">Hora</p>
                  <p>{a.time}</p>
                  <p className="font-bold">N° de Cita</p>
                  <p>{a.appointmentId}</p>
                  <p className="font-bold">Consultorio</p>
                  <p>{a.facility}</p>
                  <p className="font-bold">Funcionario</p>
                  <p>{a.doctor}</p>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={handleBooking} colorScheme="blue" mr={3}>
                    Confirmar
                  </Button>
                  <Button onClick={modalDisclosure.onClose} variant="ghost">
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppointmentConfirmationModal;
