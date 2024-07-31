import { AppointmentTime } from "../appoitmentTime/appointmentTime";

export interface ApplyScheduleDto {
    startDate: string;
    endDate: string;
    appointmentTimes: AppointmentTime[];
    applyDays: string[];
}
