import React from 'react'
import styled from 'styled-components'
import { Paper, TextField, Divider, Checkbox, FormControlLabel, Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { FilterState, FilterKeys } from 'types/types'
import { Link } from 'react-router-dom'
import Visualizer from './Visualization'
import { YEAR_FIELD, YEAR_START, YEAR_END } from 'util/constants'

const Wrapper = styled.div`
    margin: 30px;
    min-width: 310px;
`
const Title = styled.h3`
    font-size: 20px;
`

const CheckBoxGroup = styled.div`
    margin: 20px 10px 30px 10px;
`

const YearWrap = styled.div`
    display: flex;
    flex-direction: row;
`

const Dash = styled.p`
    flex: 1 1 0%;
    text-align: center;
    align-self: center;
    font-size: 50px;
    margin: 0;
`

const FilterView = () => {
    const filters = useSelector((state: FilterState) => state)
    const dispatch = useDispatch()
    const visualizing = window.location.pathname.includes('visualize')

    const updateValue = (key: string, newVal: any) => {
        filters[key] = newVal
        dispatch({ type: 'UPDATE_FILTERS', filters: JSON.parse(JSON.stringify(filters)) })
    }

    const YearPicker = (start: string, end: string) => {
        return <YearWrap>
            <TextField
                id='outlined-name'
                key={YEAR_START}
                label={'Year begin'}
                value={start}
                onChange={(e) => updateValue(YEAR_START, e.target.value)}
                margin='normal'
                variant='outlined'
                disabled={visualizing}
                style={{ flex: '3' }}
            />
            <Dash>
                -
            </Dash>
            <TextField
                id='outlined-name'
                key={YEAR_END}
                label={'Year end'}
                value={end}
                onChange={(e) => updateValue(YEAR_END, e.target.value)}
                margin='normal'
                variant='outlined'
                disabled={visualizing}
                style={{ flex: '3' }}
            />
        </YearWrap>
    }

    const createInput = (arr: string[]) => {
        const [label, value] = [arr[0], arr[1]]
        if (['internal', 'external'].includes(label)) {
            return <div />
        }

        return <TextField
            id='outlined-name'
            key={arr[0]}
            label={arr[0]}
            value={arr[1]}
            onChange={(e) => updateValue(arr[0], e.target.value)}
            margin='normal'
            variant='outlined'
            disabled={visualizing}
            style={{ width: '100%' }}
        />
    }

    return <Wrapper>
        <Paper elevation={5} style={{ padding: '20px 50px', minHeight: '90vh' }}>
            <Title>
                Filters
            </Title>

            <Divider style={{ marginBottom: '20px' }} />

            {Object.entries(filters).filter(arr => !arr[0].includes('year')).map(arr => createInput(arr))}
            {YearPicker(filters.yearStart, filters.yearEnd)}
            <CheckBoxGroup>
                <FormControlLabel
                    control={
                        <Checkbox value={filters.external} onChange={(e) => updateValue('external', e.target.checked)} disabled={visualizing} />
                    }
                    label='External only'
                />
                <FormControlLabel
                    control={
                        <Checkbox value={filters.internal} onChange={(e) => updateValue('internal', e.target.checked)} disabled={visualizing} />
                    }
                    label='Internal only'
                />
            </CheckBoxGroup>
            {<Link to={visualizing ? '/' : '/visualize'}>
                <Button style={{ width: '100%' }} variant='contained' color='secondary'>
                    {visualizing ? 'Back' : 'Search'}
                </Button>
            </Link>}
        </Paper>
    </Wrapper>
}

export default FilterView
