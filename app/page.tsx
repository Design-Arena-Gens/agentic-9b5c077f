'use client';

import { useMemo, useState } from 'react';

type Truck = {
  id: string;
  driver: string;
  currentLocation: string;
  eta: string;
  status: 'En Route' | 'Loading' | 'Idle' | 'Delayed';
  payloadId?: string;
};

type Payload = {
  id: string;
  description: string;
  destination: string;
  weight: string;
  readiness: string;
  assignedTruckId?: string;
};

const initialPayloads: Payload[] = [
  {
    id: 'PL-245',
    description: 'Rolled Steel Coils',
    destination: 'Omaha, NE',
    weight: '18,400 lbs',
    readiness: 'Cleared • Dock 3',
    assignedTruckId: 'TRK-204'
  },
  {
    id: 'PL-311',
    description: 'Medical Supplies Pallets',
    destination: 'Salt Lake City, UT',
    weight: '9,200 lbs',
    readiness: 'Manifest Signed • Gate 1',
    assignedTruckId: 'TRK-317'
  },
  {
    id: 'PL-402',
    description: 'Cold Storage Produce',
    destination: 'Kansas City, MO',
    weight: '12,600 lbs',
    readiness: 'Temperature Stable • Dock 5'
  },
  {
    id: 'PL-457',
    description: 'Machinery Components',
    destination: 'Wichita, KS',
    weight: '16,300 lbs',
    readiness: 'Packaging Complete • Warehouse B'
  },
  {
    id: 'PL-509',
    description: 'Retail Fixtures',
    destination: 'Tulsa, OK',
    weight: '7,450 lbs',
    readiness: 'Awaiting QA • Staging Area'
  },
  {
    id: 'PL-612',
    description: 'Aviation Fuel Additives',
    destination: 'Rapid City, SD',
    weight: '5,900 lbs',
    readiness: 'Hazmat Cleared • Secure Storage'
  }
];

const initialTrucks: Truck[] = [
  {
    id: 'TRK-204',
    driver: 'Avery Holt',
    currentLocation: 'Fort Collins, CO',
    eta: 'Arrival 14:45',
    status: 'En Route',
    payloadId: 'PL-245'
  },
  {
    id: 'TRK-317',
    driver: 'Maya Ingram',
    currentLocation: 'Aurora, CO',
    eta: 'Loading 20 min',
    status: 'Loading',
    payloadId: 'PL-311'
  },
  {
    id: 'TRK-441',
    driver: 'Sean Pike',
    currentLocation: 'Depot Yard',
    eta: 'Awaiting Dispatch',
    status: 'Idle'
  },
  {
    id: 'TRK-509',
    driver: 'Elena Archer',
    currentLocation: 'Colorado Springs, CO',
    eta: 'Weather Delay +45m',
    status: 'Delayed'
  }
];

export default function DashboardPage() {
  const [trucks, setTrucks] = useState(initialTrucks);
  const [payloads, setPayloads] = useState(initialPayloads);

  const metrics = useMemo(() => {
    const activeLoads = payloads.filter((payload) => payload.assignedTruckId).length;
    const waitingLoads = payloads.length - activeLoads;
    const enRoute = trucks.filter((truck) => truck.status === 'En Route').length;
    return { activeLoads, waitingLoads, enRoute };
  }, [payloads, trucks]);

  const unassignedPayloads = useMemo(
    () => payloads.filter((payload) => !payload.assignedTruckId),
    [payloads]
  );

  const getPayloadById = (id?: string) => payloads.find((payload) => payload.id === id);

  const handleAssignment = (truckId: string, nextPayloadId: string) => {
    setTrucks((prev) =>
      prev.map((truck) => {
        if (truck.id === truckId) {
          return { ...truck, payloadId: nextPayloadId || undefined };
        }
        if (nextPayloadId && truck.payloadId === nextPayloadId) {
          return { ...truck, payloadId: undefined };
        }
        return truck;
      })
    );

    setPayloads((prev) =>
      prev.map((payload) => {
        if (payload.id === nextPayloadId) {
          return nextPayloadId ? { ...payload, assignedTruckId: truckId } : { ...payload, assignedTruckId: undefined };
        }
        if (payload.assignedTruckId === truckId && payload.id !== nextPayloadId) {
          return { ...payload, assignedTruckId: undefined };
        }
        return payload;
      })
    );
  };

  return (
    <main className="app-shell">
      <section className="card header">
        <div className="split">
          <div>
            <h1>Fleet Payload Dashboard</h1>
            <p>Monitor live payload assignments, departures, and waiting cargo in a single view.</p>
          </div>
          <div className="pill">Active Loads • {metrics.activeLoads}</div>
        </div>
        <div className="split">
          <span>Trucks en route: {metrics.enRoute}</span>
          <span>Payloads awaiting pickup: {metrics.waitingLoads}</span>
        </div>
      </section>

      <div className="grid">
        <section className="card grid-main">
          <div className="split" style={{ marginBottom: 16 }}>
            <h2>Truck Assignments</h2>
            <span className="subtle">Update loads directly in-line to keep dispatch in sync.</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Truck</th>
                  <th>Driver</th>
                  <th>Location</th>
                  <th>Schedule</th>
                  <th>Payload</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Assignment</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => {
                  const payload = getPayloadById(truck.payloadId);
                  const statusClass =
                    truck.status === 'Idle' || truck.status === 'Delayed'
                      ? 'pill pending'
                      : 'pill';

                  return (
                    <tr key={truck.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{truck.id}</div>
                        <div className="subtle">Last update 5 min ago</div>
                      </td>
                      <td>
                        <div>{truck.driver}</div>
                        <div className="status-line">
                          <span className="badge">{(truck.driver.split(' ')[0] || '').slice(0, 1)}</span>
                          <span>Contact ready</span>
                        </div>
                      </td>
                      <td>
                        <div>{truck.currentLocation}</div>
                        <div className="subtle">{payload ? 'Cargo secured' : 'Awaiting load'}</div>
                      </td>
                      <td>
                        <div>{truck.eta}</div>
                        <div className="subtle">
                          {truck.status === 'En Route'
                            ? 'On schedule'
                            : truck.status === 'Loading'
                            ? 'Ramp allocated'
                            : truck.status === 'Idle'
                            ? 'Standing by'
                            : 'Weather watch'}
                        </div>
                      </td>
                      <td>
                        {payload ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{payload.description}</div>
                            <div className="subtle">{payload.weight}</div>
                          </div>
                        ) : (
                          <div className="subtle">No payload assigned</div>
                        )}
                      </td>
                      <td>
                        {payload ? (
                          <div>
                            <div>{payload.destination}</div>
                            <div className="subtle">{payload.readiness}</div>
                          </div>
                        ) : (
                          <span className="subtle">—</span>
                        )}
                      </td>
                      <td>
                        <span className={statusClass}>{truck.status}</span>
                      </td>
                      <td>
                        <select
                          className="select"
                          value={truck.payloadId ?? ''}
                          onChange={(event) => handleAssignment(truck.id, event.target.value)}
                        >
                          <option value="">No payload</option>
                          {payloads.map((payloadOption) => {
                            const assignedElsewhere =
                              payloadOption.assignedTruckId &&
                              payloadOption.assignedTruckId !== truck.id;
                            const label = `${payloadOption.id} • ${payloadOption.description}${
                              assignedElsewhere ? ` (Assigned to ${payloadOption.assignedTruckId})` : ''
                            }`;
                            return (
                              <option key={payloadOption.id} value={payloadOption.id}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="card grid-side">
          <div className="split" style={{ marginBottom: 16 }}>
            <h2>Waiting Payloads</h2>
            <span className="pill pending">
              {unassignedPayloads.length} ready
            </span>
          </div>
          <div className="payload-list">
            {unassignedPayloads.length === 0 ? (
              <div className="payload-item">
                <div>
                  <h3>All cargo loaded</h3>
                  <p className="payload-meta">Every payload has been assigned to a truck.</p>
                </div>
              </div>
            ) : (
              unassignedPayloads.map((payload) => (
                <div key={payload.id} className="payload-item">
                  <div>
                    <h3>{payload.description}</h3>
                    <p className="payload-meta">
                      Destination: {payload.destination} • {payload.weight}
                    </p>
                    <div className="payload-footer">
                      <span className="badge">{payload.id}</span>
                      <span>{payload.readiness}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
