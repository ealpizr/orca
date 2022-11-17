import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Appointment } from "../types";

const Appointments: NextPage = () => {
  const router = useRouter();
  const { cookies } = router.query;

  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());

  const modalDisclosure = useDisclosure();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!cookies) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setAppointments(null);
    getAppointments();
  }, [date]);

  const getAppointments = async () => {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date.toLocaleString("es-ES").substring(0, 10),
        cookies,
      }),
    });
    setAppointments(await response.json());
  };

  return (
    <main className="h-full">
      <Flex className="h-full items-center justify-center">
        {!appointments ? (
          <Spinner
            thickness="5px"
            speed="0.75s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Stack className="overflow-auto px-4">
            <ConfirmationModal
              modalDisclosure={modalDisclosure}
              appointments={appointments}
              selectedId={selectedId}
            />
            <FormControl>
              <FormLabel>Fecha</FormLabel>
              <Input
                defaultValue={date.toISOString().substring(0, 10)}
                onChange={(e) => {
                  setDate(new Date(e.target.value.replaceAll("-", "/")));
                }}
                type="date"
              />
            </FormControl>
            <TableContainer className="rounded-lg border p-2">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th className="hidden lg:block" textAlign="center">
                      Fecha
                    </Th>
                    <Th textAlign="center">Hora</Th>
                    <Th className="hidden lg:block" textAlign="center">
                      N° de Cita
                    </Th>
                    <Th textAlign="center">Consultorio</Th>
                    <Th textAlign="center">Funcionario</Th>
                  </Tr>
                </Thead>
                {appointments.length == 0 ? (
                  <TableCaption>No hay cupos disponibles</TableCaption>
                ) : (
                  <Tbody>
                    {appointments.map((a, idx) => {
                      return (
                        <Tr
                          onClick={() => {
                            setSelectedId(idx);
                            modalDisclosure.onOpen();
                          }}
                          className="cursor-pointer transition-all hover:bg-blue-400"
                          key={a.appointmentId}
                        >
                          <Td className="hidden lg:block" textAlign="center">
                            {a.date}
                          </Td>
                          <Td textAlign="center">{a.time}</Td>
                          <Td className="hidden lg:block" textAlign="center">
                            {a.appointmentId}
                          </Td>
                          <Td>{a.facility}</Td>
                          <Td className="block">{a.doctor}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                )}
              </Table>
            </TableContainer>
          </Stack>
        )}
      </Flex>
    </main>
  );
};

const ConfirmationModal = ({
  modalDisclosure,
  appointments,
  selectedId,
}: {
  modalDisclosure: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  appointments: Appointment[];
  selectedId: number;
}) => {
  const a = appointments[selectedId];
  if (!a) {
    return <></>;
  }
  return (
    <>
      <Modal isOpen={modalDisclosure.isOpen} onClose={modalDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
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
            <Button colorScheme="blue" mr={3}>
              Confirmar
            </Button>
            <Button onClick={modalDisclosure.onClose} variant="ghost">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Appointments;
