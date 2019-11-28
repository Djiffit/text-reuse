import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_CONNECTIONS } from 'graphql/Query'
import { FilterState } from 'types/types'
import { useSelector } from 'react-redux'
import NetworkFrame from 'semiotic/lib/NetworkFrame'
import ForceGraph2D from 'react-force-graph-2d'
import { CSVLink } from 'react-csv'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { TextField } from '@material-ui/core'
import edges from '../dummyData/edges'
import nodes from '../dummyData/nodes'

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
    const [active, setActive] = useState(new Set([]))
    const filters = useSelector((state: FilterState) => state)
    // const { loading, error, data } = useQuery(GET_CONNECTIONS, {
    //     variables: {
    //         ...mapToQueryFilters(filters),
    //     },
    //     fetchPolicy: 'no-cache',
    // })

    // if (loading) {
    //     return <div>
    //         Loading...
    //     </div>
    // }

    // if (error) {
    //     return <div>
    //         error :()
    //     </div>
    // }

    // const { reuses, texts } = data.reuses
    const reuses = edges
    const texts = nodes

    console.log(JSON.stringify(texts))

    const sources = new Set([]) as any

    reuses.forEach(r => sources.add(r.source))

    const textsById = {}
    texts.forEach(t => textsById[t.id] = t)

    const targetsForFilter = reuses.filter(({ source }) => sources.has(source)).map(({ reuser }) => textsById[reuser])


    // const texts_by_id = {}

    // texts.forEach(t => texts_by_id[t.id] = t)

    reuses.forEach(({ source, reuser, count }) => {
        try {
            textsById[source].output = textsById[source].output || 0 + count
            textsById[reuser].input = textsById[reuser].input || 0 + count

            textsById[source].input = textsById[source].input || 0
            textsById[reuser].output = textsById[reuser].output || 0
        } catch (e) {
            console.log(e, source, reuser)
        }
    })

    const filteredTexts = new Set(Object.values(textsById).filter((t: any) => {
        return (t.output + t.input) > 200
    }).map((t: any) => ({ id: t.id, count: t.output + t.input })).sort((a, b) => a.count > b.count ? 1 : -1).splice(0, 100).map((t) => t.id))

    const theme = ['#ac58e5', '#E0488B', '#9fd0cb', '#e0d33a', '#7566ff', '#533f82', '#7a255d', '#365350', '#a19a11', '#3f4482']
    const frameProps = {
        nodes: texts.filter(t => filteredTexts.has(t.id)),
        edges: reuses.filter(r => filteredTexts.has(r.source) && filteredTexts.has(r.reuser)).map(r => ({ source: r.source, target: r.reuser, value: r.count })),
        size: [1400, 1400],
        margin: { left: 60, top: 60, bottom: 10, right: 10 },
        networkType: 'matrix',
        nodeIDAccessor: 'id',
        nodeStyle: { fill: 'none', stroke: '#DDD' },
        edgeStyle: d => {
            // console.log(d)
            return {
                fill: `rgb(${d.value}, 0, 0)`,
                stroke: theme[d.source.group + 1],
                fillOpacity: 0.75,
            }
        },
        hoverAnnotation: [{ type: 'frame-hover' },
        { type: 'highlight', style: { fill: '#ac58e5', fillOpacity: 0.25, stroke: '#E0488B' } }],
        nodeLabels: true,
    }


    // console.log(Object.values(texts_by_id), texts_by_id, texts)
    console.log(reuses.length, texts.length)

    return <div>
        <p>Graph results</p>
        <CSVLink data={makeCSV(reuses, texts)}>Download data as CSV</CSVLink>
        <ForceGraph2D
            graphData={{ nodes: texts, links: reuses.map(({ source, reuser }) => ({ source, target: reuser })) }}
            width={1400}
            onNodeClick={(node) => console.log(node)}
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
        <NetworkFrame {...frameProps} />
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
        {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
                <Paper>
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        id='outlined-name'
                                        key={'id'}
                                        label={'Text id'}
                                        margin='normal'
                                        variant='outlined'
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    <TextField
                                        id='outlined-name'
                                        key={'title'}
                                        label={'Text title'}
                                        margin='normal'
                                        variant='outlined'
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    <TextField
                                        id='outlined-name'
                                        key={'year'}
                                        label={'Year'}
                                        margin='normal'
                                        variant='outlined'
                                    />
                                </TableCell>
                                <TableCell align='right'>

                                    <TextField
                                        id='outlined-name'
                                        key={'location'}
                                        label={'Location'}
                                        margin='normal'
                                        variant='outlined'
                                    />

                                </TableCell>
                                <TableCell align='right'>
                                    <TextField
                                        id='outlined-name'
                                        key={'author'}
                                        label={'Author'}
                                        margin='normal'
                                        variant='outlined'
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    Inbound
                                </TableCell>
                                <TableCell align='right'>
                                    Outbound
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {texts.filter(t => sources.has(t.id)).map(t => (
                                <TableRow key={t.id}>
                                    <TableCell component='th' scope='row'>
                                        {t.id}
                                    </TableCell>
                                    <TableCell align='right'>{t.title}</TableCell>
                                    <TableCell align='right'>{t.year}</TableCell>
                                    <TableCell align='right'>{t.location}</TableCell>
                                    <TableCell align='right'>{t.author}</TableCell>
                                    <TableCell align='right'>{t.input}</TableCell>
                                    <TableCell align='right'>{t.output}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
            <div style={{ flex: '1' }}>
                <Paper>
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align='right'>Title</TableCell>
                                <TableCell align='right'>Year</TableCell>
                                <TableCell align='right'>Location</TableCell>
                                <TableCell align='right'>Author</TableCell>
                                <TableCell align='right'>Input</TableCell>
                                <TableCell align='right'>Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {targetsForFilter.map(t => (
                                <TableRow key={t.id} >
                                    <TableCell component='th' scope='row'>
                                        {t.id}
                                    </TableCell>
                                    <TableCell align='right'>{t.title}</TableCell>
                                    <TableCell align='right'>{t.year}</TableCell>
                                    <TableCell align='right'>{t.location}</TableCell>
                                    <TableCell align='right'>{t.author}</TableCell>
                                    <TableCell align='right'>{t.input}</TableCell>
                                    <TableCell align='right'>{t.output}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </div> */}
    </div>
}

export default GraphList
