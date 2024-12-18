import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { Outlet, useNavigate } from "react-router-dom";
//
import { Button } from 'primereact/button';
import { SlideMenu } from 'primereact/slidemenu';
//
import classes from './AdminLayout.module.scss'
import { logout, sync } from "../../store/asyncAction/auth";


export default function AdminLayout() {
  const menu = useRef(null);
  const role = useSelector(state => state?.auth?.role)
  console.log(role)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(sync())
  }, [])
  const [items, setItems] = useState([
    {
      label: 'Товары',
      icon: 'pi pi-fw pi-file',
      command: () => {
        navigate('/admin/products');
      },
      visible: true
    },
    {
      label: 'Заявки на изготовления',
      icon: 'pi pi-fw pi-calendar',
      command: () => {
        navigate('/admin/orders-development');
      },
      visible: true
    },
    {
      label: 'Заказы',
      icon: 'pi pi-fw pi-table',
      command: () => {
        navigate('/admin/orders');
      },
      visible: true
    },
    {
      label: 'Соотрудники',
      icon: 'pi pi-fw pi-user',
      command: () => {
        navigate('/admin/staff');
      },
      visible: false
    },
    {
      label: 'Выйти',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        dispatch(logout())
      },
      visible: true
    }
  ])

  useEffect(() => {
    if (role === 'admin') {
      return
    }
    setItems(prevItems => {
        let updatedItems = [...prevItems];
        updatedItems = updatedItems.filter((item) => item.visible)
        return updatedItems;
    });
}, []); 
  return (
    <>
      <SlideMenu ref={menu} model={items} popup viewportHeight={182}></SlideMenu>
      <div className={classes.container}>
        <div style={{ 'marginTop': '20px', 'marginLeft': '10px' }} className={classes.btnMenu}>
          <Button icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)} className="mr-2" />
        </div>
        <Outlet />
      </div>

    </>
  );
}