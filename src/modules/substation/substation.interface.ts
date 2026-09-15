export interface createSubstations {
	name: string;
	code: string;
	location: string;
	zoneId: string;
}

export interface substationQuery {
	searchTerm?: string;
	location?: string;
	page?: string;
	limit?: string;
	status?: string;
	zoneId?: string;
}
