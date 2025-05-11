import React from "react";
import { Form, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";

interface FollowUpFormProps {
  recordDate: string;
  onSchedule: (data: { followUpDate: string; followUpNotes: string }) => void;
  onCancel: () => void;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({
  recordDate,
  onSchedule,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const validateFollowUpDate = (_: unknown, value: dayjs.Dayjs) => {
    const recordDateObj = dayjs(recordDate);
    if (value && value.isBefore(recordDateObj)) {
      return Promise.reject("Vervolgdatum moet na de recorddatum zijn");
    }
    return Promise.resolve();
  };

  const onSubmit = (values: {
    followUpDate: dayjs.Dayjs;
    followUpNotes: string;
  }) => {
    onSchedule({
      followUpDate: values.followUpDate.format("YYYY-MM-DD"),
      followUpNotes: values.followUpNotes || "",
    });
  };

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="followUpDate"
        label="Vervolgdatum"
        rules={[
          { required: true, message: "Selecteer een vervolgdatum" },
          { validator: validateFollowUpDate },
        ]}
        validateStatus={
          form.getFieldError("followUpDate").length ? "error" : ""
        }
        help={form.getFieldError("followUpDate")[0]}
      >
        <DatePicker
          style={{ width: "100%" }}
          minDate={dayjs(recordDate)}
          format="YYYY-MM-DD"
          data-testid="follow-up-date"
        />
      </Form.Item>

      <Form.Item name="followUpNotes" label="Notities">
        <Input.TextArea
          placeholder="Voer eventuele notities in voor de vervolgafspraak"
          rows={4}
          data-testid="follow-up-notes"
        />
      </Form.Item>

      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} data-testid="cancel-button">
          Annuleren
        </Button>
        <Button type="primary" htmlType="submit" data-testid="submit-button">
          Inplannen
        </Button>
      </div>
    </Form>
  );
};
