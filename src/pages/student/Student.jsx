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

  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const [filterKeywordSearch, setFilterKeywordSearch] = useState('');
  const [globalFilters, setGlobalFilters] = useState({});
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [respondedVacancies, setRespondedVacancies] = useState([]);
  const [loadingVacancy, setLoadingVacancy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleMoreVac, setVisibleMoreVac] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const onHide = () => {
    setVisible(false);
  };
  useEffect(() => {
    initFilters();
}, [])
const openVacancyDialog = (vacancy) => {
  setSelectedVacancy(vacancy);
  setVisibleMoreVac(true);
};

  const initFilters = () => {
    setSortField(null);
    setSortOrder(null);
    setGlobalFilters({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'employment_type': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'salary_range': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
    setFilterKeywordSearch('');
};

const clearFilters = () => {
    initFilters();
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
              <Column field="title" header="Название" body={(rowData) => (
        <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => openVacancyDialog(rowData)}
        >
            {rowData.title}
        </span>
    )} sortable filter filterPlaceholder="Поиск по названию" />
              <Column field="employment_type" header="Тип работы" sortable filter filterPlaceholder="Тип работы" />
              <Column field="salary_range" header="Оплата" sortable filter filterPlaceholder="Оплата" />
              <Column body={renderRespondButton} />
            </DataTable>
          </div>
        ) : (
          <div>
            <DataTable value={orders} responsiveLayout="stack"
              breakpoint="768px" emptyMessage="Вакансии не найдены">
              <Column field="product.name" header="Название" />
              <Column field="quantity" header="Тип работы" />
              <Column field="product.price" header="Оплата" />
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
            onClick={()=>{}}
            firstName={user.first_name}
            secondName={user.second_name}
            login={user.login}
            companyName={user.company_name}
          />
        </div>
      </Dialog>
      {selectedVacancy && (
    <Dialog
    header={`Вакансия: ${selectedVacancy.title}`}
    visible={visibleMoreVac}
    style={{ width: '50vw' }}
    breakpoints={{ '960px': '75vw', '640px': '100vw' }}
    modal
    draggable={false}
    onHide={() => setVisibleMoreVac(false)}
>
    <div>
        <p><strong>Название:</strong> {selectedVacancy.title}</p>
        <p><strong>Тип работы:</strong> {selectedVacancy.employment_type}</p>
        <p><strong>Описание:</strong> {selectedVacancy.description || 'Описание отсутствует.'}</p>
        <p><strong>Требования:</strong> {selectedVacancy.requirements || 'Не указаны.'}</p>
        <p><strong>Оплата:</strong> {selectedVacancy.salary_range || 'Не указано.'}</p>
        <p><strong>Дата создания:</strong> {new Date(selectedVacancy.created_at).toLocaleDateString()}</p>
        
        {selectedVacancy.employer && (
            <>
                <p><strong>Компания:</strong> {selectedVacancy.employer.company_name || 'Не указано.'}</p>
                <p><strong>Описание компании:</strong> {selectedVacancy.employer.company_description || 'Не указано.'}</p>
                <p><strong>Телефон компании:</strong> {selectedVacancy.employer.phone || 'Не указано.'}</p>
                <p><strong>Сайт компании:</strong> {selectedVacancy.employer.website || 'Не указан.'}</p>
            </>
        )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                    label={respondedVacancies.includes(selectedVacancy.id) ? 'Откликнулись' : 'Откликнуться'}
                    disabled={respondedVacancies.includes(selectedVacancy.id)} // Отключаем кнопку, если уже откликнулись
                    onClick={() => handleRespond(selectedVacancy.id)} // Вызываем функцию отклика
                    className={respondedVacancies.includes(selectedVacancy.id) ? 'p-button-secondary' : 'p-button-success'}
                />
            </div>
    </div>
</Dialog>

)}

    </div>
  );
};

export default Client;
