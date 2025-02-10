import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, Select, Spin } from "antd";
import { fetchUserById } from "../api/services";

const { Option } = Select;

const UserForm = ({ id, onSave }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserByIdFunc = async (id) => {
    setLoading(true);
    try {
      const data = await fetchUserById(id);
      setUserData(data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserByIdFunc(id);
    } else {
      setUserData(null);
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" />;
  }


  return (
    <Form
      initialValues={id ? userData : {}}
      onFinish={onSave}
      key={id || `new_${Math.floor(Math.random() * 1000000)}`}
      layout="vertical"
    >
      <Form.Item
        label="Ad"
        name="name"
        rules={[
          { required: true, message: "Lütfen adı giriniz!" },
          { min: 3, message: "Ad en az 3 karakter olmalıdır." },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Soyad"
        name="surname"
        rules={[
          { required: true, message: "Lütfen soyadı giriniz!" },
          { min: 3, message: "Soyad en az 3 karakter olmalıdır." },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="E-posta"
        name="email"
        rules={[
          { required: true, message: "Lütfen e-posta adresini giriniz!" },
          { type: "email", message: "Geçerli bir e-posta adresi giriniz." },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Telefon"
        name="phone"
        rules={[{ required: true, message: "Lütfen telefon numarasını giriniz!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Yaş"
        name="age"
        rules={[{ required: true, message: "Lütfen yaşı giriniz!" }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        label="Ülke"
        name="country"
        rules={[
          { required: true, message: "Lütfen ülkeyi giriniz!" },
          { min: 3, message: "Ülke adı en az 3 karakter olmalıdır." },
        ]}
        
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="İlçe"
        name="district"
        rules={[
          { required: true, message: "Lütfen ilçeyi giriniz!" },
          { min: 3, message: "İlçe adı en az 3 karakter olmalıdır." },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Rol"
        name="role"
        rules={[{ required: true, message: "Lütfen rolü seçiniz!" }]}
      >
        <Select placeholder="Bir rol seçiniz">
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>

      {!id && (
      <Form.Item
        label="Şifre"
        name="password"
        rules={[
          { required: true, message: "Lütfen şifreyi giriniz!" },
          { min: 6, message: "Şifre en az 6 karakter olmalıdır." },
        ]}
      >
        <Input.Password />
      </Form.Item>
    )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Güncelle" : "Ekle"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
