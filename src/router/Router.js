import { Routes, Route, Navigate } from "react-router-dom";

import Student from '../pages/student/Student'
import Staff from '../pages/admin/staff/Staff'
import Products from '../pages/admin/products/Products'
import OrdersDevelopment from '../pages/admin/ordersDevelopment/OrdersDevelopment'
import Orders from '../pages/admin/orders/Orders'
import Auth from '../pages/auth/Auth'

import AdminLayout from "../layouts/admin/AdminLayout";
import { useSelector } from "react-redux";
import Register from "../pages/register/Register";
import Main from "../pages/main/Main";


export default function Router() {
  const isAuth = useSelector(state => state?.auth?.isAuth)
  const role = useSelector(state => state?.auth?.role)
  return (
    isAuth && (role === "admin" || role === "employer") ?
      <Routes>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="products" element={<Products/>} />
          <Route path="staff" element={<Staff/>} />
          <Route path="orders-development" element={<OrdersDevelopment/>} />
          <Route path="orders" element={<Orders/>} />
          <Route path="*" element={<Navigate to={"products"} />} />
          <Route path="/admin" element={<Navigate to={"products"} />} />
        </Route>
        <Route path="*" element={<Navigate to={"/admin"} />} />
      </Routes> 
      : 
      (
      isAuth && role === "student"?
      <Routes>
        <Route path="/student" element={<Student/>}/>
        <Route path="*" element={<Navigate to={"/student"} />} /> 
      </Routes>
      :
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register/student" element={<Register />} />
        <Route path="/login" element={<Auth isStaff={false}/>} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    )

  );
}