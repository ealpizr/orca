"use client";

import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
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
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import AppointmentConfirmationModal from "~/components/appointment-confirmation-modal";
import Spinner from "~/components/spinner";
import AppContext from "~/context/app-context";
import AppointmentService from "~/services/appointment-service";
import DataService from "~/services/data-service";
import type { Appointment, Service, Specialty } from "~/types";

const Appointments = () => {
  const { appContext } = useContext(AppContext);

  const router = useRouter();
  const toast = useToast({ position: "top" });

  const [data, setData] = useState<{
    services: Service[];
    specialties: Specialty[];
    appointments: Appointment[];
  } | null>(null);

  const [selectedService, setSelectedService] = useState<number>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>();

  const [date, setDate] = useState<Date>(new Date());

  const modalDisclosure = useDisclosure();

  async function fetchInitialData() {
    const services = await DataService.getServices(
      appContext.EDUSAPIToken!,
      appContext.user!.healthCenterCode
    );

    const specialties = await DataService.getSpecialties(
      appContext.EDUSAPIToken!,
      appContext.user!.healthCenterCode,
      services[0]!.code
    );

    const appointments = await AppointmentService.getAvailableAppointments(
      appContext.EDUSAPIToken!,
      appContext.user!.userId,
      services[0]!.code,
      specialties[0]!.code,
      specialties[0]!.specialtyServiceCode,
      date.toLocaleString("es-ES").substring(0, 10)
    );

    setData({
      services,
      specialties,
      appointments,
    });
  }

  useEffect(() => {
    if (!appContext.user) {
      router.push("/login");
      return;
    }

    fetchInitialData();
  }, []);

  // useEffect(() => {
  //   if (selectedService === undefined) return;
  //   getSpecialties();
  // }, [selectedService]);

  // useEffect(() => {
  //   if (selectedSpecialty === undefined) return;
  //   getAppointments();
  // }, [selectedSpecialty, date]);

  const bookAppointment = async (appointment: Appointment) => {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment,
      }),
    });

    if (response.status !== 200) {
      toast({
        status: "error",
        title: "Ocurrio un error al asignar la cita",
        position: "top",
      });
      return;
    }

    toast({
      status: "success",
      title: "La cita ha sido asignada correctamente",
    });
  };

  if (appContext.user === null || data === null) {
    return <Spinner />;
  }

  return (
    <main className="h-full">
      <Flex className="h-full flex-1 flex-col items-center justify-between">
        <header className="w-full py-5 shadow">
          <img className="mx-auto max-w-[100px]" src="/orca.svg" />
        </header>

        <Stack className="w-full max-w-[1000px] overflow-auto p-4">
          <AppointmentConfirmationModal
            modalDisclosure={modalDisclosure}
            appointment={() => {}}
            bookAppointment={bookAppointment}
          />
          <FormControl>
            <FormLabel>Servicio</FormLabel>
            <Select
              onChange={(e) => {
                setSelectedService(parseInt(e.target.value));
              }}
            >
              {data.services.map((s, idx) => (
                <option key={idx} value={s.code}>
                  {s.description}
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
              {data.specialties.map((s, idx) => (
                <option key={idx} value={JSON.stringify(s)}>
                  {s.description}
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
              {data.appointments.length === 0 ? (
                <TableCaption>No hay cupos disponibles</TableCaption>
              ) : (
                <Tbody>
                  {data.appointments.map((a) => {
                    return (
                      <Tr
                        onClick={() => {
                          //setSelectedAppointment(a);
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
