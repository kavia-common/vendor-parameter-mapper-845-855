import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock API client modules used by hooks/pages
jest.mock('./api/client', () => ({
  api: {
    listVendors: jest.fn().mockResolvedValue([{ id: 'v1', name: 'Acme' }]),
    createVendor: jest.fn(),
    deleteVendor: jest.fn(),
    listVendorParameters: jest.fn().mockResolvedValue([]),
    listStandardParameters: jest.fn().mockResolvedValue([]),
    listMappings: jest.fn().mockResolvedValue([]),
    createMapping: jest.fn(),
    updateMapping: jest.fn(),
    deleteMapping: jest.fn(),
    listAuditLogs: jest.fn().mockResolvedValue([]),
  }
}));

test('renders Vendors on /vendors route', async () => {
  render(
    <MemoryRouter initialEntries={['/vendors']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Vendors/i)).toBeInTheDocument();
});

test('renders Mappings on /vendors/:id/mappings route', async () => {
  render(
    <MemoryRouter initialEntries={['/vendors/v1/mappings']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Mappings/i)).toBeInTheDocument();
});

test('renders Audit Log on /audit route', async () => {
  render(
    <MemoryRouter initialEntries={['/audit']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Audit Log/i)).toBeInTheDocument();
});
