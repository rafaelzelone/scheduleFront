import { useEffect, useState } from 'react';
import './clients.css';
import { Pagination } from '../../components/page/pagination';
import { clientService } from '../../service/request/clientService';
import type { Cliente } from '../../type/client';
import notLogo from '../../../public/msgNot.svg';
import searchIcon from '../../../public/search-2-line.svg';
import calendarIcon from '../../../public/calendar.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function Clients() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const pageSize = 20;

  const fetchClients = async (pageNumber: number = 1, searchTerm: string = "") => {
    try {
      setLoading(true);
      const response = await clientService.list({
        page: pageNumber,
        pageSize,
        search: searchTerm,
      });

      const { data, pagination } = response.data;
      setClientes(data);
      setPage(pagination?.page || 1);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(page, search);
  }, [page, search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const togglePermission = async (clienteId: string, permission: 'log' | 'schedule') => {
    try {
      const cliente = clientes.find(c => c.id === clienteId);
      if (!cliente || !cliente.user) return;

      const newValue = !(cliente.user[permission] as boolean);

      await clientService.update(cliente.id, { [permission]: newValue });

      setClientes(prev =>
        prev.map(c =>
          c.id === clienteId
            ? {
              ...c,
              user: { ...c.user, [permission]: newValue },
            }
            : c
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
    }
  };


  const formatEndereco = (cliente: Cliente) => {
    return `${cliente.street}, ${cliente.number}${cliente.complement ? `, ${cliente.complement}` : ""}${cliente.neighboor ? `, ${cliente.neighboor}` : ""}, ${cliente.city} - ${cliente.state}`;
  };

  return (
    <div className="clientsContainer">
      <header className="clientsHeader">
        <h1 className="clientsTitle">Clientes</h1>
        <p className="clientsSubtitle">Overview de todos os clientes</p>
      </header>

      <div className="tableCard">
        <div className="filtersRow border-break">
          <div className="searchWrapper">
            <img src={searchIcon} alt="search" className="filterIcon" />
            <input
              type="text"
              placeholder="Filtre por cliente"
              className="filterInput withIcon"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="calendarWrapper">
            <img src={calendarIcon} alt="calendar" className="filterIcon" />
            <DatePicker
              selected={selectedDate}
              onChange={(date: any) => setSelectedDate(date)}
              placeholderText="Selecione a data"
              className="filterInput withIcon"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="clientsTable">
            <thead className='border-break'>
              <tr>
                <th>Data de cadastro ↓↑</th>
                <th>Cliente</th>
                <th>Endereço</th>
                <th>Permissões</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>Carregando...</td>
                </tr>
              ) : clientes.length === 0 ? (
                <td colSpan={5} className="area-image">
                  <div className="image-wrapper">
                    <img
                      src={notLogo}
                      alt="Notification"
                      className="not-logo"
                    />
                  </div>
                </td>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className='border-break'>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(cliente.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className="clientName">
                        {cliente.user.firstName} {cliente.user.lastName}
                      </span>
                      <span className="clientLabel">Cliente</span>
                    </td>
                    <td className="addressCell">{formatEndereco(cliente)}</td>
                    <td>
                      <div className="permissionButtons">
                        <button
                          className={`btnPermission ${cliente.user?.schedule ? 'btnActive' : 'btnInactive'}`}
                          onClick={() => togglePermission(cliente.id, 'schedule')}
                        >
                          Agendamentos
                        </button>
                        <button
                          className={`btnPermission ${cliente.user?.log ? 'btnActive' : 'btnInactive'}`}
                          onClick={() => togglePermission(cliente.id, 'log')}
                        >
                          Logs
                        </button>
                      </div>

                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className={`switchBase ${cliente.user.active ? 'switchOn' : 'switchOff'}`}>
                        <span className={`switchCircle ${cliente.user.active ? 'circleOn' : 'circleOff'}`} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
}
