// Medication tracker storage adapter
// - Saves entries locally (localStorage)
// - Asynchronously POSTs to backend and merges backend-generated fields

export type MedicationEntry = {
  id: string
  name: string
  childId: string
  timestamp: string
  data: {
    dose?: string
    time?: string
    notes?: string
  }
}

const MEDICATION_KEY = 'caregene-medication-entries'

export const medicationStorage = {
  getAll(): MedicationEntry[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(MEDICATION_KEY)
      return raw ? (JSON.parse(raw) as MedicationEntry[]) : []
    } catch {
      return []
    }
  },

  add(entry: MedicationEntry) {
    // Client-only guard
    if (typeof window === 'undefined') return

    // Normalize and ensure id/timestamp
    const toSave: MedicationEntry = {
      ...entry,
      id: entry.id && String(entry.id).trim() ? String(entry.id) : Date.now().toString(),
      timestamp: entry.timestamp && String(entry.timestamp).trim() ? entry.timestamp : new Date().toISOString(),
      data: { ...entry.data },
    }

    // Save locally first
    const all = medicationStorage.getAll()
    all.push(toSave)
    localStorage.setItem(MEDICATION_KEY, JSON.stringify(all))
    console.log('[medicationStorage] Saved locally:', toSave)

    // POST to backend in background with backend schema: { childId, name, data }
    ;(async () => {
      const requestBody = {
        childId: toSave.childId,
        name: toSave.name,
        data: toSave.data,
      } as const

      console.log('[medicationStorage] POST URL -> http://localhost:8000/api/v1/tracking/medication')
      console.log('[medicationStorage] POST body ->', requestBody)

      try {
        const res = await fetch('http://localhost:8000/api/v1/tracking/medication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        if (!res.ok) {
          let errorBody: unknown = null
          try {
            const text = await res.text()
            try {
              errorBody = JSON.parse(text)
            } catch {
              errorBody = text
            }
          } catch {}
          console.error('[medicationStorage] Backend responded with non-OK status', res.status, errorBody)
          return
        }

        const payload = (await res.json().catch(() => null)) as { id?: string; created_at?: string; timestamp?: string } | null
        console.log('[medicationStorage] POST response <-', payload)
        if (!payload) return

        // Merge backend id/timestamp into just-saved entry (support created_at or timestamp)
        const updated = medicationStorage.getAll()
        const idx = updated.findIndex((e) => e.id === toSave.id)
        if (idx !== -1) {
          const merged: MedicationEntry = {
            ...updated[idx],
            id: payload.id ?? updated[idx].id,
            timestamp: payload.timestamp ?? payload.created_at ?? updated[idx].timestamp,
          }
          updated[idx] = merged
          localStorage.setItem(MEDICATION_KEY, JSON.stringify(updated))
          console.log('[medicationStorage] Updated entry with backend response:', merged)
        }
      } catch (err) {
        console.error('[medicationStorage] Failed to POST medication entry', err)
      }
    })()
  },

  clear() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(MEDICATION_KEY)
  },
}


