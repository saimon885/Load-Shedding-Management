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
