import { useEffect, useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import './clients.css';
import { Pagination } from '../../components/page/pagination';
import { clientService } from '../../service/request/clientService';
import type { Cliente } from '../../type/client';
import notLogo from '../../../public/msgNot.svg';

export function Clients() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

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

  const formatEndereco = (cliente: Cliente) => {
    return `${cliente.street}, ${cliente.number}${cliente.complement ? `, ${cliente.complement}` : ""}${cliente.neighboor ? `, ${cliente.neighboor}` : ""}, ${cliente.city} - ${cliente.state}`;
  };

  return (
    <div className="clientesContainer">
      <header className="clientesHeader">
        <h1 className="clientesTitle">Clientes</h1>
        <p className="clientesSubtitle">Overview de todos os clientes</p>
      </header>

      <div className="tableCard">
        <div className="filtersRow border-break">
          <div className="searchWrapper">
            <Search className="filterIconLeft" size={18} />
            <input
              type="text"
              placeholder="Filtre por cliente"
              className="filterInput"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="selectWrapper">
            <input type="text" placeholder="Selecione" className="filterInput" readOnly />
            <Calendar className="filterIconRight" size={18} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="clientesTable">
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
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    <img
                      src={notLogo}
                      alt="Notification"
                      className="not-logo"
                    /></td>
                </tr>
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
                        <button className={`btnPermission ${cliente.permissoes?.agendamentos ? 'btnActive' : 'btnInactive'}`}>
                          Agendamentos
                        </button>
                        <button className={`btnPermission ${cliente.permissoes?.logs ? 'btnActive' : 'btnInactive'}`}>
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
