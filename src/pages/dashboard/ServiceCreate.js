import { useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getServices } from '../../redux/slices/service';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import ServiceNewEditForm from '../../sections/@dashboard/service/ServiceNewEditForm';
// firebase


// ----------------------------------------------------------------------

export default function ServiceCreate() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const { services } = useSelector((state) => state.service);

  const isEdit = pathname.includes('edit');

  const currentService = services.find((service) => paramCase(service.name) === name);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  return (
    <Page title="Service: Create a new service">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new service' : 'Edit service'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service', href: PATH_DASHBOARD.service.list },
            { name: !isEdit ? 'New Service' : capitalCase(name) },
          ]}
        />

        <ServiceNewEditForm isEdit={isEdit} currentService={currentService} />
      </Container>
    </Page>
  );
}
