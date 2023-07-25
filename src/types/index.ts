import { Dispatch, SetStateAction } from "react";

export interface UserData {
  id: number;
  user: string;
  fullName: string;
  healthCenterCode: number;
}

export interface GlobalProps {
  token: string;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}

export interface Appointment {
  TipoPaciente: number;
  fecCupo: string;
  horaCupo: string;
  codHoraCupo: number;
  conCupo: number;
  codSeccion: number;
  tipHoraCupo: number;
  tipHorario: number;
  tipProfesional: number;
  codProfesional: string;
  codConsultorio: number;
  dscConsultorio: string;
  nomProfesional: string;
}

export type Service = {
  code: number;
  description: string;
};

export interface Specialty {
  codeServicioEspecialidad: number;
  codeEspecialidad: number;
  dscEspecialidad: string;
}
