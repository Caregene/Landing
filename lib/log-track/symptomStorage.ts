// localStorage adapter (today). Later you can swap this file to call the API.
export type SymptomEntry = {
    id: string;
    name: string;        // e.g. "Seizure"
    childId: string;     // "default"
    timestamp: string;   // ISO string
    data: {
      startTime: string; // ISO or "YYYY-MM-DDTHH:mm"
      severity: number;  // 0..5
      duration: string;  // minutes as string (keep as-is to match existing)
      notes?: string;
    };
  };
  
  const SYMPTOM_KEY = 'caregene-symptom-entries';
  
  // export const symptomStorage = {
  //   getAll(): SymptomEntry[] {
  //     if (typeof window === 'undefined') return [];
  //     try {
  //       const raw = localStorage.getItem(SYMPTOM_KEY);
  //       return raw ? (JSON.parse(raw) as SymptomEntry[]) : [];
  //     } catch {
  //       return [];
  //     }
  //   },
  //   add(entry: SymptomEntry) {
  //     const all = symptomStorage.getAll();
  //     all.push(entry);
  //     localStorage.setItem(SYMPTOM_KEY, JSON.stringify(all));

  //     // Also send to backend (non-blocking)
  //     (async () => {
  //       try {
  //         const res = await fetch('http://localhost:8000/api/v1/tracking/symptom', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(entry),
  //         });
  //         if (!res.ok) {
  //           console.error('[symptomStorage] Backend responded with non-OK status', res.status);
  //           return;
  //         }
  //         const payload = await res.json().catch(() => null) as { id?: string; created_at?: string } | null;
  //         if (!payload) return;

  //         // Merge backend id/created_at into the just-saved entry
  //         const updated = symptomStorage.getAll();
  //         const idx = updated.findIndex((e) => e.id === entry.id);
  //         if (idx !== -1) {
  //           const merged: SymptomEntry = {
  //             ...updated[idx],
  //             id: payload.id ?? updated[idx].id,
  //             timestamp: payload.created_at ?? updated[idx].timestamp,
  //           };
  //           updated[idx] = merged;
  //           localStorage.setItem(SYMPTOM_KEY, JSON.stringify(updated));
  //         }
  //       } catch (err) {
  //         // Keep localStorage as source of truth on failure
  //         console.error('[symptomStorage] Failed to POST symptom entry', err);
  //       }
  //     })();
  //   },
  //   clear() {
  //     localStorage.removeItem(SYMPTOM_KEY);
  //   }
  // };
  export const symptomStorage = {
    getAll(): SymptomEntry[] {
      if (typeof window === 'undefined') return [];
      try {
        const raw = localStorage.getItem(SYMPTOM_KEY);
        return raw ? (JSON.parse(raw) as SymptomEntry[]) : [];
      } catch {
        return [];
      }
    },
  
    add(entry: SymptomEntry) {
      // Client-only guard
      if (typeof window === 'undefined') return;

      // Normalize id/timestamp and ensure ISO startTime
      const toSave: SymptomEntry = {
        ...entry,
        id: entry.id && String(entry.id).trim() ? String(entry.id) : Date.now().toString(),
        timestamp: entry.timestamp && String(entry.timestamp).trim() ? entry.timestamp : new Date().toISOString(),
        data: {
          ...entry.data,
          startTime: entry.data?.startTime ? new Date(entry.data.startTime).toISOString() : new Date().toISOString(),
        },
      };

      // Save locally first
      const all = symptomStorage.getAll();
      all.push(toSave);
      localStorage.setItem(SYMPTOM_KEY, JSON.stringify(all));
      console.log('[symptomStorage] Saved locally:', toSave);

      // Backend expects { childId, name, data }
      (async () => {
        const requestBody = {
          childId: toSave.childId,
          name: toSave.name,
          data: toSave.data,
        } as const;

        console.log('[symptomStorage] POST URL -> http://localhost:8000/api/v1/tracking/symptom');
        console.log('[symptomStorage] POST body ->', requestBody);
        try {
          const res = await fetch('http://localhost:8000/api/v1/tracking/symptom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          if (!res.ok) {
            let errorBody: unknown = null;
            try {
              const text = await res.text();
              try { errorBody = JSON.parse(text); } catch { errorBody = text; }
            } catch {}
            console.error('[symptomStorage] Backend responded with non-OK status', res.status, errorBody);
            return;
          }

          const payload = await res.json().catch(() => null) as { id?: string; created_at?: string } | null;
          console.log('[symptomStorage] POST response <-', payload);
          if (!payload) return;

          // Merge backend id/created_at into the just-saved entry
          const updated = symptomStorage.getAll();
          const idx = updated.findIndex((e) => e.id === toSave.id);
          if (idx !== -1) {
            const merged: SymptomEntry = {
              ...updated[idx],
              id: payload.id ?? updated[idx].id,
              timestamp: payload.created_at ?? updated[idx].timestamp,
            };
            updated[idx] = merged;
            localStorage.setItem(SYMPTOM_KEY, JSON.stringify(updated));
            console.log('[symptomStorage] Updated entry with backend response:', merged);
          }
        } catch (err) {
          console.error('[symptomStorage] Failed to POST symptom entry', err);
        }
      })();
    },
  
    clear() {
      localStorage.removeItem(SYMPTOM_KEY);
    }
  };
  