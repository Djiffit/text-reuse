import React from 'react'
import styled from 'styled-components'
import { Paper, TextField, Divider, Checkbox, FormControlLabel, Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { FilterState, FilterKeys } from 'types/types'
import { Link } from 'react-router-dom'
import Visualizer from './Visualization'

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

const FilterView = () => {
    const filters = useSelector((state: FilterState) => state)
    const dispatch = useDispatch()
    const visualizing = window.location.pathname.includes('visualize')

    const updateValue = (key: FilterKeys, newVal: string) => {
        filters[key] = newVal
        dispatch({ type: 'UPDATE_FILTERS', filters: JSON.parse(JSON.stringify(filters)) })
    }

    return <Wrapper>
        <Visualizer />
        <Paper elevation={5} style={{ padding: '20px 50px', minHeight: '90vh' }}>
            <Title>
                Filters
            </Title>

            <Divider style={{ marginBottom: '20px' }} />

            {Object.entries(filters).map(arr => <TextField
                id='outlined-name'
                key={arr[0]}
                label={arr[0]}
                value={arr[1]}
                onChange={(e) => updateValue(arr[0] as FilterKeys, e.target.value)}
                margin='normal'
                variant='outlined'
                disabled={visualizing}
                style={{ width: '100%' }}
            />)}
            <CheckBoxGroup>
                <FormControlLabel
                    control={
                        <Checkbox value='checkedA' disabled={visualizing} />
                    }
                    label='External only'
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={true} disabled={visualizing} />
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
