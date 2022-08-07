import { useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getEmployees } from '../../redux/slices/employee';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
// firebase


// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const { employees } = useSelector((state) => state.employee);

  const isEdit = pathname.includes('edit');

  const currentUser = employees.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <Page title="Employee: Create a new employee">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new employee' : 'Edit employee'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Employee', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New Employee' : capitalCase(name) },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
