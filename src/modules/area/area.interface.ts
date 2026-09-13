export interface CreateArea {
	feederId: string;
	name: string;
	code: string;
	description: string;
}
export interface areaQuery {
	searchTerm?: string;
	feederId?: string;
	page?: string;
	limit?: string;
}
