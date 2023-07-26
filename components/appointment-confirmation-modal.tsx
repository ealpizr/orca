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
  useDisclosure,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useContext, useState } from "react";

import AppContext from "~/context/app-context";
import { Appointment } from "../types";

type Props = {
  setAppointment: Dispatch<SetStateAction<Appointment | undefined>>;
  appointment: Appointment | undefined;
  bookAppointment: () => Promise<void>;
};

const AppointmentConfirmationModal = ({
  appointment,
  setAppointment,
  bookAppointment,
}: Props) => {
  const { appContext } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const { onClose } = useDisclosure();

  const handleBooking = async () => {
    setLoading(true);
    await bookAppointment();
    setLoading(false);
  };

  if (!appointment) {
    return <></>;
  }

  return (
    <>
      <Modal
        isOpen={appointment !== undefined}
        onClose={() => setAppointment(undefined)}
      >
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
                <ModalHeader>Confirmación de Cita</ModalHeader>
                <ModalCloseButton />
                <ModalBody className="flex flex-col gap-1">
                  <p className="place-self-center text-lg font-bold">
                    ¿Desea confirmar la cita?
                  </p>
                  <Divider className="py-1" />
                  <p className="font-bold">Fecha</p>
                  <p>{appointment!.fecCupo}</p>
                  <p className="font-bold">Hora</p>
                  <p>{appointment!.horaCupo}</p>
                  <p className="font-bold">N° de Cita</p>
                  <p>{appointment!.conCupo}</p>
                  <p className="font-bold">Consultorio</p>
                  <p>{appointment!.dscConsultorio}</p>
                  <p className="font-bold">Funcionario</p>
                  <p>{appointment!.nomProfesional}</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    mr={3}
                    onClick={() => {
                      setAppointment(undefined);
                    }}
                    variant="ghost"
                  >
                    Cerrar
                  </Button>
                  <Button
                    onClick={handleBooking}
                    colorScheme="linkedin"
                    className="bg-[var(--chakra-colors-linkedin-500)]"
                  >
                    Confirmar
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
