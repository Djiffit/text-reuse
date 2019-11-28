import { FilterState, UpdateFiltersAction } from 'types/types'

const initialFilters = {
    textTitle: '',
    authorTitle: '',
    yearStart: '',
    yearEnd: '',
    location: '',
    internal: false,
    external: false,
}

export const filterReducer = (state = initialFilters, action: UpdateFiltersAction): FilterState => {
    console.log(state)
    switch (action.type) {
        case 'UPDATE_FILTERS':
            return action.filters
        default:
            return state
    }

}
