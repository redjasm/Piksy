import { useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomers } from '../../redux/slices/customer';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CustomerNewEditForm from '../../sections/@dashboard/customer/CustomerNewEditForm';
// firebase


// ----------------------------------------------------------------------

export default function CustomerCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const { customers } = useSelector((state) => state.customers);

  const isEdit = pathname.includes('edit');

  const currentCustomer = customers.find((customer) => paramCase(customer.name) === name);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <Page title="Customer: Create a new customer">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new customer' : 'Edit customer'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Customer', href: PATH_DASHBOARD.customer.list }, 
            { name: !isEdit ? 'New Customer' : capitalCase(name) },
          ]}
        />

        <CustomerNewEditForm isEdit={isEdit} currentCustomer={currentCustomer} />
      </Container>
    </Page>
  );
}
