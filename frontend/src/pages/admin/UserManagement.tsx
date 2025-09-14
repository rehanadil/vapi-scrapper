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
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { User } from "../../types";
import { api } from "../../utils/api";

const { Option } = Select;

interface CreateUserDto {
	name: string;
	email: string;
	password: string;
	role: string;
}

interface UpdateUserDto {
	name?: string;
	email?: string;
	role?: string;
}

const userService = {
	getUsers: async (): Promise<User[]> => {
		const response = await api.get("/admin/users");
		return response.data;
	},

	createUser: async (userData: CreateUserDto): Promise<User> => {
		const response = await api.post("/admin/users", userData);
		return response.data;
	},

	updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
		const response = await api.put(`/admin/users/${id}`, userData);
		return response.data;
	},

	deleteUser: async (id: number): Promise<void> => {
		await api.delete(`/admin/users/${id}`);
	},
};

const UserManagement: React.FC = () => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const queryClient = useQueryClient();

	const { data: users, isLoading } = useQuery(
		"admin-users",
		userService.getUsers
	);

	const createUserMutation = useMutation(userService.createUser, {
		onSuccess: () => {
			queryClient.invalidateQueries("admin-users");
			setIsModalVisible(false);
			form.resetFields();
			message.success("User created successfully");
		},
		onError: () => {
			message.error("Failed to create user");
		},
	});

	const updateUserMutation = useMutation(
		({ id, data }: { id: number; data: UpdateUserDto }) =>
			userService.updateUser(id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("admin-users");
				setIsModalVisible(false);
				form.resetFields();
				setEditingUser(null);
				message.success("User updated successfully");
			},
			onError: () => {
				message.error("Failed to update user");
			},
		}
	);

	const deleteUserMutation = useMutation(userService.deleteUser, {
		onSuccess: () => {
			queryClient.invalidateQueries("admin-users");
			message.success("User deleted successfully");
		},
		onError: () => {
			message.error("Failed to delete user");
		},
	});

	const handleCreateUser = () => {
		setEditingUser(null);
		setIsModalVisible(true);
		form.resetFields();
	};

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setIsModalVisible(true);
		form.setFieldsValue({
			name: user.name,
			email: user.email,
			role: user.role,
		});
	};

	const handleDeleteUser = (userId: number) => {
		deleteUserMutation.mutate(userId);
	};

	const handleSubmit = (values: any) => {
		if (editingUser) {
			updateUserMutation.mutate({
				id: editingUser.id,
				data: {
					name: values.name,
					email: values.email,
					role: values.role,
				},
			});
		} else {
			createUserMutation.mutate(values);
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
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			render: (role: string) => (
				<Tag color={role === "admin" ? "red" : "blue"}>
					{role.toUpperCase()}
				</Tag>
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
			width: 150,
			render: (_: any, record: User) => (
				<Space size="small">
					<Button
						type="text"
						icon={<Edit className="w-4 h-4" />}
						onClick={() => handleEditUser(record)}
						className="text-blue-400 hover:text-blue-300"
					/>
					<Popconfirm
						title="Are you sure you want to delete this user?"
						onConfirm={() => handleDeleteUser(record.id)}
						okText="Yes"
						cancelText="No"
					>
						<Button
							type="text"
							icon={<Trash2 className="w-4 h-4" />}
							className="text-red-400 hover:text-red-300"
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
						User Management
					</h1>
					<p className="text-zinc-400 mt-1">
						Manage users and their roles
					</p>
				</div>
				<Button
					type="primary"
					icon={<UserPlus className="w-4 h-4" />}
					onClick={handleCreateUser}
					className="bg-teal-600 border-teal-600 hover:bg-teal-700"
				>
					Create User
				</Button>
			</div>

			<div className="bg-zinc-900 rounded-lg border border-zinc-800">
				<Table
					columns={columns}
					dataSource={users}
					rowKey="id"
					loading={isLoading}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
					}}
					className="custom-table"
				/>
			</div>

			<Modal
				title={editingUser ? "Edit User" : "Create User"}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingUser(null);
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
						label="Name"
						rules={[
							{
								required: true,
								message: "Please enter user name",
							},
						]}
					>
						<Input placeholder="Enter user name" />
					</Form.Item>

					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ required: true, message: "Please enter email" },
							{
								type: "email",
								message: "Please enter valid email",
							},
						]}
					>
						<Input placeholder="Enter email address" />
					</Form.Item>

					{!editingUser && (
						<Form.Item
							name="password"
							label="Password"
							rules={[
								{
									required: true,
									message: "Please enter password",
								},
							]}
						>
							<Input.Password placeholder="Enter password" />
						</Form.Item>
					)}

					<Form.Item
						name="role"
						label="Role"
						rules={[
							{ required: true, message: "Please select role" },
						]}
					>
						<Select placeholder="Select user role">
							<Option value="customer">Customer</Option>
							<Option value="admin">Admin</Option>
						</Select>
					</Form.Item>

					<div className="flex justify-end space-x-2 mt-6">
						<Button
							onClick={() => {
								setIsModalVisible(false);
								setEditingUser(null);
								form.resetFields();
							}}
						>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={
								editingUser
									? updateUserMutation.isLoading
									: createUserMutation.isLoading
							}
							className="bg-blue-600 border-blue-600 hover:bg-blue-700"
						>
							{editingUser ? "Update" : "Create"}
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

export default UserManagement;
