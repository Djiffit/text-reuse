import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_CONNECTIONS } from 'graphql/Query'
import { FilterState } from 'types/types'
import { useSelector } from 'react-redux'
// import NetworkFrame from 'semiotic/lib/NetworkFrame'
import ForceGraph2D from 'react-force-graph-2d'
import { CSVLink } from 'react-csv'

const mapToQueryFilters = (f: FilterState) => {
    const filters = {
        title: f.textTitle,
        author: f.authorTitle,
        yearStart: f.yearStart && Number(f.yearStart) || 0,
        yearEnd: f.yearEnd && Number(f.yearEnd) || 2000,
        location: f.location,
        internal: f.internal,
        external: f.external,
    } as any
    return filters
}

const makeCSV = (reuses, texts) => {
    const columns = ['source', 'target', 'weight', 'timeset', 'label']
    const textsById = {}
    texts.forEach(t => textsById[t.id] = t)
    const rows = reuses.map(({ source, reuser, count }) => [source, reuser, count, `[${textsById[source].year}, ${textsById[source].year}]`, textsById[source].title])

    return [
        columns,
        ...rows,
    ]
}

const GraphList = () => {
    const filters = useSelector((state: FilterState) => state)
    const { loading, error, data } = useQuery(GET_CONNECTIONS, {
        variables: {
            ...mapToQueryFilters(filters),
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

    const { reuses, texts } = data.reuses


    // const texts_by_id = {}

    // texts.forEach(t => texts_by_id[t.id] = t)

    // reuses.forEach(({ source, reuser, count }) => {
    //     try {
    //         texts_by_id[source].output = texts_by_id[source].output || 0 + count
    //         texts_by_id[reuser].input = texts_by_id[reuser].input || 0 + count

    //         texts_by_id[source].input = texts_by_id[source].input || 0
    //         texts_by_id[reuser].output = texts_by_id[reuser].output || 0
    //     } catch (e) {
    //         console.log(e, source, reuser)
    //     }
    // })

    // console.log(Object.values(texts_by_id), texts_by_id, texts)

    return <div>
        <p>Graph results</p>
        <CSVLink data={makeCSV(reuses, texts)}>Download data as CSV</CSVLink>
        <ForceGraph2D
            graphData={{ nodes: texts, links: reuses.map(({ source, reuser }) => ({ source, target: reuser })) }}
            width={1400}
            height={1200}
            nodeAutoColorBy='group'
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id
                const fontSize = 11 / globalScale
                ctx.font = `${fontSize}px Sans-Serif`
                const textWidth = ctx.measureText(label).width
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2) // some padding
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.color = 'black'
                ctx.fillStyle = node.color
                ctx.fillText(label, node.x, node.y)
            }}
        />
        {/* <NetworkFrame
            nodes={Object.values(texts_by_id)}
            edges={[]}
            size={[1000, 1000]}
            networkType={{ type: 'force', forceManyBody: -250, distanceMax: 500, edgeStrength: 2 }}

            nodeIDAccessor={'id'}
            sourceAccessor={'source'}
            targetAccessor={'target'}
            edgeWidthAccessor={'value'}


        /> */}
    </div>
}

export default GraphList
