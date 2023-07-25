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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Spinner from "~/components/spinner";
import AppContext from "~/context/app-context";
import AppointmentService from "~/services/appointment-service";
import DataService from "~/services/data-service";
import type { Appointment, Service, Specialty } from "~/types";

const Appointments = () => {
  const { appContext } = useContext(AppContext);

  const router = useRouter();
  const toast = useToast({ position: "top" });

  const [services, setServices] = useState<Service[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedService, setSelectedService] = useState<Service>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>();
  const [date, setDate] = useState<Date>(new Date());

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!appContext.user) {
      router.push("/login");
      return;
    }

    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedService) return;

    console.log({ selectedService });

    fetchSpecialties();
  }, [selectedService]);

  useEffect(() => {
    if (!selectedSpecialty) return;

    setLoading(true);
    fetchAvailableAppointments();
  }, [selectedSpecialty, date]);

  async function fetchServices() {
    const services = await DataService.getServices(
      appContext.EDUSAPIToken!,
      appContext.user!.healthCenterCode
    );

    setServices(services);
    setSelectedService(services[0]);
  }

  async function fetchAvailableAppointments() {
    const appointments = await AppointmentService.getAvailableAppointments(
      appContext.EDUSAPIToken!,
      appContext.user!.userId,
      selectedService!.code,
      selectedSpecialty!.code,
      selectedSpecialty!.specialtyServiceCode,
      date.toLocaleString("es-ES").substring(0, 10)
    );

    setAppointments(appointments);
    setLoading(false);
  }

  async function fetchSpecialties() {
    const specialties = await DataService.getSpecialties(
      appContext.EDUSAPIToken!,
      appContext.user!.healthCenterCode,
      selectedService!.code
    );

    setSpecialties(specialties);
    setSelectedSpecialty(specialties[0]);
  }

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

  if (appContext.user === null || loading) {
    return <Spinner />;
  }

  return (
    <main className="h-full">
      <Flex className="h-full flex-1 flex-col items-center justify-between">
        <header className="w-full py-5 shadow">
          <img className="mx-auto max-w-[100px]" src="/orca.svg" />
        </header>

        <Stack className="w-full max-w-[1000px] overflow-auto p-4">
          {/* <AppointmentConfirmationModal
            modalDisclosure={modalDisclosure}
            appointment={() => {}}
            bookAppointment={bookAppointment}
          /> */}
          <FormControl>
            <FormLabel>Servicio</FormLabel>
            <Select
              onChange={(e) => {
                setSelectedService(JSON.parse(e.target.value));
              }}
              value={JSON.stringify(selectedService)}
            >
              {services.map((s, idx) => (
                <option key={idx} value={JSON.stringify(s)}>
                  {s.description}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Especialidad</FormLabel>
            <Select
              onChange={(e) => setSelectedSpecialty(JSON.parse(e.target.value))}
              value={JSON.stringify(selectedSpecialty)}
            >
              {specialties.map((s, idx) => (
                <option key={idx} value={JSON.stringify(s)}>
                  {s.description}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Fecha</FormLabel>
            <Input
              onChange={(e) => {
                setDate(new Date(e.target.value.replaceAll("-", "/")));
              }}
              value={date.toISOString().substring(0, 10)}
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
              {appointments.length === 0 ? (
                <TableCaption>No hay cupos disponibles</TableCaption>
              ) : (
                <Tbody>
                  {appointments.map((a) => {
                    return (
                      <Tr
                        onClick={() => {}}
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
              className="text-[var(--chakra-colors-linkedin-500)] underline"
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
