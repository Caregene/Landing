export type NutritionEntry = {
  id: string;
  name: string;        // e.g. "Lunch"
  childId: string;     // "default" or user ID
  timestamp: string;   // ISO string
  data: {
    startTime: string;       // ISO string or "YYYY-MM-DDTHH:mm"
    portionSize?: string;
    mealType?: string;
    notes?: string;
    time?: string;
  };
};

const NUTRITION_KEY = 'caregene-nutrition-entries';

export const nutritionStorage = {
  getAll(): NutritionEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(NUTRITION_KEY);
      return raw ? (JSON.parse(raw) as NutritionEntry[]) : [];
    } catch {
      return [];
    }
  },

  add(entry: NutritionEntry) {
    // Client-only guard
    if (typeof window === 'undefined') return;

    // Normalize and ensure id/timestamp
    const toSave: NutritionEntry = {
      ...entry,
      id: entry.id && String(entry.id).trim() ? String(entry.id) : Date.now().toString(),
      timestamp: entry.timestamp && String(entry.timestamp).trim() ? entry.timestamp : new Date().toISOString(),
      data: {
        ...entry.data,
        startTime: entry.data?.startTime ? new Date(entry.data.startTime).toISOString() : new Date().toISOString(),
      },
    };

    // Save locally first
    const all = nutritionStorage.getAll();
    all.push(toSave);
    localStorage.setItem(NUTRITION_KEY, JSON.stringify(all));
    console.log('[nutritionStorage] Saved locally:', toSave);

    // Send to backend in background with backend schema: { childId, name, data }
    (async () => {
      const requestBody = {
        childId: toSave.childId,
        name: toSave.name,
        data: toSave.data,
      } as const;

      console.log('[nutritionStorage] POST URL -> http://localhost:8000/api/v1/tracking/nutrition');
      console.log('[nutritionStorage] POST body ->', requestBody);

      try {
        const res = await fetch('http://localhost:8000/api/v1/tracking/nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          let errorBody: unknown = null;
          try {
            const text = await res.text();
            try {
              errorBody = JSON.parse(text);
            } catch {
              errorBody = text;
            }
          } catch {}
          console.error('[nutritionStorage] Backend responded with non-OK status', res.status, errorBody);
          return;
        }

        const payload = await res.json().catch(() => null) as { id?: string; created_at?: string } | null;
        console.log('[nutritionStorage] POST response <-', payload);
        if (!payload) return;

        // Merge backend id/created_at into just-saved entry
        const updated = nutritionStorage.getAll();
        const idx = updated.findIndex((e) => e.id === toSave.id);
        if (idx !== -1) {
          const merged: NutritionEntry = {
            ...updated[idx],
            id: payload.id ?? updated[idx].id,
            timestamp: payload.created_at ?? updated[idx].timestamp,
          };
          updated[idx] = merged;
          localStorage.setItem(NUTRITION_KEY, JSON.stringify(updated));
          console.log('[nutritionStorage] Updated entry with backend response:', merged);
        }
      } catch (err) {
        console.error('[nutritionStorage] Failed to POST nutrition entry', err);
      }
    })();
  },

  clear() {
    localStorage.removeItem(NUTRITION_KEY);
  }
};
