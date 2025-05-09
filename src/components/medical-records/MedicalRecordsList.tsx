import React, { useState } from "react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { MedicalRecord } from "@/types/medical";
import {
  Button,
  Table,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Spin,
  Input,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import type { Key } from "antd/es/table/interface";

interface MedicalRecordsListProps {
  patientId: string;
}

interface FormValues {
  date: dayjs.Dayjs;
  followUpDate: dayjs.Dayjs;
  diagnosis: string;
  treatment: string;
  status: "active" | "resolved" | "pending";
  notes: string;
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  patientId,
}) => {
  const {
    medicalRecords,
    isLoading,
    error,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
  } = useMedicalRecords(patientId);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [form] = Form.useForm<FormValues>();
  const [editForm] = Form.useForm<FormValues>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await addMedicalRecord({
        ...values,
        patientId,
        veterinarianId: "1", // TODO: Get from auth context
        date: values.date.format("YYYY-MM-DD"),
        followUpDate: values.followUpDate.format("YYYY-MM-DD"),
        notes: values.notes || "",
      });
      setIsAddModalVisible(false);
      form.resetFields();
      message.success("Medical record added successfully");
    } catch (error) {
      message.error("Failed to add medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (values: FormValues) => {
    if (!selectedRecord) return;

    try {
      setIsSubmitting(true);
      await updateMedicalRecord({
        ...selectedRecord,
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        followUpDate: values.followUpDate.format("YYYY-MM-DD"),
        notes: values.notes || "",
      });
      setIsEditModalVisible(false);
      editForm.resetFields();
      message.success("Medical record updated successfully");
    } catch (error) {
      message.error("Failed to update medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      await deleteMedicalRecord(id);
      message.success("Medical record deleted successfully");
    } catch (error) {
      message.error("Failed to delete medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFollowUpDate = (_: unknown, value: dayjs.Dayjs) => {
    const recordDate = form.getFieldValue("date");
    if (value && recordDate && value.isBefore(recordDate)) {
      return Promise.reject("Follow-up date must be after the record date");
    }
    return Promise.resolve();
  };

  const validateEditFollowUpDate = (_: unknown, value: dayjs.Dayjs) => {
    const recordDate = editForm.getFieldValue("date");
    if (value && recordDate && value.isBefore(recordDate)) {
      return Promise.reject("Follow-up date must be after the record date");
    }
    return Promise.resolve();
  };

  const filteredRecords = medicalRecords.filter((record) => {
    if (dateRange) {
      const recordDate = dayjs(record.date);
      if (
        recordDate.isBefore(dayjs(dateRange[0])) ||
        recordDate.isAfter(dayjs(dateRange[1]))
      ) {
        return false;
      }
    }
    if (statusFilter && record.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: MedicalRecord, b: MedicalRecord) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Treatment",
      dataIndex: "treatment",
      key: "treatment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Resolved", value: "resolved" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value: boolean | Key, record: MedicalRecord) =>
        record.status === value.toString(),
    },
    {
      title: "Follow-up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: MedicalRecord) => (
        <>
          <Tooltip title="Edit medical record">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                editForm.setFieldsValue({
                  ...record,
                  date: dayjs(record.date),
                  followUpDate: dayjs(record.followUpDate),
                });
                setIsEditModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete medical record">
            <Popconfirm
              title="Delete Medical Record"
              description="Are you sure you want to delete this medical record?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Tooltip title="Add a new medical record">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            style={{ marginRight: 16 }}
          >
            Add Medical Record
          </Button>
        </Tooltip>
        <Tooltip title="Filter records by date range">
          <DatePicker.RangePicker
            onChange={(dates) => {
              if (dates) {
                setDateRange([
                  dates[0]?.format("YYYY-MM-DD") || "",
                  dates[1]?.format("YYYY-MM-DD") || "",
                ]);
              } else {
                setDateRange(null);
              }
            }}
            style={{ marginRight: 16 }}
          />
        </Tooltip>
        <Tooltip title="Filter records by status">
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 200 }}
            onChange={(value: string | null) => setStatusFilter(value)}
          >
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="resolved">Resolved</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
        </Tooltip>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRecords}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add Medical Record"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="followUpDate"
            label="Follow-up Date"
            rules={[
              { required: true, message: "Please select a follow-up date" },
              { validator: validateFollowUpDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="diagnosis"
            label="Diagnosis"
            rules={[{ required: true, message: "Please enter a diagnosis" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="treatment"
            label="Treatment"
            rules={[{ required: true, message: "Please enter a treatment" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Add Record
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Medical Record"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="followUpDate"
            label="Follow-up Date"
            rules={[
              { required: true, message: "Please select a follow-up date" },
              { validator: validateEditFollowUpDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="diagnosis"
            label="Diagnosis"
            rules={[{ required: true, message: "Please enter a diagnosis" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="treatment"
            label="Treatment"
            rules={[{ required: true, message: "Please enter a treatment" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Update Record
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export const MedicalRecordsListWithErrorBoundary: React.FC<
  MedicalRecordsListProps
> = (props) => {
  return (
    <ErrorBoundary>
      <MedicalRecordsList {...props} />
    </ErrorBoundary>
  );
};
