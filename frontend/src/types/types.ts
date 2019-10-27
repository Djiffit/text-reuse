export interface FilterState {
    textTitle: string
    authorTitle: string
    year: string
    location: string
}

export interface UpdateFiltersAction {
    type: 'UPDATE_FILTERS'
    filters: FilterState
}

export type FilterKeys = 'textTitle' | 'authorTitle' | 'year' | 'location'
