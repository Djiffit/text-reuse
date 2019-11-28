export interface FilterState {
    textTitle: string
    authorTitle: string
    yearStart: string
    yearEnd: string
    location: string
    internal: boolean
    external: boolean
}

export interface UpdateFiltersAction {
    type: 'UPDATE_FILTERS'
    filters: FilterState
}

export type FilterKeys = 'textTitle' | 'authorTitle' | 'yearEnd' | 'location' | 'yearStart' | 'internal' | 'external'
