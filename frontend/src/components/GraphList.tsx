import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_CONNECTIONS } from 'graphql/Query'
import { FilterState } from 'types/types'
import { useSelector } from 'react-redux'
import NetworkFrame from 'semiotic/lib/NetworkFrame'


const mapToQueryFilters = (filters: FilterState) => {
    const filterObject = {} as any
    if (filters.textTitle) {
        filterObject.title_contains = filters.textTitle
    }
    if (filters.authorTitle) {
        filterObject.author_in = [
            { name_contains: filters.authorTitle },
        ]
    }
    if (filters.year) {
        filterObject.publication_year = {
            year: filters.year,
        }
    }
    return filterObject
}

const GraphList = () => {
    const filters = useSelector((state: FilterState) => state)
    const { loading, error, data } = useQuery(GET_CONNECTIONS, {
        variables: {
            filter: mapToQueryFilters(filters),
        },
        fetchPolicy: 'no-cache',
    })


    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (error) {
        return <div>
            error :()
        </div>
    }


    const nodes = (new Set([])) as any
    const edges = (new Set([])) as any

    data.Text.forEach((n: any) => {
        nodes.add({ text_id: n.text_id, title: n.title })
        n.copies_from.forEach((c: any) => {
            edges.add({ source: n.text_id, target: c.text_id })
        })
    })

    console.log(nodes.size, edges.length)

    return <div>
        <p>Graphq list</p>
        <NetworkFrame
            nodes={nodes}
            edges={Array.from(edges)}
            nodeIDAccessor={'text_id'}
            nodeSizeAccessor={2}
            edgeStyle={{ stroke: '#9fd0cb', fill: 'none' }}
            networkType={{ type: 'force', forceManyBody: -250, distanceMax: 500, edgeStrength: 2 }}
        />
    </div>
}

export default GraphList
