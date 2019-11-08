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

    const cache = {}

    data.Text.forEach((n: any) => {
        if (!cache[n.text_id]) {
            nodes.add({ text_id: n.text_id, title: n.title, author: n.author, location: n.publication_location && n.publication_location.place, year: n.publication_year.year })
            cache[n.text_id] = true
        }
        n.copies_from.forEach((c: any) => {
            if (!cache[n.text_id + c.text_id]) {
                edges.add({ source: n.text_id, target: c.text_id })
                cache[n.text_id + c.text_id] = true
            }

            if (!cache[c.text_id]) {
                nodes.add({ text_id: c.text_id, title: c.title, author: c.author, location: c.publication_location && c.publication_location.place, year: c.publication_year.year })
                cache[c.text_id] = true
            }
        })
    })

    console.log(nodes.size, edges.length)
    console.log(data)

    return <div>
        <p>Graphq list</p>
        <NetworkFrame
            nodes={Array.from(nodes)}
            edges={Array.from(edges)}
            nodeIDAccessor={'text_id'}
            nodeSizeAccessor={2}
            edgeStyle={{ stroke: '#9fd0cb', fill: 'none' }}
            networkType={{ type: 'force', forceManyBody: -250, distanceMax: 500, edgeStrength: 2 }}
        />
        {JSON.stringify(Array.from(edges), null, 4)}
    </div>
}

export default GraphList
