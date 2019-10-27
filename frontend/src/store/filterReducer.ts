import { FilterState, UpdateFiltersAction } from 'types/types'

const initialFilters = {
    textTitle: '',
    authorTitle: '',
    year: '',
    location: '',
}

export const filterReducer = (state = initialFilters, action: UpdateFiltersAction): FilterState => {
    switch (action.type) {
        case 'UPDATE_FILTERS':
            return action.filters
        default:
            return state
    }

}
