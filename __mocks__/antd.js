const dayjs = require("dayjs");
const React = require("react");

const MockDatePicker = ({
  value,
  onChange,
  onBlur,
  status,
  error,
  ...props
}) => (
  <>
    <input
      type="date"
      value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
      onChange={(e) => {
        onChange && onChange(dayjs(e.target.value));
      }}
      onBlur={onBlur}
      {...props}
    />
    {error && <div role="alert">{error}</div>}
  </>
);

const MockSelect = ({
  value,
  onChange,
  onBlur,
  children,
  status,
  error,
  ...props
}) => (
  <>
    <select
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={onBlur}
      {...props}
    >
      {children}
    </select>
    {error && <div role="alert">{error}</div>}
  </>
);
MockSelect.Option = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const MockFormItem = ({ children, help, error, ...props }) => (
  <div>
    {children}
    {(help || error) && <div role="alert">{help || error}</div>}
  </div>
);

module.exports = {
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
