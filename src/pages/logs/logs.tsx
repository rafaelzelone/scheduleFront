import { useEffect, useState } from 'react';
import { Search, ListFilter, History } from 'lucide-react';
import './log.css';
import { Pagination } from '../../components/page/pagination';
import { logService } from '../../service/request/logService';

type Log = {
  id: string;
  typeActivity: string;
  page: string;
  createdAt: string;
  logUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  logCustomer: {
    CEP: string;
    street: string;
    number: number;
    city: string;
    state: string;
  };
};

export function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchLogs = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const response = await logService.list({ page: pageNumber, search });
      const { data, pagination } = response.data;
      setLogs(data);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page, search]);

  return (
    <div className="logsContainer">
      <header className="logsHeader">
        <h1 className="logsTitle">Logs</h1>
        <p className="logsSubtitle">Acompanhe todos os Logs de clientes</p>
      </header>

      <div className="tableCard">
        <div className="logsFilters">
          <div className="searchBox">
            <Search className="searchIcon" size={18} />
            <input
              type="text"
              placeholder="Filtre por cliente, tipo de atividade ou módulo..."
              className="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filterButton">
            <span>Selecione</span>
            <ListFilter size={16} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="logsTable">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Usuário</th>
                <th>Tipo de atividade</th>
                <th>Módulo</th>
                <th>Data e Horário ↓</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Carregando...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Nenhum log encontrado</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className='border-break'>
                    <td>
                      <span className="clientNameBold">
                        {log.logCustomer.street}, {log.logCustomer.number} - {log.logCustomer.city}/{log.logCustomer.state}
                      </span><br />
                      <span className="clientTag">Cliente</span>
                    </td>
                    <td>
                      {log.logUser.firstName} {log.logUser.lastName} <br />
                      <span className="clientTag">{log.logUser.email}</span>
                    </td>
                    <td>
                      <span className="activityBadge">{log.typeActivity}</span>
                    </td>
                    <td>
                      <div className="moduleInfo">
                        <History size={14} />
                        {log.page}
                      </div>
                    </td>
                    <td>
                      <span className="dateTimeBadge">{new Date(log.createdAt).toLocaleString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
