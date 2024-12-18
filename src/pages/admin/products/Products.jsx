import React, { useState } from 'react'
import classes from './Products.module.scss'
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { AdminAPI } from '../../../services/adminService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const Products = () => {
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState();
  const [name, setName] = useState("")
  const [count, setCount] = useState(0)
  const [price, setPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false);

  const onHide = () => {
    setVisible(false);
  }
  const onHideEdit = () => {
    setVisibleEdit(false);
  }
  const createProduct = () => {
    setIsLoading(true)
    let data = {
      count,
      price,
      name
    }
    AdminAPI.product.create(data)
      .then((res) => {
        toast.success(`Товар добавлен`)
        setName("")
        setPrice(0)
        setCount(0)
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const editProduct = () => {
    setIsLoading(true)
    let data = {
      count,
      price,
      name
    }
    AdminAPI.product.edit(currentProduct,data)
      .then((res) => {
        toast.success(`Товар изменен`)
        setName("")
        setPrice(0)
        setCount(0)
      })
      .catch(() => {
        toast.error(`Произошла ошибка`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const header = (
    <h3>Добавить товар</h3>
  )
  const headerEdit = (
    <h3>Редактирование товара</h3>
  )
  useEffect(() => {
    AdminAPI.product.list()
      .then(res => setProducts(res.data.response))
      .catch(err => toast.error(`Произошла ошибка при загрузки  товаров`))
  }, [isLoading])
  useEffect(()=> {
    products?.forEach((item)=>{
      if (item.id === currentProduct) {
        setName(item.name)
        setPrice(item.price)
        setCount(item.count)
      }
    })
  }, [currentProduct, products])
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.wrapper_header}>
          Товары
          <div style={{ marginRight: 0, marginBottom: "0px" }}>
            <Button label="Добавить товар" onClick={(e) => setVisible(true)} icon="pi pi-fw pi-plus" />
            <Button style={{ marginLeft: "20px", marginBottom: "0px" }} label="Редактировать товар" onClick={(e) => setVisibleEdit(true)} icon="pi pi-fw pi-pencil" />
          </div>
        </div>

        <div className={classes.wrapper_block}>
          <div className={classes.block}>
            <DataTable value={products} responsiveLayout="scroll">
              <Column field="id" header="ID"></Column>
              <Column field="name" header="Название"></Column>
              <Column field="count" header="количевство"></Column>
              <Column field="price" header="цена за 1 шт"></Column>

            </DataTable>
          </div>
        </div>
      </div>
      <Dialog header={header} visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHide}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Название: <InputText value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Количевство: <InputNumber value={count} onChange={(e) => setCount(e.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Цена(1 ед): <InputNumber value={price} onChange={(e) => setPrice(e.value)} /></div>
          <Button style={{ 'marginTop': '20px' }} label="Добавить товар" loading={isLoading} onClick={createProduct} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>

      <Dialog header={headerEdit}Edit visible={visibleEdit} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '640px': '100vw' }} modal draggable={false} onHide={onHideEdit}>
        <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
        <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Товар: <Dropdown  value={currentProduct} optionLabel="name" optionValue="id" options={products} onChange={(e) => setCurrentProduct(e.value)}/></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Название: <InputText value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Количевство: <InputNumber value={count} onChange={(e) => setCount(e.value)} /></div>
          <div style={{ 'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Цена(1 ед): <InputNumber value={price} onChange={(e) => setPrice(e.value)} /></div>
          <Button style={{ 'marginTop': '20px' }} label="Изменить товар" loading={isLoading} onClick={editProduct} loadingIcon="pi pi-spin pi-sun" />
        </div>
      </Dialog>
    </div>
  )
}

export default Products