import React from "react";
import { Table, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const UserTableList = ({
  users,
  loading,
  page,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onRefresh,
}) => {
  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Ad", dataIndex: "name", key: "name" },
    { title: "Soyad", dataIndex: "surname", key: "surname" },
    { title: "Mail", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <Button onClick={() => onEdit(record)}>Düzenle</Button>,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalRecords,
          showSizeChanger: true,
          pageSizeOptions: ["1", "5", "10", "20"],
          onChange: (current, size) => {
            onPageChange(current);
            onPageSizeChange(size);
          },
        }}
      />
      <Button type="default" onClick={onRefresh} style={{ marginTop: 10 }}  icon={<ReloadOutlined />}  >
        Yenile 
      </Button>
    </div>
  );
};

export default UserTableList;
