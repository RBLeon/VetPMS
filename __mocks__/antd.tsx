import dayjs from "dayjs";
import React from "react";

interface DatePickerProps {
  value?: dayjs.Dayjs;
  onChange?: (value: dayjs.Dayjs) => void;
  onBlur?: () => void;
  error?: string;
  [key: string]: unknown;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  children?: React.ReactNode;
  error?: string;
  [key: string]: unknown;
}

interface OptionProps {
  value: string;
  children: React.ReactNode;
}

interface FormItemProps {
  children: React.ReactNode;
  help?: string;
  error?: string;
  [key: string]: unknown;
}

const MockDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  onBlur,
  error,
  ...rest
}) => (
  <>
    <input
      type="date"
      value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
      onChange={(e) => {
        if (onChange) onChange(dayjs(e.target.value));
      }}
      onBlur={onBlur}
      {...rest}
    />
    {error && <div role="alert">{error}</div>}
  </>
);

const MockSelect: React.FC<SelectProps> = ({
  value,
  onChange,
  onBlur,
  children,
  error,
  ...rest
}) => (
  <>
    <select
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={onBlur}
      {...rest}
    >
      {children}
    </select>
    {error && <div role="alert">{error}</div>}
  </>
);

MockSelect.Option = ({ value, children }: OptionProps) => (
  <option value={value}>{children}</option>
);

const MockFormItem: React.FC<FormItemProps> = ({ children, help, error }) => (
  <div>
    {children}
    {(help || error) && <div role="alert">{help || error}</div>}
  </div>
);

export default {
  ...(typeof vi !== "undefined" && vi.importActual
    ? vi.importActual("antd")
    : jest.requireActual("antd")),
  DatePicker: MockDatePicker,
  Select: MockSelect,
  Form: {
    ...(typeof vi !== "undefined" && vi.importActual
      ? vi.importActual("antd").Form
      : jest.requireActual("antd").Form),
    Item: MockFormItem,
  },
};
