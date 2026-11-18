
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Link } from 'react-router-dom';
import { usePoll, money, when } from '../services/api.js';
import {
  Card,
  ResultBadge,
  Spinner,
  Stat,
  StateBadge,
} from '../components/Ui.jsx';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const { data: s, error } = usePoll('/dashboard/stats', 3000);
  const { data: svc } = usePoll('/services/status', 3000);

  if (error && !s) {
    return <p className="error">{error}</p>;
  }

  if (!s) {
    return <Spinner />;
  }

  // Safely handle API response arrays
  const byDay = Array.isArray(s.byDay) ? s.byDay : [];
  const recent = Array.isArray(s.recent) ? s.recent : [];
  const services = Array.isArray(svc) ? svc : [];

  const chart = {
    labels: byDay.map((d) => d.date),
    datasets: [
      {
        label: 'Successful',
        data: byDay.map((d) => d.success ?? 0),
        backgroundColor: '#15803d',
      },
      {
        label: 'Failed',
        data: byDay.map((d) => d.failed ?? 0),
        backgroundColor: '#b42318',
      },
      {
        label: 'Rolled back',
        data: byDay.map((d) => d.rolledBack ?? 0),
        backgroundColor: '#6d28d9',
      },
    ],
  };

  const successRate = Number(s.successRate) || 0;

  return (
    <>
      <h1>Dashboard</h1>

      <div className="stats">
        <Stat label="Total transactions" value={s.total ?? 0} />
        <Stat label="Successful" value={s.success ?? 0} tone="ok" />
        <Stat label="Failed" value={s.failed ?? 0} tone="bad" />
        <Stat label="Rolled back" value={s.rolledBack ?? 0} tone="rb" />
        <Stat label="Processing now" value={s.processing ?? 0} tone="run" />
      </div>

      <div className="grid2">
        <Card title="Last 7 days">
          <div className="chart">
            <Bar
              data={chart}
              options={{
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { precision: 0 },
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card title="Success rate">
          <div className="rate">
            <strong>{successRate}%</strong>
            <span>of finished transactions completed</span>
            <div className="bar">
              <i style={{ width: `${successRate}%` }} />
            </div>
          </div>

          <h4>Service status</h4>

          <ul className="svc-mini">
            {services.map((x) => (
              <li key={x.name}>
                <span className={`dot ${(x.status || 'unknown').toLowerCase()}`} />
                {x.name}
                <em>{x.status || 'Unknown'}</em>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title="Recent transactions"
        right={
          <Link to="/history" className="link">
            View all
          </Link>
        }
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>State</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {recent.length > 0 ? (
                recent.map((t) => (
                  <tr key={t.transactionId}>
                    <td>{t.transactionId}</td>
                    <td>{t.customerName}</td>
                    <td>{money(t.amount)}</td>
                    <td>{when(t.createdDate)}</td>
                    <td>
                      <StateBadge state={t.currentState} />
                    </td>
                    <td>
                      <ResultBadge status={t.finalStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
