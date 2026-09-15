export interface CreateFeeders {
	substationId: string;
	name: string;
	code: string;
	capacity: number;
}
export interface FeedersQuery {
	searchTerm?: string;
	status?: string;
	page?: string;
	limit?: string;
}
