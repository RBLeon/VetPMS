import React, { useState } from "react";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { MedicalRecord, MedicalRecordStatus } from "@/lib/api/types";
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
import { ErrorBoundary } from "@/features/error-boundary/components/ErrorBoundary";
import type { Key } from "antd/es/table/interface";

interface MedicalRecordsListProps {
  patientId: string;
}

interface FormValues {
  date: dayjs.Dayjs;
  followUpDate: dayjs.Dayjs;
  diagnosis: string;
  treatment: string;
  status: MedicalRecordStatus;
  notes: string;
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  patientId,
}) => {
  const {
    data: records = [],
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
      const newRecord: Omit<MedicalRecord, "id"> = {
        type: "CONSULTATION",
        date: values.date.format("YYYY-MM-DD"),
        followUpDate: values.followUpDate.format("YYYY-MM-DD"),
        notes: values.notes || "",
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        status: values.status,
        patientId,
        patientName: "", // Will be filled by the backend
        veterinarianId: "1", // TODO: Get from auth context
        veterinarianName: "", // Will be filled by the backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        treatments: [],
        prescriptions: [],
        attachments: [],
        chiefComplaint: "",
      };
      await addMedicalRecord(newRecord);
      setIsAddModalVisible(false);
      form.resetFields();
      message.success("Medisch record toegevoegd");
    } catch (error) {
      message.error("Fout bij het toevoegen van medisch record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (values: FormValues) => {
    if (!selectedRecord) return;

    try {
      setIsSubmitting(true);
      const updatedRecord: MedicalRecord = {
        ...selectedRecord,
        date: values.date.format("YYYY-MM-DD"),
        followUpDate: values.followUpDate.format("YYYY-MM-DD"),
        notes: values.notes || "",
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        status: values.status,
        updatedAt: new Date().toISOString(),
      };
      await updateMedicalRecord(updatedRecord);
      setIsEditModalVisible(false);
      editForm.resetFields();
      message.success("Medisch record bijgewerkt");
    } catch (error) {
      message.error("Fout bij het bijwerken van medisch record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      await deleteMedicalRecord(id);
      message.success("Medisch record verwijderd");
    } catch (error) {
      message.error("Fout bij het verwijderen van medisch record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFollowUpDate = (_: unknown, value: dayjs.Dayjs) => {
    const recordDate = form.getFieldValue("date");
    if (value && recordDate && value.isBefore(recordDate)) {
      return Promise.reject("Vervolgdatum moet na de recorddatum zijn");
    }
    return Promise.resolve();
  };

  const validateEditFollowUpDate = (_: unknown, value: dayjs.Dayjs) => {
    const recordDate = editForm.getFieldValue("date");
    if (value && recordDate && value.isBefore(recordDate)) {
      return Promise.reject("Vervolgdatum moet na de recorddatum zijn");
    }
    return Promise.resolve();
  };

  const filteredRecords = records?.filter((record: MedicalRecord) => {
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
      title: "Datum",
      dataIndex: "date",
      key: "date",
      sorter: (a: MedicalRecord, b: MedicalRecord) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Diagnose",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Behandeling",
      dataIndex: "treatment",
      key: "treatment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Actief", value: "ACTIEF" },
        { text: "Opgelost", value: "OPGELOST" },
        { text: "In afwachting", value: "IN_AFWACHTING" },
        { text: "Geannuleerd", value: "GEANNULEERD" },
      ],
      onFilter: (value: boolean | Key, record: MedicalRecord) =>
        record.status === value.toString(),
    },
    {
      title: "Vervolgdatum",
      dataIndex: "followUpDate",
      key: "followUpDate",
    },
    {
      title: "Acties",
      key: "actions",
      render: (_: unknown, record: MedicalRecord) => (
        <>
          <Tooltip title="Medisch record bewerken">
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
              aria-label="Medisch record bewerken"
            />
          </Tooltip>
          <Tooltip title="Medisch record verwijderen">
            <Popconfirm
              title="Medisch Record Verwijderen"
              description="Weet u zeker dat u dit medisch record wilt verwijderen?"
              onConfirm={() => handleDelete(record.id)}
              okText="Ja"
              cancelText="Nee"
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                aria-label="Medisch record verwijderen"
              />
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
    return (
      <div>
        Fout: {error instanceof Error ? error.message : "Onbekende fout"}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Tooltip title="Nieuw medisch record toevoegen">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            style={{ marginRight: 16 }}
          >
            Nieuw Medisch Record
          </Button>
        </Tooltip>
        <Tooltip title="Records filteren op datum">
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
        <Tooltip title="Records filteren op status">
          <Select
            placeholder="Filter op status"
            allowClear
            style={{ width: 200 }}
            onChange={(value: string | null) => setStatusFilter(value)}
          >
            <Select.Option value="ACTIEF">Actief</Select.Option>
            <Select.Option value="OPGELOST">Opgelost</Select.Option>
            <Select.Option value="IN_AFWACHTING">In afwachting</Select.Option>
            <Select.Option value="GEANNULEERD">Geannuleerd</Select.Option>
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
        title="Nieuw Medisch Record"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            label="Datum"
            name="date"
            rules={[{ required: true, message: "Datum is verplicht" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Vervolgdatum"
            name="followUpDate"
            rules={[
              { required: true, message: "Vervolgdatum is verplicht" },
              { validator: validateFollowUpDate },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Diagnose"
            name="diagnosis"
            rules={[{ required: true, message: "Diagnose is verplicht" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Behandeling"
            name="treatment"
            rules={[{ required: true, message: "Behandeling is verplicht" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notities">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is verplicht" }]}
          >
            <Select>
              <Select.Option value="ACTIEF">Actief</Select.Option>
              <Select.Option value="OPGELOST">Opgelost</Select.Option>
              <Select.Option value="IN_AFWACHTING">In afwachting</Select.Option>
              <Select.Option value="GEANNULEERD">Geannuleerd</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Record Toevoegen
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Medisch Dossier Bewerken"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item
            label="Datum"
            name="date"
            rules={[{ required: true, message: "Datum is verplicht" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Vervolgdatum"
            name="followUpDate"
            rules={[
              { required: true, message: "Vervolgdatum is verplicht" },
              { validator: validateEditFollowUpDate },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Diagnose"
            name="diagnosis"
            rules={[{ required: true, message: "Diagnose is verplicht" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Behandeling"
            name="treatment"
            rules={[{ required: true, message: "Behandeling is verplicht" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notities">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is verplicht" }]}
          >
            <Select>
              <Select.Option value="ACTIEF">Actief</Select.Option>
              <Select.Option value="OPGELOST">Opgelost</Select.Option>
              <Select.Option value="IN_AFWACHTING">In afwachting</Select.Option>
              <Select.Option value="GEANNULEERD">Geannuleerd</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Record Bijwerken
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
