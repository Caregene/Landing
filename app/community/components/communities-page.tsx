"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Shield, Crown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient, type Community } from '@/app/community/lib/api-client'

function CommunitiesPage(
  {
    symptomOptions,
    locationOptions,
  }: { symptomOptions?: string[]; locationOptions?: string[] } = {}
) {
  const router = useRouter()
  const RARE_GENETIC_CONDITIONS = [
    'Angelman syndrome',
    'Batten disease',
    'Charcot-Marie-Tooth disease',
    'Cri-du-chat syndrome',
    'Cystic fibrosis',
    'Duchenne muscular dystrophy',
    'Ehlers-Danlos syndrome',
    'Fabry disease',
    'Fragile X syndrome',
    'Gaucher disease',
    'Hemophilia A',
    'Hemophilia B',
    'Huntington disease',
    'Marfan syndrome',
    'Menkes disease',
    'Mitochondrial disease',
    'Niemann-Pick disease',
    'Noonan syndrome',
    'Phenylketonuria (PKU)',
    'Pompe disease',
    'Prader-Willi syndrome',
    'Rett syndrome',
    'Sickle cell disease',
    'Smith-Lemli-Opitz syndrome',
    'Spinal muscular atrophy (SMA)',
    'Tay-Sachs disease',
    'Tuberous sclerosis complex',
    'Usher syndrome',
    'Williams syndrome',
    'Wilson disease'
  ]
  const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
    'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
    'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
    'Wisconsin','Wyoming'
  ]
  const DEFAULT_REGIONS = [
    'United States of America',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'Germany',
    'France',
    'Brazil',
    'Mexico',
    'Japan',
    'China',
    'South Korea',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'New Zealand',
    'South Africa',
  ]
  const isUSRegion = (v: string) => {
    const n = (v || '').toLowerCase().replace(/\./g, '').trim()
    return n === 'united states of america' || n === 'united states' || n === 'usa' || n === 'us' || n === 'u s a' || n === 'u s'
  }
  const [groupsSearch, setGroupsSearch] = useState('')
  const [committedQuery, setCommittedQuery] = useState('')
  const [communities, setCommunities] = useState<Community[]>([])
  const [communitiesLoading, setCommunitiesLoading] = useState<boolean>(false)
  const [communitiesError, setCommunitiesError] = useState<string | null>(null)
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([])
  const [joinedLoading, setJoinedLoading] = useState<boolean>(false)
  const [joinedError, setJoinedError] = useState<string | null>(null)
  // Filters
  const [conditions, setConditions] = useState<string[]>(symptomOptions ?? RARE_GENETIC_CONDITIONS)
  const [regions, setRegions] = useState<string[]>(locationOptions ?? DEFAULT_REGIONS)
  const [selectedCondition, setSelectedCondition] = useState<string>('') // symptoms
  const [selectedRegion, setSelectedRegion] = useState<string>('') // location (country)
  const [stateInput, setStateInput] = useState<string>('') // state (if USA)
  const [joinedOnly, setJoinedOnly] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'members' | 'recent'>('relevance')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)
  const [symptomQuery, setSymptomQuery] = useState('')
  const [regionQuery, setRegionQuery] = useState('')
  const [stateQuery, setStateQuery] = useState('')
  const [symptomOpen, setSymptomOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [stateOpen, setStateOpen] = useState(false)
  // Keyboard navigation indices (-1 means the "All ..." action)
  const [symptomHighlightIndex, setSymptomHighlightIndex] = useState<number>(-1)
  const [regionHighlightIndex, setRegionHighlightIndex] = useState<number>(-1)
  const [stateHighlightIndex, setStateHighlightIndex] = useState<number>(-1)
  // Scroll containers for dropdowns
  const symptomListRef = useRef<HTMLDivElement | null>(null)
  const regionListRef = useRef<HTMLDivElement | null>(null)
  const stateListRef = useRef<HTMLDivElement | null>(null)
  // Input refs to move focus between fields
  const symptomInputRef = useRef<HTMLInputElement | null>(null)
  const regionInputRef = useRef<HTMLInputElement | null>(null)
  const stateInputRefEl = useRef<HTMLInputElement | null>(null)

  // Filtered option lists for comboboxes
  const filteredSymptoms = useMemo(
    () => conditions.filter((c) => String(c ?? '').toLowerCase().includes(symptomQuery.toLowerCase())),
    [conditions, symptomQuery]
  )
  const filteredRegions = useMemo(
    () => regions.filter((r) => String(r ?? '').toLowerCase().includes(regionQuery.toLowerCase())),
    [regions, regionQuery]
  )
  const filteredStates = useMemo(
    () => US_STATES.filter((s) => String(s ?? '').toLowerCase().includes(stateQuery.toLowerCase())),
    [stateQuery]
  )

  // Reset highlight to first item when queries change
  useEffect(() => {
    setSymptomHighlightIndex(filteredSymptoms.length > 0 ? 0 : -1)
  }, [symptomQuery, conditions, filteredSymptoms.length])
  useEffect(() => {
    setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1)
  }, [regionQuery, regions, filteredRegions.length])
  useEffect(() => {
    setStateHighlightIndex(filteredStates.length > 0 ? 0 : -1)
  }, [stateQuery, filteredStates.length])

  // Ensure highlighted item is visible (Symptoms)
  useEffect(() => {
    if (!symptomOpen) return
    const container = symptomListRef.current
    if (!container) return
    if (symptomHighlightIndex === -1) {
      container.scrollTop = 0
      return
    }
    const buttons = container.querySelectorAll('button')
    const target = buttons[symptomHighlightIndex + 1] as HTMLElement | undefined // +1 for "All symptoms"
    target?.scrollIntoView({ block: 'nearest' })
  }, [symptomHighlightIndex, symptomOpen, filteredSymptoms.length])

  // Ensure highlighted item is visible (Regions)
  useEffect(() => {
    if (!regionOpen) return
    const container = regionListRef.current
    if (!container) return
    if (regionHighlightIndex === -1) {
      container.scrollTop = 0
      return
    }
    const buttons = container.querySelectorAll('button')
    const target = buttons[regionHighlightIndex + 1] as HTMLElement | undefined // +1 for "All regions"
    target?.scrollIntoView({ block: 'nearest' })
  }, [regionHighlightIndex, regionOpen, filteredRegions.length])

  // Ensure highlighted item is visible (States)
  useEffect(() => {
    if (!stateOpen) return
    const container = stateListRef.current
    if (!container) return
    if (stateHighlightIndex === -1) {
      container.scrollTop = 0
      return
    }
    const buttons = container.querySelectorAll('button')
    const target = buttons[stateHighlightIndex + 1] as HTMLElement | undefined // +1 for "All states"
    target?.scrollIntoView({ block: 'nearest' })
  }, [stateHighlightIndex, stateOpen, filteredStates.length])

  useEffect(() => {
    let cancelled = false
    setCommunitiesLoading(true)
    setCommunitiesError(null)
    const timeout = setTimeout(async () => {
      try {
        // Use semantic search endpoint when a committed query or filters are present
        const hasQuery = !!committedQuery.trim()
        const hasFilters = !!selectedCondition || !!selectedRegion || !!stateInput.trim() || joinedOnly || sortBy !== 'relevance'
        const res = hasQuery || hasFilters
          ? await apiClient.searchCommunities({
              query: committedQuery || undefined,
              condition: selectedCondition || undefined,
              region: selectedRegion || undefined,
              state: isUSRegion(selectedRegion) ? (stateInput || undefined) : undefined,
              page: 1,
              limit: 18,
            })
          : await apiClient.getCommunities({ page: 1, limit: 18 })
        if (cancelled) return
        if (res.error) {
          setCommunities([])
          setCommunitiesError(res.error)
        } else {
          const data = res.data as any
          setCommunities(Array.isArray(data?.communities) ? data.communities : [])
        }
      } catch (e: any) {
        if (!cancelled) setCommunitiesError(e?.message || 'Failed to load communities')
      } finally {
        if (!cancelled) setCommunitiesLoading(false)
      }
    }, 0)
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [committedQuery, selectedCondition, selectedRegion, stateInput, joinedOnly, sortBy])

  // Load filter options (no async work needed)
  useEffect(() => {
    // Prefer provided symptom list; otherwise use built-in rare conditions
    setConditions(symptomOptions && Array.isArray(symptomOptions) ? symptomOptions : RARE_GENETIC_CONDITIONS)
    setRegions(locationOptions && Array.isArray(locationOptions) ? locationOptions : DEFAULT_REGIONS)
  }, [symptomOptions, locationOptions])

  // Clear state filters if region is not USA
  useEffect(() => {
    if (!isUSRegion(selectedRegion)) {
      setStateInput('')
      setStateQuery('')
    }
  }, [selectedRegion])

  // Fetch communities that the current user has already joined (or owns/admins)
  useEffect(() => {
    let cancelled = false
    setJoinedLoading(true)
    setJoinedError(null)
    ;(async () => {
      try {
        const res = await apiClient.getUserCommunities()
        if (cancelled) return
        if (res.error) {
          setJoinedCommunities([])
          setJoinedError(res.error)
        } else {
          const data = res.data as any
          const list: Community[] = Array.isArray(data?.communities) ? data.communities : []
          setJoinedCommunities(list)
        }
      } catch (e: any) {
        if (!cancelled) setJoinedError(e?.message || 'Failed to load your communities')
      } finally {
        if (!cancelled) setJoinedLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onClear: () => void }> = []
    if (selectedCondition) chips.push({ key: 'condition', label: selectedCondition, onClear: () => setSelectedCondition('') })
    if (selectedRegion) chips.push({ key: 'region', label: selectedRegion, onClear: () => setSelectedRegion('') })
  if (isUSRegion(selectedRegion) && stateInput.trim()) chips.push({ key: 'state', label: stateInput.trim(), onClear: () => setStateInput('') })
    if (committedQuery.trim()) chips.push({ key: 'q', label: `“${committedQuery.trim()}”`, onClear: () => setCommittedQuery('') })
    return chips
  }, [selectedCondition, selectedRegion, stateInput, committedQuery])

  // Heuristic to detect admin role from typical fields
  const isAdminOf = (c: Community) => {
    const anyC = c as any
    const role = String(anyC?.role ?? '').toLowerCase()
    return Boolean(anyC?.isAdmin || anyC?.admin || anyC?.isOwner || role === 'admin' || role === 'owner')
  }

  return (
    <div className="min-h-screen bg-background">
          {/* Search row */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex w-full sm:w-1/2 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or syndrome..."
                  className="pl-10 pr-10"
                  value={groupsSearch}
                  onChange={(e) => setGroupsSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setCommittedQuery(groupsSearch) }}
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setCommittedQuery(groupsSearch)}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setMobileFiltersOpen((v) => !v)} aria-label="Toggle filters">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="min-w-36">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="recent">Recently created</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="hidden sm:inline-flex">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </div>
          </div>

          {/* Filters panel (symptoms, location, state) */}
          {mobileFiltersOpen && (
            <div className="mt-3 border rounded-md p-3 bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Filters</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Symptoms (combobox) */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      ref={symptomInputRef}
                      placeholder="Search symptoms..."
                      value={symptomQuery}
                      onChange={(e) => { setSymptomQuery(e.target.value); setSymptomOpen(true) }}
                      onFocus={() => { setSymptomOpen(true); setSymptomHighlightIndex(filteredSymptoms.length > 0 ? 0 : -1) }}
                      onClick={() => { setSymptomOpen(true); setSymptomHighlightIndex(filteredSymptoms.length > 0 ? 0 : -1) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') { setSymptomOpen(false); return }
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                          e.preventDefault()
                          setSymptomOpen(true)
                          const total = filteredSymptoms.length + 1 // include "All symptoms"
                          const flat = symptomHighlightIndex + 1
                          const delta = e.key === 'ArrowDown' ? 1 : -1
                          const nextFlat = ((flat + delta) % total + total) % total
                          setSymptomHighlightIndex(nextFlat - 1)
                        } else if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!symptomOpen) { setSymptomOpen(true); return }
                          if (symptomHighlightIndex === -1) {
                            setSelectedCondition('')
                            setSymptomQuery('')
                            setSymptomOpen(false)
                          } else {
                            const choice = filteredSymptoms[symptomHighlightIndex]
                            if (choice) {
                              setSelectedCondition(choice)
                              setSymptomQuery(choice)
                              setSymptomOpen(false)
                            }
                          }
                          // Move focus to Location field after selection/clear
                          setTimeout(() => {
                            regionInputRef.current?.focus()
                            setRegionOpen(true)
                            setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1)
                          }, 0)
                        }
                      }}
                      onBlur={() => {
                        // Delay to allow item click before closing
                        setTimeout(() => setSymptomOpen(false), 120)
                      }}
                    />
                    {symptomOpen && (
                      <div ref={symptomListRef} className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-56 overflow-auto text-sm">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedCondition('')
                            setSymptomQuery('')
                            setSymptomOpen(false)
                            // Move to Location
                            setTimeout(() => {
                              regionInputRef.current?.focus()
                              setRegionOpen(true)
                              setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1)
                            }, 0)
                          }}
                        >
                          All symptoms
                        </button>
                        {filteredSymptoms.map((c, idx) => (
                          <button
                            key={c}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground ${idx === symptomHighlightIndex ? 'bg-accent text-accent-foreground' : ''}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => setSymptomHighlightIndex(idx)}
                            onClick={() => {
                              setSelectedCondition(c)
                              setSymptomQuery(c)
                              setSymptomOpen(false)
                              // Move to Location
                              setTimeout(() => {
                                regionInputRef.current?.focus()
                                setRegionOpen(true)
                                setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1)
                              }, 0)
                            }}
                          >
                            {c}
                          </button>
                        ))}
                        {filteredSymptoms.length === 0 && (
                          <div className="px-3 py-2 text-muted-foreground">No results</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Location (combobox) */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      ref={regionInputRef}
                      placeholder="Search locations..."
                      value={regionQuery}
                      onChange={(e) => { setRegionQuery(e.target.value); setRegionOpen(true) }}
                      onFocus={() => { setRegionOpen(true); setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1) }}
                      onClick={() => { setRegionOpen(true); setRegionHighlightIndex(filteredRegions.length > 0 ? 0 : -1) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') { setRegionOpen(false); return }
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                          e.preventDefault()
                          setRegionOpen(true)
                          const total = filteredRegions.length + 1 // include "All regions"
                          const flat = regionHighlightIndex + 1
                          const delta = e.key === 'ArrowDown' ? 1 : -1
                          const nextFlat = ((flat + delta) % total + total) % total
                          setRegionHighlightIndex(nextFlat - 1)
                        } else if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!regionOpen) { setRegionOpen(true); return }
                          if (regionHighlightIndex === -1) {
                            setSelectedRegion('')
                            setRegionQuery('')
                            setRegionOpen(false)
                            // Clearing region: trigger search directly
                            setTimeout(() => {
                              setCommittedQuery(groupsSearch)
                            }, 0)
                          } else {
                            const choice = filteredRegions[regionHighlightIndex]
                            if (choice) {
                              setSelectedRegion(choice)
                              setRegionQuery(choice)
                              setRegionOpen(false)
                              // If USA move to State; otherwise apply search
                              setTimeout(() => {
                                if (isUSRegion(choice)) {
                                  stateInputRefEl.current?.focus()
                                  setStateOpen(true)
                                  setStateHighlightIndex(filteredStates.length > 0 ? 0 : -1)
                                } else {
                                  setCommittedQuery(groupsSearch)
                                }
                              }, 0)
                            }
                          }
                        }
                      }}
                      onBlur={() => { setTimeout(() => setRegionOpen(false), 120) }}
                    />
                    {regionOpen && (
                      <div ref={regionListRef} className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-56 overflow-auto text-sm">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSelectedRegion(''); setRegionQuery(''); setRegionOpen(false) }}
                        >
                          All regions
                        </button>
                        {filteredRegions.map((r, idx) => (
                          <button
                            key={r}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground ${idx === regionHighlightIndex ? 'bg-accent text-accent-foreground' : ''}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => setRegionHighlightIndex(idx)}
                            onClick={() => {
                              setSelectedRegion(r)
                              setRegionQuery(r)
                              setRegionOpen(false)
                              setTimeout(() => {
                                if (isUSRegion(r)) {
                                  stateInputRefEl.current?.focus()
                                  setStateOpen(true)
                                  setStateHighlightIndex(filteredStates.length > 0 ? 0 : -1)
                                } else {
                                  setCommittedQuery(groupsSearch)
                                }
                              }, 0)
                            }}
                          >
                            {r}
                          </button>
                        ))}
                        {filteredRegions.length === 0 && (
                          <div className="px-3 py-2 text-muted-foreground">No results</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* State (column 3; only when United States selected) */}
                {isUSRegion(selectedRegion) && (
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Input
                        ref={stateInputRefEl}
                        placeholder="Search states..."
                        value={stateQuery}
                        onChange={(e) => { setStateQuery(e.target.value); setStateOpen(true) }}
                        onFocus={() => { setStateOpen(true); setStateHighlightIndex(filteredStates.length > 0 ? 0 : -1) }}
                        onClick={() => { setStateOpen(true); setStateHighlightIndex(filteredStates.length > 0 ? 0 : -1) }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') { setStateOpen(false); return }
                          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                            e.preventDefault()
                            setStateOpen(true)
                            const total = filteredStates.length + 1 // include "All states"
                            const flat = stateHighlightIndex + 1
                            const delta = e.key === 'ArrowDown' ? 1 : -1
                            const nextFlat = ((flat + delta) % total + total) % total
                            setStateHighlightIndex(nextFlat - 1)
                          } else if (e.key === 'Enter') {
                            e.preventDefault()
                            if (!stateOpen) { setStateOpen(true); return }
                            if (stateHighlightIndex === -1) {
                              setStateInput('')
                              setStateQuery('')
                              setStateOpen(false)
                              setCommittedQuery(groupsSearch)
                            } else {
                              const choice = filteredStates[stateHighlightIndex]
                              if (choice) {
                                setStateInput(choice)
                                setStateQuery(choice)
                                setStateOpen(false)
                                setCommittedQuery(groupsSearch)
                              }
                            }
                          }
                        }}
                        onBlur={() => { setTimeout(() => setStateOpen(false), 120) }}
                      />
                      {stateOpen && (
                        <div ref={stateListRef} className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-56 overflow-auto text-sm">
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setStateInput('')
                              setStateQuery('')
                              setStateOpen(false)
                              setCommittedQuery(groupsSearch)
                            }}
                          >
                            All states
                          </button>
                          {filteredStates.map((s, idx) => (
                            <button
                              key={s}
                              type="button"
                              className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground ${idx === stateHighlightIndex ? 'bg-accent text-accent-foreground' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onMouseEnter={() => setStateHighlightIndex(idx)}
                              onClick={() => {
                                setStateInput(s)
                                setStateQuery(s)
                                setStateOpen(false)
                                setCommittedQuery(groupsSearch)
                              }}
                            >
                              {s}
                            </button>
                          ))}
                          {filteredStates.length === 0 && (
                            <div className="px-3 py-2 text-muted-foreground">No results</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => { setCommittedQuery(groupsSearch); setMobileFiltersOpen(false) }}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Clear selected filters
                    setSelectedCondition('')
                    setSelectedRegion('')
                    setStateInput('')
                    setJoinedOnly(false)
                    setSortBy('relevance')
                    // Clear search inputs and committed query
                    setCommittedQuery('')
                    setGroupsSearch('')
                    // Clear combobox queries and close dropdowns
                    setSymptomQuery('')
                    setRegionQuery('')
                    setStateQuery('')
                    setSymptomOpen(false)
                    setRegionOpen(false)
                    setStateOpen(false)
                    // Reset keyboard highlight indices
                    setSymptomHighlightIndex(-1)
                    setRegionHighlightIndex(-1)
                    setStateHighlightIndex(-1)
                    // Optionally close the filters panel
                    setMobileFiltersOpen(true)
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="text-xs">
                  <span className="mr-2">{chip.label}</span>
                  <button className="text-xs" onClick={chip.onClear}> X </button>
                </Badge>
              ))}
            </div>
          )}
        
   

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
       
        {(communitiesError || joinedError) && !communitiesLoading && !joinedLoading && (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">{communitiesError || joinedError}</CardContent>
          </Card>
        )}
        {(() => {
          // Derive joined vs discoverable lists
          const searchTerm = groupsSearch.trim().toLowerCase()
          const joinedIds = new Set(joinedCommunities.map((c) => c._id))
          const discoverable = communities.filter((c) => !joinedIds.has(c._id))
          let filteredJoined = searchTerm
            ? joinedCommunities.filter((c) =>
                String(c.title ?? '').toLowerCase().includes(searchTerm) ||
                String(c.description ?? '').toLowerCase().includes(searchTerm)
              )
            : joinedCommunities
          let filteredDiscover = searchTerm
            ? discoverable.filter((c) =>
                String(c.title ?? '').toLowerCase().includes(searchTerm) ||
                String(c.description ?? '').toLowerCase().includes(searchTerm)
              )
            : discoverable

          // Client-side sorting
          const sortByMembers = (a: Community, b: Community) => ((b.memberCount as number) ?? 0) - ((a.memberCount as number) ?? 0)
          const sortByRecent = (a: Community, b: Community) => {
            const ad = a && (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0
            const bd = b && (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0
            return bd - ad
          }
          if (sortBy === 'members') {
            filteredJoined = [...filteredJoined].sort(sortByMembers)
            filteredDiscover = [...filteredDiscover].sort(sortByMembers)
          } else if (sortBy === 'recent') {
            filteredJoined = [...filteredJoined].sort(sortByRecent)
            filteredDiscover = [...filteredDiscover].sort(sortByRecent)
          }

          if (joinedOnly) {
            filteredDiscover = []
          }

          const showEmpty = !joinedLoading && !communitiesLoading &&
            !joinedError && !communitiesError &&
            filteredJoined.length === 0 && filteredDiscover.length === 0

          return (
            <>
              {showEmpty && (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">No communities found.</CardContent>
                </Card>
              )}

              {filteredDiscover.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold">Discover Communities</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredDiscover.map((c) => {
                      const members = (c.memberCount as number) ?? 0
                      const isPrivate = Boolean(c.isPrivate)
                      const isAdmin = isAdminOf(c)
                      const activity = typeof c.posts === 'number'
                        ? (c.posts > 200 ? 'Very Active' : c.posts > 50 ? 'Active' : 'Moderate')
                        : 'Active'
                      return (
                          <Card
                            key={c._id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              const t = e.target as HTMLElement | null
                              if (t && t.closest('button, a, input, textarea, select')) return
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                const slug = (c as any).slug || c._id || (c as any).id
                                router.push(`/community/community/${encodeURIComponent(String(slug))}`)
                              }
                            }}
                            onClick={(e) => {
                              const t = e.target as HTMLElement | null
                              if (t && t.closest('button, a, input, textarea, select')) return
                              const slug = (c as any).slug || c._id || (c as any).id
                              router.push(`/community/community/${encodeURIComponent(String(slug))}`)
                            }}
                          >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{c.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        // @ts-ignore
                                        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        // @ts-ignore
                                        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                                        const id = (c as any)._id || (c as any).id || (c as any).slug
                                        router.push(`/community/community-admin/${encodeURIComponent(String(id))}`)
                                      }}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                      title="Community admin"
                                      aria-label="Open admin dashboard"
                                    >
                                      <Crown className="h-4 w-4" />
                                      <span className="sr-only">Admin</span>
                                    </button>
                                  )}
                                {isPrivate && <Shield className="h-4 w-4 text-muted-foreground" />}
                              </div>
                            </div>
                            <CardDescription>{c.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{members} members</span>
                                <Badge variant={activity === 'Very Active' ? 'default' : 'secondary'} className="text-xs">
                                  {activity}
                                </Badge>
                              </div>
                            </div>
                              <Button className="w-full" onClick={(e) => e.stopPropagation()}>Join</Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              )}

              {filteredJoined.length > 0 && (
                <section className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredJoined.map((c) => {
                      const members = (c.memberCount as number) ?? 0
                      const isPrivate = Boolean(c.isPrivate)
                      const isAdmin = isAdminOf(c)
                      const activity = typeof c.posts === 'number'
                        ? (c.posts > 200 ? 'Very Active' : c.posts > 50 ? 'Active' : 'Moderate')
                        : 'Active'
                      return (
                        <Card
                          key={`joined-${c._id}`}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            const t = e.target as HTMLElement | null
                            if (t && t.closest('button, a, input, textarea, select')) return
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              const slug = (c as any).slug || c._id || (c as any).id
                              router.push(`/community/community/${encodeURIComponent(String(slug))}`)
                            }
                          }}
                          onClick={(e) => {
                            const t = e.target as HTMLElement | null
                            if (t && t.closest('button, a, input, textarea, select')) return
                            const slug = (c as any).slug || c._id || (c as any).id
                            router.push(`/community/community/${encodeURIComponent(String(slug))}`)
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{c.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      // @ts-ignore
                                      if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      // @ts-ignore
                                      if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                                      const id = (c as any)._id || (c as any).id || (c as any).slug
                                      router.push(`/community/community-admin/${encodeURIComponent(String(id))}`)
                                    }}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    title="Community admin"
                                    aria-label="Open admin dashboard"
                                  >
                                    <Crown className="h-4 w-4" />
                                    <span className="sr-only">Admin</span>
                                  </button>
                                )}
                                {isPrivate && <Shield className="h-4 w-4 text-muted-foreground" />}
                              </div>
                            </div>
                            <CardDescription>{c.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{members} members</span>
                                <Badge variant={activity === 'Very Active' ? 'default' : 'secondary'} className="text-xs">
                                  {activity}
                                </Badge>
                              </div>
                            </div>
                            <Button className="w-full" variant="secondary" disabled onClick={(e) => e.stopPropagation()}>
                              Joined
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}

export default CommunitiesPage
export { CommunitiesPage }
