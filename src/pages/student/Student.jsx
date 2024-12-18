import React, { useEffect, useState } from 'react'
import classes from './Client.module.scss'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ClientAPI } from '../../services/clientService';
import { TabMenu } from 'primereact/tabmenu';
import LkClient from '../../components/lkClient/LkClient';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { sync } from '../../store/asyncAction/auth';

const Client = () => {
  const items = [
    { label: 'Вакансии', icon: 'pi pi-fw pi-box' },
    { label: 'Мои отклики', icon: 'pi pi-fw pi-credit-card' }
  ];
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState();
  const [currentProductPrice, setCurrentProductPrice] = useState();
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleOrder, setVisibleOrder] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)
  const onHide = () => {
    setVisible(false);
  }
  const onHideOrder = () => {
    setVisibleOrder(false);
  }
  useEffect(()=> {
    products?.forEach((item)=>{
      if (item.id === currentProduct) {
        setCurrentProductPrice(item.price)
      }
    })
  }, [currentProduct, products])
  useEffect(() => {
    ClientAPI.getListProduct()
      .then((res) => {
        setProducts(res.data.response)
      })
  }, [activeIndex, isLoadingOrder])
  useEffect(() => {
    ClientAPI.getListOrder(user.id)
      .then((res) => {
        setOrders(res.data.response)
      })
  }, [activeIndex])
  const changeClient = (data) => {
    ClientAPI.changeClient(data.id, data)
      .then((res)=>{
        dispatch(sync())
        toast.success("Успешно")
      })
      .catch(()=>{
        toast.error('Не получилось обновить данные')
        console.clear()
      })
      .finally(()=>{
        //setIsLoading(false)
      })
  }

  const createOrder = () => {
    setIsLoadingOrder(true)
    const data = {
      product_id: currentProduct,
      quantity
    }
    ClientAPI.createOrder(data)
      .then((res)=>{
        toast.success('Заказ успешно создан')
        setCurrentProductPrice(0)
        setQuantity(0)
        setCurrentProduct('')
      })
      .catch(()=>{
        toast.error('Не получилось создать заказ')
        console.clear()
      })
      .finally(()=>{
        setIsLoadingOrder(false)
      })

      ClientAPI.getListProduct()
      .then((res) => {
        setProducts(res.data.response)
      })
  }
  const header = (
    <h3>Личный кабинет</h3>
    )
    const headerOrder = (
      <h3>Оформление заказа</h3>
      )
  return (
    <div className={classes.container}>

      <img className={classes.container_img_bg} />
      <div className={classes.wrapper}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
          <div style={{ marginRight: 0, marginBottom: "0px" }}>
            <Button label="Личный кабинет" onClick={(e)=> setVisible(true)} icon="pi pi-fw pi-home"/>
          </div>
        </div>

        {activeIndex === 0 ?
          <>
            <div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              </div>
              <DataTable value={products} responsiveLayout="scroll">
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Товар"></Column>
                <Column field="count" header="Кол-во"></Column>
                <Column field="price" header="Цена за 1 шт"></Column>
              </DataTable>
            </div>
          </> :
          <>
            <div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              </div>
              <DataTable value={orders} responsiveLayout="scroll">
                <Column field="id" header="ID"></Column>
                <Column field="product.name" header="Товар"></Column>
                <Column field="quantity" header="Кол-во"></Column>
                <Column field="product.price" header="Цена за 1 шт"></Column>
                <Column field="status.name" header="Статус"></Column>
              </DataTable>
            </div>
          </>
        }


      </div>
      <Dialog header={header} visible={visible} style={{width: '50vw'}} breakpoints={{'960px': '75vw', '640px': '100vw'}} modal draggable={false} onHide={onHide}>
          <div style={{'marginTop': '20px' }}>
            <LkClient onClick={changeClient} firstName={user.first_name} secondName={user.second_name} login={user.login} companyName={user.company_name} />
          </div>
        </Dialog>
        <Dialog header={headerOrder} visible={visibleOrder} style={{width: '50vw'}} breakpoints={{'960px': '75vw', '640px': '100vw'}} modal draggable={false} onHide={onHideOrder}>
          <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>
            <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Товар: <Dropdown  value={currentProduct} optionLabel="name" optionValue="id" options={products} onChange={(e) => setCurrentProduct(e.value)}/></div>
            <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Цена: <InputText value={currentProductPrice} disabled /></div>
            <div style={{'marginTop': '20px', display: 'flex', flexDirection: "column" }}>Кол-во: <InputNumber value={quantity} onChange={(e)=> setQuantity(e.value)}/></div>
            <Button style={{'marginTop': '20px' }} label="Заказать" loading={isLoadingOrder}  onClick={createOrder} loadingIcon="pi pi-spin pi-sun" />
          </div>
        </Dialog>
    </div>
  )
}

export default Client