import React, { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";

import { axiosInstance } from "../api";
import "./FormStyles.css";

export const Form = ({
  fetchData,
  handleEdit,
  editInfo,
  isEditing,
  loading,
  setLoading,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editInfo) {
      setTitle(editInfo.title);
      setDescription(editInfo.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editInfo]);

  const resetForm = () => {
    handleEdit(null);
    setTitle("");
    setDescription("");
  };

  const CreateTask = async (payload) => {
    setLoading(true);
    try {
      await axiosInstance.post("https://test.gmnlab.com/api/tasks", payload);
      fetchData();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateTask = async (payload, id) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `https://test.gmnlab.com/api/tasks/${id}`,
        payload
      );
      fetchData();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      return setErrorMessage(
        "Se necesita un titulo para crear o editar una tarea"
      );
    }
    setErrorMessage("");

    const payload = {
      title: title,
      description: description,
    };

    if (isEditing) {
      UpdateTask(payload, editInfo.id);
    } else {
      CreateTask(payload);
    }
  };

  return (
    <>
      <div className="form-add-container">
        <form onSubmit={handleSubmit} className="form-add-task">
          <div className="form-title">
            {isEditing ? (
              <div className="editing-title-container">
                <p>Editar tarea</p>
                <button onClick={() => handleEdit(null)}>Cancelar</button>
              </div>
            ) : (
              <p>Agregar Tarea</p>
            )}
          </div>
          {errorMessage && <p className="formError">{errorMessage}</p>}
          <div className="form-input-container">
            <p>Titulo</p>
            <InputText
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-input-container">
            <p>Descripción</p>
            <InputTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              cols={30}
            />
          </div>
          {loading ? (
            <div className="form-spinner-container">
              <ProgressSpinner
                className="custom-form-spinner"
                strokeWidth="4"
              />
            </div>
          ) : (
            <button className="form-submit-button" type="submit">
              {isEditing ? <span>Guardar</span> : <span>Agregar</span>}
            </button>
          )}
        </form>
      </div>
    </>
  );
};
