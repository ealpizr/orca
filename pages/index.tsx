import {
  Flex,
  FormControl,
  FormLabel,
  Image,
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

  const [services, setServices] = useState<Service[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedService, setSelectedService] = useState<Service>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
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

    fetchSpecialties();
  }, [selectedService]);

  useEffect(() => {
    if (!selectedSpecialty) return;

    fetchAvailableAppointments();
  }, [selectedSpecialty, date]);

  async function fetchServices() {
    try {
      setLoading(true);
      const services = await DataService.getServices(
        appContext.user!.healthCenterCode,
      );

      setServices(services);
      setSelectedService(services[0]);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Error",
        description: (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailableAppointments() {
    try {
      setLoading(true);
      const appointments = await AppointmentService.getAvailableAppointments(
        appContext.user!.identification,
        selectedService!.code,
        selectedSpecialty!.code,
        selectedSpecialty!.specialtyServiceCode,
        date.toLocaleDateString("es-CR"),
      );

      setAppointments(appointments);
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Error",
        description: (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchSpecialties() {
    try {
      setLoading(true);
      const specialties = await DataService.getSpecialties(
        appContext.user!.healthCenterCode,
        selectedService!.code,
      );

      setSpecialties(specialties);
      setSelectedSpecialty(specialties[0]);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Error",
        description: (e as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function bookAppointment() {
    try {
      await AppointmentService.bookAppointment(
        appContext.user!.identification,
        appContext.user!.user,
        selectedSpecialty!.specialtyServiceCode,
        date.toLocaleDateString("es-CR"),
        selectedAppointment!,
      );
      toast({
        status: "success",
        title: "La cita ha sido asignada correctamente",
      });
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Error",
        description: (e as Error).message,
      });
    }
  }

  if (appContext.user === null || loading) {
    return <Spinner />;
  }

  return (
    <main className="h-full">
      <Flex className="h-full flex-1 flex-col items-center justify-between">
        <header className="w-full py-5 shadow">
          <Image className="mx-auto max-w-[100px]" src="/orca.svg" />
        </header>

        <Stack className="w-full max-w-[1000px] overflow-auto p-4">
          <AppointmentConfirmationModal
            setAppointment={setSelectedAppointment}
            appointment={selectedAppointment}
            bookAppointment={bookAppointment}
          />
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
                        onClick={() => {
                          setSelectedAppointment(a);
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
