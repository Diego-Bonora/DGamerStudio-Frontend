import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ProgressSpinner } from "primereact/progressspinner";
import { Column } from "primereact/column";

import "primeicons/primeicons.css";

import "./TableStyles.css";
import { axiosInstance } from "../api";

export const Table = ({ data, fetchData, loading, handleEdit, setLoading }) => {
  const [tasks, setTasks] = useState([]);

  // This useEffect adds the sections of the table to show if the task is pending or completed
  // as well as adding the buttons to edit and delete the task
  useEffect(() => {
    if (data) {
      const transformedData = data.map((item) => ({
        ...item,
        state: (
          <div className="state-holder">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleCheckboxChange(item.id, item.completed)}
            />
            {item.completed ? (
              <p className="state-completed">Completado</p>
            ) : (
              <p className="state-pending">Pendiente</p>
            )}
          </div>
        ),
        actions: (
          <div className="action-holder">
            <i
              className="pi pi-pencil action-button"
              onClick={() => handleEdit(item)}
            ></i>
            <i
              className="pi pi-trash action-button"
              onClick={confirmDelete(item.id)}
            ></i>
          </div>
        ),
      }));
      setTasks(transformedData);
    }
  }, [data]);

  const handleCheckboxChange = async (id, completed) => {
    const payload = {
      completed: completed === 1 ? 0 : 1,
    };
    setLoading(true);
    try {
      await axiosInstance.put(
        `https://test.gmnlab.com/api/tasks/${id}`,
        payload
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Estas seguro que quieres borrar esta tarea?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
      reject: () => console.log("Deletion cancelled"),
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`https://test.gmnlab.com/api/tasks/${id}`);
      fetchData();
      handleEdit(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="data-table-container">
        <ConfirmPopup />

        <DataTable
          value={tasks}
          paginator
          rows={8}
          className="custom-datatable"
          tableClassName="custom-table"
          emptyMessage="No Hay ninguna tarea creada"
          loading={loading}
          loadingIcon={
            <ProgressSpinner className="custom-table-spinner" strokeWidth="4" />
          }
        >
          <Column
            field="title"
            header="Titulo"
            style={{ width: "30%" }}
            className="column-title"
          ></Column>
          <Column
            field="description"
            header="Descripcion"
            style={{ width: "30%" }}
            className="column-description"
          ></Column>
          <Column
            field="state"
            header="Estado"
            style={{ width: "10%" }}
            className="column-completed"
          ></Column>
          <Column
            field="actions"
            header=""
            style={{ width: "10%" }}
            className="column-actions"
          ></Column>
        </DataTable>
      </div>
    </>
  );
};
