import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import type { Coupon } from "../../type/coupon";

export const CouponCreate = () => {
  const { formProps, saveButtonProps } = useForm<Coupon>({
    resource: "coupons",
  });

  return (
    <Create saveButtonProps={saveButtonProps} title="Create Coupon">
      <Form {...formProps} layout="vertical">
        {/* CODE */}
        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: "Code is required" }]}
        >
          <Input />
        </Form.Item>

        {/* TYPE */}
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Type is required" }]}
        >
          <Select
            options={[
              { label: "PERCENT", value: "PERCENT" },
              { label: "FIXED", value: "FIXED" },
            ]}
          />
        </Form.Item>

        {/* VALUE */}
        <Form.Item
          name="value"
          label="Value"
          rules={[{ required: true, message: "Value is required" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* MIN ORDER */}
        <Form.Item name="minOrder" label="Min Order">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* MAX DISCOUNT */}
        <Form.Item name="maxDiscount" label="Max Discount">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* START AT */}
        <Form.Item
          name="startAt"
          label="Start At"
          rules={[{ required: true, message: "Start date is required" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        {/* END AT */}
        <Form.Item
          name="endAt"
          label="End At"
          rules={[{ required: true, message: "End date is required" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        {/* USAGE LIMIT */}
        <Form.Item name="usageLimit" label="Usage Limit">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* PER USER LIMIT */}
        <Form.Item name="perUserLimit" label="Per User Limit">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* STATUS */}
        <Form.Item
          name="status"
          label="Status"
          initialValue="active"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
