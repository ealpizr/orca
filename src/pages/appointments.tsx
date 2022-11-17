import {
  Flex,
  FormControl,
  FormLabel,
  Input,
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
  useToast,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppointmentConfirmationModal from "../components/AppointmentConfirmationModal";
import type { Appointment } from "../types";

const Appointments: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { cookies } = router.query;

  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [viewState, setViewState] = useState<string>("");
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
    const body = await response.json();
    setAppointments(body.appointments);
    setViewState(body.viewstate);
  };

  const bookAppointment = async (eventId: string) => {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date.toLocaleString("es-ES").substring(0, 10),
        viewState,
        eventId,
        cookies,
      }),
    });

    if (response.status !== 200) {
      toast({
        status: "error",
        isClosable: true,
        title: "Ocurrio un error al asignar la cita",
        position: "top",
      });
      return;
    }

    toast({
      status: "success",
      isClosable: true,
      title: "La cita ha sido asignada correctamente",
      position: "top",
    });
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
            <AppointmentConfirmationModal
              modalDisclosure={modalDisclosure}
              appointments={appointments}
              selectedId={selectedId}
              bookAppointment={bookAppointment}
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

export default Appointments;
