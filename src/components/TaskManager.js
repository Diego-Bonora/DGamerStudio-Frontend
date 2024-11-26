import React, { useEffect, useState } from "react";

import { Table } from "./Table/Table";
import { Form } from "./Form/Form";
import { axiosInstance } from "./api";

export const TaskManager = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editInfo, setEditInfo] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "https://test.gmnlab.com/api/tasks"
      );
      setData(response.data.response);
    } catch (error) {
      setData([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (task) => {
    if (task) {
      setIsEditing(true);
      setEditInfo(task);
    } else {
      setIsEditing(false);
      setEditInfo(null);
    }
  };

  return (
    <div className="Content-container">
      <Table
        data={data}
        fetchData={fetchData}
        loading={loading}
        handleEdit={handleEdit}
        setLoading={setLoading}
      />
      <Form
        fetchData={fetchData}
        handleEdit={handleEdit}
        editInfo={editInfo}
        isEditing={isEditing}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};
