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
  appointment: Appointment | undefined;
  bookAppointment: (appointment: Appointment) => Promise<void>;
}

const AppointmentConfirmationModal = ({
  modalDisclosure,
  appointment,
  bookAppointment,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  if (!appointment) {
    return <></>;
  }

  const handleBooking = async () => {
    setLoading(true);
    await bookAppointment(appointment);
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
                  <p>{appointment.fecCupo}</p>
                  <p className="font-bold">Hora</p>
                  <p>{appointment.horaCupo}</p>
                  <p className="font-bold">N° de Cita</p>
                  <p>{appointment.conCupo}</p>
                  <p className="font-bold">Consultorio</p>
                  <p>{appointment.dscConsultorio}</p>
                  <p className="font-bold">Funcionario</p>
                  <p>{appointment.nomProfesional}</p>
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
