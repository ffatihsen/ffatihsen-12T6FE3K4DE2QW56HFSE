import React, { useState, useEffect } from "react";
import { Button, Input, Alert } from "antd";
import UserTableList from "./UserTableList";
import CustomModal from "./CustomModal";
import UserForm from "./UserForm";
import { fetchUsers, saveUser, updateUser } from "../api/services";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchUsersData();
  }, [search, page, pageSize]);

  const fetchUsersData = async () => {
    setLoading(true);
    const data = await fetchUsers(search, page, pageSize);
    setUsers(data.users);
    setTotalRecords(data.totalRecords);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSave = async (values) => {
    try {
      let response;
      if (currentUser) {
        response = await updateUser(currentUser.id, values);
      } else {
        response = await saveUser(values);
      }
  
      if (response.ok) {
        setAlertMessage("Başarılı!");
        setAlertType("success");
        setModalVisible(false);
        fetchUsersData();
      } else {
        const data = await response.json();

        const errorMessage = data.message 
        ? data.message + (data.sqlMessage ? ": " + data.sqlMessage : "") 
        : "Hata oluştu!";
        setAlertMessage(errorMessage);
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("Hata oluştu!");
      setAlertType("error");
    }
  };

  return (
    <div style={{padding:20}} >
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          showIcon
          closable
          onClose={() => setAlertMessage(null)}
          style={{ marginBottom: 16 }}
        />
      )}


  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
    <Input.Search
      placeholder="Ara..."
      onChange={handleSearch}
      style={{ width: "200px" }}
    />
    
    <Button type="primary" onClick={() => { setCurrentUser(null); setModalVisible(true); }} style={{width:"10%"}}>
      Yeni
    </Button>
  </div>


      <UserTableList
        users={users}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={(user) => {
          setCurrentUser(user);
          setModalVisible(true);
        }}
        onRefresh={fetchUsersData}
      />

      <CustomModal
        title={currentUser ? "Düzenle" : "Yeni"}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <UserForm
          id={currentUser? currentUser.id : null }
          onSave={handleSave}
        />
      </CustomModal>
    </div>
  );
};

export default UserTable;
