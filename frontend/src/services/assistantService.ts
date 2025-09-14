import { api } from "../utils/api";
import { Assistant, CreateAssistantDto } from "../types";

export const assistantService = {
	async getAssistants(): Promise<Assistant[]> {
		const response = await api.get("/assistants");
		return response.data;
	},

	async getAssistant(id: number): Promise<Assistant> {
		const response = await api.get(`/assistants/${id}`);
		return response.data;
	},

	async createAssistant(data: CreateAssistantDto): Promise<Assistant> {
		const response = await api.post("/assistants", data);
		return response.data;
	},

	async deleteAssistant(id: number): Promise<void> {
		await api.delete(`/assistants/${id}`);
	},
};
