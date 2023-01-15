import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AppointmentConfirmationModal from "../components/AppointmentConfirmationModal";
import type { Appointment, GlobalProps, Service, Specialty } from "../types";

const Appointments = ({ token, userData }: GlobalProps) => {
  const router = useRouter();
  const toast = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedService, setSelectedService] = useState<number>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(new Date());

  const modalDisclosure = useDisclosure();

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }
    getServices();
    getAppointments();
  }, []);

  useEffect(() => {
    if (selectedService === undefined) return;
    getSpecialties();
  }, [selectedService]);

  useEffect(() => {
    if (selectedSpecialty === undefined) return;
    getAppointments();
  }, [selectedSpecialty, date]);

  const getServices = async () => {
    const response = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        healthCenterCode: userData.healthCenterCode,
      }),
    });
    const body = await response.json();
    setServices(body);
    setSelectedService(body[0].codeServicio);
  };

  const getSpecialties = async () => {
    const response = await fetch("/api/specialties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        healthCenterCode: userData.healthCenterCode,
        serviceCode: selectedService,
      }),
    });
    const body = await response.json();
    setSpecialties(body);
    setSelectedSpecialty(body[0]);
  };

  const getAppointments = async () => {
    if (!selectedSpecialty) {
      return;
    }
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        id: userData.id,
        serviceCode: selectedService,
        specialtyCode: selectedSpecialty.codeEspecialidad,
        serviceSpecialtyCode: selectedSpecialty.codeServicioEspecialidad,
        date: date.toLocaleString("es-ES").substring(0, 10),
      }),
    });
    const body = await response.json();
    setAppointments(body);
    setLoading(false);
  };

  const bookAppointment = async (eventId: string) => {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date.toLocaleString("es-ES").substring(0, 10),
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
      <Flex className="h-full flex-1 flex-col items-center justify-between">
        <header className="w-full py-5 shadow">
          <img className="mx-auto max-w-[100px]" src="/orca.svg" />
        </header>
        {loading ? (
          <Spinner
            thickness="5px"
            speed="0.75s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Stack className="w-full max-w-[1000px] overflow-auto p-4">
            <AppointmentConfirmationModal
              modalDisclosure={modalDisclosure}
              appointment={selectedAppointment}
              bookAppointment={bookAppointment}
            />
            <FormControl>
              <FormLabel>Servicio</FormLabel>
              <Select
                onChange={(e) => {
                  setSelectedService(parseInt(e.target.value));
                }}
              >
                {services.map((s, idx) => (
                  <option key={idx} value={s.codeServicio}>
                    {s.dscServicio}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Especialidad</FormLabel>
              <Select
                onChange={(e) => {
                  setSelectedSpecialty(JSON.parse(e.target.value));
                }}
              >
                {specialties.map((s, idx) => (
                  <option key={idx} value={JSON.stringify(s)}>
                    {s.dscEspecialidad}
                  </option>
                ))}
              </Select>
            </FormControl>
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
            <TableContainer overflowY="auto" className="rounded-lg border p-2">
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
                {!appointments || appointments.length == 0 ? (
                  <TableCaption>No hay cupos disponibles</TableCaption>
                ) : (
                  <Tbody>
                    {appointments.map((a) => {
                      return (
                        <Tr
                          onClick={() => {
                            setSelectedAppointment(a);
                            modalDisclosure.onOpen();
                          }}
                          className="cursor-pointer transition-all hover:bg-blue-400"
                          key={a.conCupo}
                        >
                          <Td className="hidden lg:block" textAlign="center">
                            {a.fecCupo}
                          </Td>
                          <Td textAlign="center">{a.horaCupo}</Td>
                          <Td className="hidden lg:block" textAlign="center">
                            {a.conCupo}
                          </Td>
                          <Td>{a.dscConsultorio}</Td>
                          <Td className="block">{a.nomProfesional}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                )}
              </Table>
            </TableContainer>
          </Stack>
        )}
        <footer className="w-full p-2 text-center font-bold">
          <p>
            Desarrollado con <span className="text-red-500">♥</span> por{" "}
            <a
              href="https://github.com/ealpizr/orca"
              className="text-blue-500 underline"
            >
              ealpizar
            </a>
          </p>
        </footer>
      </Flex>
    </main>
  );
};

export default Appointments;
