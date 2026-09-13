import { ZoneWhereInput } from "../../generated/prisma/models";

export interface createZonePayload {
  name: string;
  code: string;
  description: string;
}
export interface updateZonePayload {
  zoneId: string;
  name: string;
  code: string;
  description: string;
}

export interface IZonequeryInterface {
  searchTerm?: string;
  status?: string;
  page?: string;
  limit?: string;
}
