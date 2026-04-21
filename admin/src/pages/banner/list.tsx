import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Image, Switch, Tag } from "antd";
import type { Banner } from "../../type/banner";

export const BannerList = () => {
  const { tableProps } = useTable<Banner>({
    resource: "banners",
    syncWithLocation: true,
  });

  return (
    <List title="Banners">
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={70} />

        <Table.Column dataIndex="title" title="Title" />

        <Table.Column dataIndex="position" title="Position" />

        <Table.Column
          dataIndex="imageUrl"
          title="Image"
          width={150}
          render={(value: string | null | undefined) =>
            value ? (
              <Image
                src={value}
                alt="banner"
                width={120}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
                preview={false}
              />
            ) : (
              <Tag>-</Tag>
            )
          }
        />

        <Table.Column
          dataIndex="active"
          title="Active"
          render={(value: boolean) => <Switch checked={value} disabled />}
        />

        {/* Actions */}
        <Table.Column
          title="Actions"
          fixed="right"
          width={150}
          render={(_, record: Banner) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
