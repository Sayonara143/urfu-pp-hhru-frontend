import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';

import classes from './Register.module.scss'
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthAPI } from '../../services/authService';

const Register = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(state => state.auth.isAuth)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});



    const formik = useFormik({
        initialValues: {
            firstName: '',
            secondName: '',
            login:  '',
            companyName: '',
            password:  ''
        },
        validate: (data) => {
            let errors = {};
      
            if (!data.firstName) {
                errors.firstName = 'Это поле обязательно.';
            }
            if (!data.secondName) {
              errors.secondName = 'Это поле обязательно.';
          }
      
            if (!data.login) {
                errors.login = 'Это поле обязательно.';
            }
      
            if (!data.companyName) {
              errors.companyName = 'Это поле обязательно.';
            }

            if (!data.password) {
                errors.password = 'Это поле обязательно.';
            }
      
            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            registerClient(data)
            
            formik.resetForm();
        }
    });
    const registerClient = (data) => {

        let newData = {
            first_name: data.firstName,
            second_name: data.secondName,
            password: data.password,
            login: data.login,
            company_name: data.companyName
        }
        AuthAPI.register(newData)
            .then((res) => {
                navigate('/login')
              })
              .catch(() => {
                toast.error(`Произошла ошибка`)
              })
    }
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className={classes.container}> 
        <div className="form-auth">
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Регситрация</h5>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                    <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="firstName" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('firstName') })} />
                                <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid('firstName') })}>Имя</label>
                            </span>
                            {getFormErrorMessage('login')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="secondName" name="secondName" value={formik.values.secondName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('secondName') })} />
                                <label htmlFor="secondName" className={classNames({ 'p-error': isFormFieldValid('secondName') })}>Фамилия</label>
                            </span>
                            {getFormErrorMessage('login')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="companyName" name="companyName" value={formik.values.companyName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('companyName') })} />
                                <label htmlFor="companyName" className={classNames({ 'p-error': isFormFieldValid('companyName') })}>Название компании</label>
                            </span>
                            {getFormErrorMessage('login')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="login" name="login" value={formik.values.login} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('login') })} />
                                <label htmlFor="login" className={classNames({ 'p-error': isFormFieldValid('login') })}>login</label>
                            </span>
                            {getFormErrorMessage('login')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Password
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    toggleMask
                                    feedback={false}
                                    className={classNames({ 'p-invalid': isFormFieldValid('password') })} />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Пароль</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button type="submit" label="Зарегистрироваться" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Register