import React, { useState } from 'react'
import classes from './Staff.module.scss'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { AdminAPI } from '../../../services/adminService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const Staff = () => {
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [currentStaff, setCurrentStaff] = useState();
  const [firstName, setFirstName] = useState()
  const [secondName, setSecondName] = useState()
  const [login, setLogin] = useState()
  const [password, setPassword] = useState()
  const [role, setRole] = useState("")
  const [loadingCount, setLoadingCount] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onHide = () => {
    setVisible(false);
  }
  const onHideEdit = () => {
    setVisibleEdit(false);
  }
  const onHideDelete = () => {
    setVisibleDelete(false);
  }
  const createStaff = () => {
    setIsLoading(true)
    let data = {
      first_name: firstName,
      second_name: secondName,
      password: password,
      login: login,
      role: role
    }
    AdminAPI.staff.create(data)
      .then((res) => {
        toast.success(`Соотрудник добавлен`)
        setFirstName('')
        setSecondName('')
        setRole('')
        setPassword('')
        setLogin('')
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const editStaff = () => {
    setIsLoading(true)
    let data = {
      first_name: firstName,
      second_name: secondName,
      password: password,
      login: login,
      role: role
    }
    AdminAPI.staff.edit(currentStaff,data)
      .then((res) => {
        toast.success(`Соотрудник изменен`)
        setFirstName('')
        setSecondName('')
        setRole('')
        setPassword('')
        setLogin('')
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })

    setCurrentStaff()
  }
  const deleteStaff = () => {
    setIsLoading(true)

    AdminAPI.staff.delete(currentStaff)
      .then((res) => {
        toast.success(`Соотрудник удален`)
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })

    setCurrentStaff()
  }
  const header = (
    <h3>Новый соотрудник</h3>
  )
  const headerEdit = (
    <h3>Редактровнаие соотрудника</h3>
  )
  const headerDelete = (
    <h3>Удаление соотрудника</h3>
  )
  useEffect(() => {
    AdminAPI.staff.list()
      .then(res => setStaffs(res.data.response))
      .catch(err => toast.error(`Произошла ошибка при загрузки  соотрудников`))
  }, [isLoading])
  useEffect(()=> {
    staffs.forEach((item)=>{
      if (item.id === currentStaff) {
        setFirstName(item.first_name)
        setSecondName(item.second_name)
        setRole(item.role)
        setPassword('')
        setLogin(item.login)
      }
    })
  }, [currentStaff, staffs])
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.wrapper_header}>
          Соотрудники
          <div style={{ marginRight: 0, marginBottom: "0px" }}>
            <Button label="Добавить соотрудника" onClick={(e) => setVisible(true)} icon="pi pi-fw pi-user-plus" />
            <Button style={{ marginLeft: "20px", marginBottom: "0px" }} label="Редактировать соотрудника" onClick={(e) => setVisibleEdit(true)} icon="pi pi-fw pi-user-edit" />
            <Button style={{ marginLeft: "20px", marginBottom: "0px" }} label="Удалить соотрудника" onClick={(e) => setVisibleDelete(true)} icon="pi pi-fw pi-user-minus" />
          </div>
        </div>

        <div className={classes.wrapper_block}>
          <div className={classes.block}>
            <DataTable value={staffs} responsiveLayout="scroll">
              <Column field="id" header="ID"></Column>
              <Column field="login" header="Логин"></Column>
              <Column field="first_name" header="Имя"></Column>
              <Column field="second_name" header="Фамилия"></Column>
              <Column field="role" header="Роль"></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <Dialog header={header} visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHide}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Логин: <InputText value={login} onChange={(e) => setLogin(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Пароль: <InputText value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Имя: <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Фамилия: <InputText value={secondName} onChange={(e) => setSecondName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Роль: <Dropdown value={role} options={[{ label: "manager", value: "manager" }, { label: "admin", value: "admin" }]} onChange={(e) => setRole(e.value)} /></div>
          <Button style={{ 'marginTop': '20px' }} label="Добавить соотрудника" loading={isLoading} onClick={createStaff} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>

      <Dialog header={headerEdit} visible={visibleEdit} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHideEdit}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Соотрудник: <Dropdown value={currentStaff} optionLabel='login' optionValue='id' options={staffs} onChange={(e) => setCurrentStaff(e.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Логин: <InputText value={login} onChange={(e) => setLogin(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Пароль: <InputText value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Имя: <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Фамилия: <InputText value={secondName} onChange={(e) => setSecondName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Роль: <Dropdown value={role} options={[{ label: "manager", value: "manager" }, { label: "admin", value: "admin" }]} onChange={(e) => setRole(e.value)} /></div>
          <Button style={{ 'marginTop': '20px' }} label="Изменить соотрудника" loading={isLoading} onClick={editStaff} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>

      <Dialog header={headerDelete} visible={visibleDelete} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHideDelete}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Соотрудник: <Dropdown value={currentStaff} optionLabel='login' optionValue='id' options={staffs} onChange={(e) => setCurrentStaff(e.value)} /></div>
          <Button style={{ 'marginTop': '20px' }} label="Удалить" loading={isLoading} onClick={deleteStaff} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>
    </div>
  )
}

export default Staff