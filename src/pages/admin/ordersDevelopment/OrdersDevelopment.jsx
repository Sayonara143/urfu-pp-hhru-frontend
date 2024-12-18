import React, { useState } from 'react'
import classes from './OrdersDevelopment.module.scss'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { AdminAPI } from '../../../services/adminService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';

const OrdersDevelopment = () => {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [ordersDevelopment, setOrdersDevelopment] = useState([])
  const [statutes, setStatutes] = useState([])
  const [currentStatus, setCurrentStatus] = useState([])
  const [currentOrderDevelopment, setCurrentOrderDevelopment] = useState()
  const [isLoading, setIsLoading] = useState(false);

  const onHide = () => {
    setVisible(false);
  }
  const editStatus = () => {
    setIsLoading(true)
    let data = {
      status_id: currentStatus
    }
    AdminAPI.orderDevelopment.edit(currentOrderDevelopment,data)
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
  useEffect(() => {
    AdminAPI.status.list()
      .then((res) => {
        setStatutes(res.data.response)
      })
  }, [])
  useEffect(()=> {
    ordersDevelopment?.forEach((item)=>{
      if (item.id === currentOrderDevelopment) {
        setCurrentStatus(item.satus_id)
      }
    })
  }, [currentOrderDevelopment, ordersDevelopment])
  useEffect(() => {
    AdminAPI.orderDevelopment.list()
      .then(res => setOrdersDevelopment(res.data.response))
      .catch(err => toast.error(`Произошла ошибка при загрузки  заявок`))
  }, [isLoading])
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.wrapper_header}>
          Заявки на изготовление
          <div style={{ marginRight: 0, marginBottom: "0px" }}>
            <Button label="Изменить статус" onClick={(e) => setVisible(true)} icon="pi pi-fw pi-pencil" />
          </div>
        </div>

        <div className={classes.wrapper_block}>
          <div className={classes.block}>
            <DataTable value={ordersDevelopment} responsiveLayout="scroll">
              <Column field="id" header="ID"></Column>
              <Column field="order.product.name" header="Товар"></Column>
              <Column field="quantity" header="количевство"></Column>
              <Column field="order.product.price" header="цена за 1 шт"></Column>
              <Column field="status.name" header="Статус"></Column>

            </DataTable>
          </div>
        </div>
      </div>
      <Dialog header={header} visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHide}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
        <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Заявка: <Dropdown  value={currentOrderDevelopment} optionLabel="id" optionValue="id" filter filterBy='id' options={ordersDevelopment} onChange={(e) => setCurrentOrderDevelopment(e.value)}/></div>
        <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Статус: <Dropdown  value={currentStatus} optionLabel="name" optionValue="id" options={statutes} onChange={(e) => setCurrentStatus(e.value)}/></div>
          <Button style={{ 'marginTop': '20px' }} label="Изменить статус" loading={isLoading} onClick={editStatus} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>
    </div>
  )
}

export default OrdersDevelopment