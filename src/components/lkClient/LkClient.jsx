import React, {useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import classes from './LkClient.module.scss'
import './Form.css'
import { useDispatch, useSelector } from 'react-redux';
import { sync } from '../../store/asyncAction/auth';


const LkClient = ({onClick, firstName, secondName, login, companyName}) => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

const formik = useFormik({
  initialValues: {
      firstName: firstName || '',
      secondName: secondName || '',
      login: login || '',
      companyName: companyName || '',
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
          errors.login = 'Вам необходимо согласиться с условиями и положениями.';
      }

      if (!data.companyName) {
        errors.companyName = 'Это поле обязательно.';
      }

      return errors;
  },
  onSubmit: (data) => {
      setFormData(data);
      const newData = {
        id: user.id,
        second_name: data.secondName,
        first_name: data.firstName,
        login: data.login,
        company_name: data.companyName
      }
      onClick(newData)
      // formik.resetForm();
  }
});

const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
const getFormErrorMessage = (name) => {
  return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
};

  return (
    <div className={classes.container}>
      <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="firstName" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('firstName') })} />
                                <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid('firstName') })}>Имя</label>
                            </span>
                            {getFormErrorMessage('firstName')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="secondName" name="secondName" value={formik.values.secondName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('secondName') })} />
                                <label htmlFor="secondName" className={classNames({ 'p-error': isFormFieldValid('secondName') })}>Фамилия</label>
                            </span>
                            {getFormErrorMessage('secondName')}
                        </div>

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="login" name="login" value={formik.values.login} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('login') })} />
                                <label htmlFor="login" className={classNames({ 'p-error': isFormFieldValid('login') })}>Логин</label>
                            </span>
                            {getFormErrorMessage('login')}
                        </div>

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="companyName" name="companyName" value={formik.values.companyName} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('companyName') })} />
                                <label htmlFor="companyName" className={classNames({ 'p-error': isFormFieldValid('companyName') })}>Название компании</label>
                            </span>
                            {getFormErrorMessage('companyName')}
                        </div>

                        <Button type="submit" label="Сохранить" className="mt-2" />
                        <Button style={{marginTop: "20px"}} label='Выйти' onClick={(e)=> {
                            localStorage.removeItem('token')
                            dispatch(sync())
                        }}/>
                    </form>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default LkClient