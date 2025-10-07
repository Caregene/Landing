'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { symptomStorage, SymptomEntry } from '../../../../../lib/log-track/symptomStorage';

export default function LogsPage() {
  const { type } = useParams<{ type: string }>(); // "symptom" today
  const router = useRouter();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);

  useEffect(() => {
    // today: only "symptom" uses localStorage
    if (type === 'symptom') {
      setEntries(symptomStorage.getAll());
    } else {
      setEntries([]); // nothing else wired yet
    }
  }, [type]);

  const rows = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [entries]
  );

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>{type} logs</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={() => router.back()}>Back</button>
        <button
          onClick={() => {
            // optional: clear for testing
            if (confirm('Clear all symptom logs from localStorage?')) {
              symptomStorage.clear();
              setEntries([]);
            }
          }}
        >
          Clear (local)
        </button>
      </div>

      {rows.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>When</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Symptom</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Duration (min)</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Severity</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td style={{ borderBottom: '1px solid #f3f3f3', padding: 8 }}>
                  {e.data?.startTime ?? e.timestamp}
                </td>
                <td style={{ borderBottom: '1px solid #f3f3f3', padding: 8 }}>{e.name}</td>
                <td style={{ borderBottom: '1px solid #f3f3f3', padding: 8 }}>{e.data?.duration ?? '-'}</td>
                <td style={{ borderBottom: '1px solid #f3f3f3', padding: 8 }}>
                  {typeof e.data?.severity === 'number' ? `${e.data.severity}/5` : '-'}
                </td>
                <td style={{ borderBottom: '1px solid #f3f3f3', padding: 8 }}>{e.data?.notes ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
