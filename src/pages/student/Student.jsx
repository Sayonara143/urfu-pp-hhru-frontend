import React, { useEffect, useState } from 'react';
import classes from './Client.module.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ClientAPI } from '../../services/clientService';
import { TabMenu } from 'primereact/tabmenu';
import LkClient from '../../components/lkClient/LkClient';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { sync } from '../../store/asyncAction/auth';

const Client = () => {
  const items = [
    { label: 'Вакансии', icon: 'pi pi-fw pi-box' },
    { label: 'Мои отклики', icon: 'pi pi-fw pi-credit-card' },
  ];
  const [vacancies, setVacancies] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [filterKeywordSearch, setFilterKeywordSearch] = useState('');
  const [globalFilters, setGlobalFilters] = useState({});
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [respondedVacancies, setRespondedVacancies] = useState([]);
  const [loadingVacancy, setLoadingVacancy] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const onHide = () => {
    setVisible(false);
  };
  useEffect(() => {
    initFilters();
}, [])

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const newFilters = { ...globalFilters, global: { value } };
    setGlobalFilters(newFilters);
    setFilterKeywordSearch(value);
  };

  const initFilters = () => {
    setSortField(null); // Сброс поля сортировки
    setSortOrder(null); // Сброс порядка сортировки
    setGlobalFilters({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'employment_type': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'salary_range': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
    setFilterKeywordSearch('');
};

const clearFilters = () => {
    initFilters(); // Сбрасывает фильтры к исходному состоянию
};

  useEffect(() => {
    setLoadingVacancy(true);
    ClientAPI.getListVacancy(filterKeywordSearch)
      .then((res) => {
        setVacancies(res.data.vacancies);
      })
      .catch(() => toast.error('Ошибка загрузки вакансий'))
      .finally(() => setLoadingVacancy(false));
  }, [filterKeywordSearch]);

  const changeClient = (data) => {
    ClientAPI.changeClient(data.id, data)
      .then(() => {
        dispatch(sync());
        toast.success('Успешно');
      })
      .catch(() => {
        toast.error('Не получилось обновить данные');
        console.clear();
      });
  };

  const renderHeaderVacancy = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Сбросить фильтры"
          className="p-button-outlined"
          onClick={clearFilters}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterKeywordSearch}
            onChange={onGlobalFilterChange}
            placeholder="Поиск по ключевым словам"
          />
        </span>
      </div>
    );
  };

  const header = <h3>Личный кабинет</h3>;
  const handleRespond = (vacancyId) => {
    setRespondedVacancies((prev) => [...prev, vacancyId]); // Добавляем отклик на вакансию
    toast.info('Вы откликнулись на вакансию');
  };
  const renderRespondButton = (rowData) => {
    const isResponded = respondedVacancies.includes(rowData.id); // Проверяем, откликнулись ли уже
    return (
      <Button
        label={isResponded ? 'Откликнулись' : 'Откликнуться'}
        disabled={isResponded} // Отключаем кнопку, если уже откликнулись
        onClick={() => handleRespond(rowData.id)}
        className={isResponded ? 'p-button-secondary' : 'p-button-success'} // Серый стиль, если откликнулись
      />
    );
  };

  return (
    <div className={classes.container}>
      <img className={classes.container_img_bg} />
      <div className={classes.wrapper}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
          <div style={{ marginRight: 0, marginBottom: '0px' }}>
            <Button
              label="Личный кабинет"
              onClick={() => setVisible(true)}
              icon="pi pi-fw pi-home"
            />
          </div>
        </div>

        {activeIndex === 0 ? (
          <div>
            <DataTable
              value={vacancies}
              filterDisplay="menu"
              filters={globalFilters}
              paginator
              rows={10}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={(e) => {
                  setSortField(e.sortField);
                  setSortOrder(e.sortOrder);
              }}
              responsiveLayout="stack"
              breakpoint="768px"
              header={renderHeaderVacancy()}
              globalFilterFields={['title', 'employment_type', 'salary_range']}
              emptyMessage="Вакансии не найдены"
              loading={loadingVacancy}
            >
              <Column field="title" header="Название" sortable filter filterPlaceholder="Поиск по названию" />
              <Column field="employment_type" header="Тип работы" sortable filter filterPlaceholder="Тип работы" />
              <Column field="salary_range" header="Оплата" sortable filter filterPlaceholder="Оплата" />
              <Column body={renderRespondButton} />
            </DataTable>
          </div>
        ) : (
          <div>
            <DataTable value={orders} responsiveLayout="scroll">
              <Column field="id" header="ID" />
              <Column field="product.name" header="Товар" />
              <Column field="quantity" header="Кол-во" />
              <Column field="product.price" header="Цена за 1 шт" />
              <Column field="status.name" header="Статус" />
            </DataTable>
          </div>
        )}
      </div>

      <Dialog
        header={header}
        visible={visible}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        modal
        draggable={false}
        onHide={onHide}
      >
        <div style={{ marginTop: '20px' }}>
          <LkClient
            onClick={changeClient}
            firstName={user.first_name}
            secondName={user.second_name}
            login={user.login}
            companyName={user.company_name}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Client;
