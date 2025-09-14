import React, { useState } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	message,
	Space,
	Popconfirm,
	Tag,
} from "antd";
import { Bot, Edit, Trash2, Link } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Assistant, User } from "../../types";
import { api } from "../../utils/api";

const { Option } = Select;

interface CreateAssistantDto {
	name: string;
	modelType: string;
	vapiId?: string;
	userId?: number;
}

interface UpdateAssistantDto {
	name?: string;
	modelType?: string;
	vapiId?: string;
	userId?: number;
}

const assistantService = {
	getAssistants: async (): Promise<Assistant[]> => {
		const response = await api.get("/admin/assistants");
		return response.data;
	},

	getUsers: async (): Promise<User[]> => {
		const response = await api.get("/admin/users");
		return response.data;
	},

	createAssistant: async (
		assistantData: CreateAssistantDto
	): Promise<Assistant> => {
		const response = await api.post("/admin/assistants", assistantData);
		return response.data;
	},

	updateAssistant: async (
		id: number,
		assistantData: UpdateAssistantDto
	): Promise<Assistant> => {
		const response = await api.put(
			`/admin/assistants/${id}`,
			assistantData
		);
		return response.data;
	},

	deleteAssistant: async (id: number): Promise<void> => {
		await api.delete(`/admin/assistants/${id}`);
	},

	linkAssistantToUser: async (
		assistantId: number,
		userId: number
	): Promise<void> => {
		await api.post(`/admin/assistants/${assistantId}/link`, { userId });
	},
};

const modelTypes = [
	"GPT-4",
	"GPT-4o",
	"GPT-4o-Mini",
	"GPT-4.1",
	"GPT-3.5-turbo",
	"Claude-3",
	"Claude-3-Haiku",
	"Claude-3-Sonnet",
	"Gemini-Pro",
	"Gemini-1.5-Pro",
	"Nova-3-General",
	"GPT-5-Mini",
	"Meta-Llama-4-Scout-17B-16E-Instruct",
	"Other",
];

const AssistantManagement: React.FC = () => {
	const [form] = Form.useForm();
	const [linkForm] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
	const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
		null
	);
	const [linkingAssistant, setLinkingAssistant] = useState<Assistant | null>(
		null
	);
	const queryClient = useQueryClient();

	const { data: assistants, isLoading: assistantsLoading } = useQuery(
		"admin-assistants",
		assistantService.getAssistants
	);
	const { data: users } = useQuery(
		"admin-users-for-linking",
		assistantService.getUsers
	);

	const createAssistantMutation = useMutation(
		assistantService.createAssistant,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("admin-assistants");
				setIsModalVisible(false);
				form.resetFields();
				message.success("Assistant created successfully");
			},
			onError: () => {
				message.error("Failed to create assistant");
			},
		}
	);

	const updateAssistantMutation = useMutation(
		({ id, data }: { id: number; data: UpdateAssistantDto }) =>
			assistantService.updateAssistant(id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("admin-assistants");
				setIsModalVisible(false);
				form.resetFields();
				setEditingAssistant(null);
				message.success("Assistant updated successfully");
			},
			onError: () => {
				message.error("Failed to update assistant");
			},
		}
	);

	const deleteAssistantMutation = useMutation(
		assistantService.deleteAssistant,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("admin-assistants");
				message.success("Assistant deleted successfully");
			},
			onError: () => {
				message.error("Failed to delete assistant");
			},
		}
	);

	const linkAssistantMutation = useMutation(
		({ assistantId, userId }: { assistantId: number; userId: number }) =>
			assistantService.linkAssistantToUser(assistantId, userId),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("admin-assistants");
				setIsLinkModalVisible(false);
				linkForm.resetFields();
				setLinkingAssistant(null);
				message.success("Assistant linked to user successfully");
			},
			onError: () => {
				message.error("Failed to link assistant to user");
			},
		}
	);

	const handleCreateAssistant = () => {
		setEditingAssistant(null);
		setIsModalVisible(true);
		form.resetFields();
	};

	const handleEditAssistant = (assistant: Assistant) => {
		setEditingAssistant(assistant);
		setIsModalVisible(true);
		form.setFieldsValue({
			name: assistant.name,
			modelType: assistant.modelType,
			vapiId: assistant.vapiId,
			userId: assistant.userId,
		});
	};

	const handleLinkAssistant = (assistant: Assistant) => {
		setLinkingAssistant(assistant);
		setIsLinkModalVisible(true);
		linkForm.setFieldsValue({
			userId: assistant.userId,
		});
	};

	const handleDeleteAssistant = (assistantId: number) => {
		deleteAssistantMutation.mutate(assistantId);
	};

	const handleSubmit = (values: any) => {
		if (editingAssistant) {
			updateAssistantMutation.mutate({
				id: editingAssistant.id,
				data: values,
			});
		} else {
			createAssistantMutation.mutate(values);
		}
	};

	const handleLinkSubmit = (values: any) => {
		if (linkingAssistant) {
			linkAssistantMutation.mutate({
				assistantId: linkingAssistant.id,
				userId: values.userId,
			});
		}
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Model Type",
			dataIndex: "modelType",
			key: "modelType",
			render: (modelType: string) => <Tag color="cyan">{modelType}</Tag>,
		},
		{
			title: "VAPI ID",
			dataIndex: "vapiId",
			key: "vapiId",
			render: (vapiId: string) =>
				vapiId ? (
					<div className="text-zinc-300 font-mono text-xs">
						{vapiId.length > 20
							? `${vapiId.substring(0, 20)}...`
							: vapiId}
					</div>
				) : (
					<Tag color="orange">Not Set</Tag>
				),
		},
		{
			title: "Linked User",
			key: "user",
			render: (_: any, record: Assistant) =>
				record.user ? (
					<div>
						<div className="text-white">{record.user.name}</div>
						<div className="text-zinc-400 text-xs">
							{record.user.email}
						</div>
					</div>
				) : (
					<Tag color="orange">Unassigned</Tag>
				),
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (date: string) => new Date(date).toLocaleDateString(),
		},
		{
			title: "Actions",
			key: "actions",
			width: 180,
			render: (_: any, record: Assistant) => (
				<Space size="small">
					<Button
						type="text"
						icon={<Edit className="w-4 h-4" />}
						onClick={() => handleEditAssistant(record)}
						className="text-blue-400 hover:text-blue-300"
						title="Edit Assistant"
					/>
					<Button
						type="text"
						icon={<Link className="w-4 h-4" />}
						onClick={() => handleLinkAssistant(record)}
						className="text-green-400 hover:text-green-300"
						title="Link to User"
					/>
					<Popconfirm
						title="Are you sure you want to delete this assistant?"
						onConfirm={() => handleDeleteAssistant(record.id)}
						okText="Yes"
						cancelText="No"
					>
						<Button
							type="text"
							icon={<Trash2 className="w-4 h-4" />}
							className="text-red-400 hover:text-red-300"
							title="Delete Assistant"
						/>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-white">
						Assistant Management
					</h1>
					<p className="text-zinc-400 mt-1">
						Create and manage assistants, link them to users
					</p>
				</div>
				<Button
					type="primary"
					icon={<Bot className="w-4 h-4" />}
					onClick={handleCreateAssistant}
					className="bg-teal-600 border-teal-600 hover:bg-teal-700"
				>
					Create Assistant
				</Button>
			</div>

			<div className="bg-zinc-900 rounded-lg border border-zinc-800">
				<Table
					columns={columns}
					dataSource={assistants}
					rowKey="id"
					loading={assistantsLoading}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
					}}
					className="custom-table"
				/>
			</div>

			{/* Create/Edit Assistant Modal */}
			<Modal
				title={editingAssistant ? "Edit Assistant" : "Create Assistant"}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingAssistant(null);
					form.resetFields();
				}}
				footer={null}
				className="dark-modal"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="mt-4"
				>
					<Form.Item
						name="name"
						label="Assistant Name"
						rules={[
							{
								required: true,
								message: "Please enter assistant name",
							},
						]}
					>
						<Input placeholder="Enter assistant name" />
					</Form.Item>

					<Form.Item
						name="modelType"
						label="Model Type"
						rules={[
							{
								required: true,
								message: "Please select model type",
							},
						]}
					>
						<Select placeholder="Select model type">
							{modelTypes.map((model) => (
								<Option key={model} value={model}>
									{model}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="vapiId"
						label="VAPI Assistant ID"
						rules={[
							{
								pattern: /^[a-f0-9-]+$/i,
								message:
									"Please enter a valid VAPI ID (alphanumeric with dashes)",
							},
						]}
					>
						<Input
							placeholder="e.g., abcd-efgh-ijkl-mnop-qrstuv"
							className="font-mono"
						/>
					</Form.Item>

					<Form.Item name="userId" label="Link to User (Optional)">
						<Select placeholder="Select user to link" allowClear>
							{users?.map((user) => (
								<Option key={user.id} value={user.id}>
									{user.name} ({user.email})
								</Option>
							))}
						</Select>
					</Form.Item>

					<div className="flex justify-end space-x-2 mt-6">
						<Button
							onClick={() => {
								setIsModalVisible(false);
								setEditingAssistant(null);
								form.resetFields();
							}}
						>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={
								editingAssistant
									? updateAssistantMutation.isLoading
									: createAssistantMutation.isLoading
							}
							className="bg-blue-600 border-blue-600 hover:bg-blue-700"
						>
							{editingAssistant ? "Update" : "Create"}
						</Button>
					</div>
				</Form>
			</Modal>

			{/* Link Assistant Modal */}
			<Modal
				title="Link Assistant to User"
				open={isLinkModalVisible}
				onCancel={() => {
					setIsLinkModalVisible(false);
					setLinkingAssistant(null);
					linkForm.resetFields();
				}}
				footer={null}
				className="dark-modal"
			>
				<div className="mb-4">
					<p className="text-zinc-300">
						Assistant:{" "}
						<span className="text-white font-semibold">
							{linkingAssistant?.name}
						</span>
					</p>
					<p className="text-zinc-400 text-sm">
						Model: {linkingAssistant?.modelType}
					</p>
				</div>

				<Form
					form={linkForm}
					layout="vertical"
					onFinish={handleLinkSubmit}
					className="mt-4"
				>
					<Form.Item
						name="userId"
						label="Select User"
						rules={[
							{ required: true, message: "Please select a user" },
						]}
					>
						<Select placeholder="Select user">
							{users?.map((user) => (
								<Option key={user.id} value={user.id}>
									<div>
										<div>{user.name}</div>
										<div
											style={{
												fontSize: "12px",
												color: "#9CA3AF",
											}}
										>
											{user.email}
										</div>
									</div>
								</Option>
							))}
						</Select>
					</Form.Item>

					<div className="flex justify-end space-x-2 mt-6">
						<Button
							onClick={() => {
								setIsLinkModalVisible(false);
								setLinkingAssistant(null);
								linkForm.resetFields();
							}}
						>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={linkAssistantMutation.isLoading}
							className="bg-green-600 border-green-600 hover:bg-green-700"
						>
							Link Assistant
						</Button>
					</div>
				</Form>
			</Modal>

			<style>
				{`
          .custom-table .ant-table {
            background: transparent;
          }
          
          .custom-table .ant-table-thead > tr > th {
            background: #374151;
            border-bottom: 1px solid #4B5563;
            color: #F9FAFB;
          }
          
          .custom-table .ant-table-tbody > tr > td {
            background: transparent;
            border-bottom: 1px solid #374151;
            color: #F9FAFB;
          }
          
          .custom-table .ant-table-tbody > tr:hover > td {
            background: #1F2937;
          }
          
          .dark-modal .ant-modal-content {
            background: #1F2937;
          }
          
          .dark-modal .ant-modal-header {
            background: #1F2937;
            border-bottom: 1px solid #374151;
          }
          
          .dark-modal .ant-modal-title {
            color: #F9FAFB;
          }
        `}
			</style>
		</div>
	);
};

export default AssistantManagement;
