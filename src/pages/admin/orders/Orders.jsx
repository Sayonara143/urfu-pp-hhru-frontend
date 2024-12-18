import classes from './Orders.module.scss'
import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { AdminAPI } from '../../../services/adminService';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [statutes, setStatutes] = useState([])
  const [currentStatus, setCurrentStatus] = useState([])
  const [currentOrder, setCurrentOrder] = useState()
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onHide = () => {
    setVisible(false);
  }

  useEffect(() => {
    AdminAPI.order.list()
      .then((res) => {
        setOrders(res.data.response)
      })
  }, [isLoading])
  useEffect(() => {
    AdminAPI.status.list()
      .then((res) => {
        setStatutes(res.data.response)
      })
  }, [])
  useEffect(()=> {
    orders?.forEach((item)=>{
      if (item.id === currentOrder) {
        setCurrentStatus(item.satus_id)
      }
    })
  }, [currentOrder, orders])

  const editStatus = () => {
    setIsLoading(true)
    let data = {
      status_id: currentStatus
    }
    AdminAPI.order.edit(currentOrder,data)
      .then((res) => {
        toast.success(`Статус изменен`)
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const header = (
    <h3>Изменить статус</h3>
  )
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.wrapper_header}>
          Заказы
          <div style={{ marginRight: 0, marginBottom: "0px" }}>
            <Button label="Изменить статус" onClick={(e) => setVisible(true)} icon="pi pi-fw pi-pencil" />
          </div>
        </div>

        <div className={classes.wrapper_block}>
          <div className={classes.block}>
            <div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              </div>
              <DataTable value={orders} responsiveLayout="scroll">
                <Column field="id" header="ID"></Column>
                <Column field="product.name" header="Товар"></Column>
                <Column field="quantity" header="Кол-во"></Column>
                <Column  field="product.price" header="Цена за 1 шт"></Column>
                <Column field="status.name" header="Статус"></Column>
                <Column field="order_development.id" header="Заявка на изготовление"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <Dialog header={header} visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHide}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
        <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Заказ: <Dropdown  value={currentOrder} optionLabel="id" optionValue="id" filter filterBy='id' options={orders} onChange={(e) => setCurrentOrder(e.value)}/></div>
        <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Статус: <Dropdown  value={currentStatus} optionLabel="name" optionValue="id" options={statutes} onChange={(e) => setCurrentStatus(e.value)}/></div>
          <Button style={{ 'marginTop': '20px' }} label="Изменить статус" loading={isLoading} onClick={editStatus} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>
    </div>
  )
}

export default Orders