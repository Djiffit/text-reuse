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
import { TextField, Tab, Tabs } from '@material-ui/core'
import edges from '../dummyData/edges'
import nodes from '../dummyData/nodes'
import ResponsiveOrdinalFrame from 'semiotic/lib/ResponsiveOrdinalFrame'
import { GraphFilters } from './FilterView'
import styled from 'styled-components'


const GridWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 3fr;
`
const GraphWrapper = () => {
    const [filters, setFilters] = useState({
        id: '',
        title: '',
        location: '',
        yearStart: 1,
        yearEnd: 2000,
        author: '',
        key: 'id',
        hideSubFiltered: false,
    }) as any

    console.log(filters)

    return (<GridWrapper>
        <GraphFilters filters={filters} setFilters={setFilters} />
        <GraphList graphFilters={filters} />
    </GridWrapper>)
}

const mapToQueryFilters = (f: FilterState) => {
    const filters = {
        title: f.textTitle || 'Death',
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

const filterNodes = (filters, nodes) => {
    const { title, id, yearEnd, yearStart, location, author } = filters
    return nodes.filter(node => node.title.includes(title) && node.id.includes(id) && node.year <= yearEnd && node.year >= yearStart && node.location.includes(location) && node.author.includes(author))
}

const GraphList = ({ graphFilters }) => {
    const [active, setActive] = useState(new Set([]))
    const [activeNode, setActiveNode] = useState({}) as any
    const [value, setValue] = useState(0)
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
    let reuses = edges
    let texts = nodes

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }


    const a11yProps = (index: any) => {
        return {
            'id': `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        }
    }

    const textsById = {}
    texts.forEach(t => textsById[t.id] = t)

    const originalSources = Array.from(new Set(reuses.map(r => r.source)))
    const sources = new Set(filterNodes(graphFilters, originalSources.map((id: any) => textsById[id])).map(n => n.id))
    const sourceByKey = new Set(Array.from(sources).map((k: any) => textsById[k][graphFilters.key]))
    if (graphFilters.hideSubFiltered) {
        reuses = reuses.filter(({ source }) => sources.has(source))
    }

    const targetsForFilter = (Array.from((new Set(reuses.filter(({ source }) => sources.has(source)).map(({ reuser }) => reuser))))).map((reuser: any) => textsById[reuser])

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

    texts = texts.filter(t => t.input + t.output > 0)
    console.log(texts.length, texts)

    const filteredTexts = new Set(Object.values(textsById).filter((t: any) => {
        return (t.output + t.input) > 200
    }).map((t: any) => ({ id: t.id, count: t.output + t.input })).sort((a, b) => a.count > b.count ? 1 : -1).splice(0, 100).map((t) => t.id))


    // console.log(Object.values(texts_by_id), texts_by_id, texts)

    return <div>
        <CSVLink filename={'text-reuse-export.csv'} data={makeCSV(reuses, texts)}>Download data as CSV</CSVLink>
        <Paper style={{ marginRight: '50px', maxWidth: '70vw' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor='primary'
                textColor='primary'
                variant='fullWidth'
                aria-label='full width tabs example'
            >
                <Tab label='Graph visualization' {...a11yProps(0)} />
                <Tab label='Node and edge visualization' {...a11yProps(1)} />
                <Tab label='Node data list' {...a11yProps(2)} />
            </Tabs>
            {<div style={{ display: value !== 0 ? 'none' : 'inherit' }}>
                {activeNode && value === 0 && activeNode.id && <Paper style={{ padding: '10px', position: 'absolute', marginLeft: '30px', marginTop: '30px', zIndex: 1000000, backgroundColor: 'white', width: '300px' }}>
                    {activeNode.id && <p style={{ margin: 0 }}><b>ID:</b> {activeNode.id}</p>}
                    {activeNode.title && <p style={{ margin: 0 }}><b>Title:</b> {activeNode.title}</p>}
                    {activeNode.author && <p style={{ margin: 0 }}><b>Authors:</b> {activeNode.author.split('|||').join(', ')}</p>}
                    {activeNode.location && <p style={{ margin: 0 }}><b>Location:</b> {activeNode.location}</p>}
                    {activeNode.year && <p style={{ margin: 0 }}><b>Year:</b> {activeNode.year}</p>}
                </Paper>}
                <GraphVis idKey={graphFilters.key} sources={graphFilters.key === 'id' ? sources : sourceByKey} setActiveNode={setActiveNode} nodesById={textsById} texts={texts} reuses={reuses} />
            </div>}
            {<div style={{ display: value !== 1 ? 'none' : 'inherit' }}><Visualizations nodes={texts} filteredTexts={filteredTexts} edges={reuses} /></div>}
            {<div style={{ display: value !== 2 ? 'none' : 'inherit' }}><NodeLists reuses={reuses} sources={sources} texts={texts} textsById={textsById} /></div>}
        </Paper>
    </div >
}

const GraphVis = ({ texts, sources, reuses, setActiveNode, nodesById, idKey }) => {
    const [frozen, setFrozen] = useState(60000)
    if (idKey !== 'id' && frozen !== 60000) {
        setFrozen(60000)
    }
    const nodearr = idKey === 'id' ? texts : Array.from(new Set(texts.map(t => t[idKey]))).map(k => [k].reduce((p: any, c: any) => {
        p[idKey] = c
        return p
    }, {}))

    console.log(idKey)
    return (
        <div>
            <ForceGraph2D
                graphData={{ nodes: nodearr, links: reuses.map(({ source, reuser, count }) => ({ source: nodesById[source][idKey], target: nodesById[reuser][idKey], value: count })).filter(({ source, target }) => source !== target) }}
                width={window.innerWidth * 0.7}
                nodeId={idKey}
                onNodeClick={(node) => {
                    if (idKey === 'id') {
                        setFrozen(0)
                    }
                    setActiveNode(node)
                }}
                height={window.innerHeight * 0.8}
                nodeAutoColorBy='group'
                linkWidth={((d) => Math.log(d.value) / 2)}
                enableNodeDrag={false}
                cooldownTime={frozen}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node[idKey]
                    const fontSize = 11 / globalScale
                    ctx.font = `${fontSize}px Sans-Serif`
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    if (sources.has(node[idKey])) {
                        ctx.fillStyle = 'red'
                    } else {
                        ctx.fillStyle = 'blue'
                    }
                    ctx.fillText(label, node.x, node.y)
                }}
            />
        </div >
    )
}

const Visualizations = ({ nodes, edges, filteredTexts }) => {

    const authors = nodes.map(n => n.author.split('|||'))// .reduce((e, s) => ([...e, s.name]), []))
    const authorCounts = {}

    const years = nodes.map(n => n.year) // .reduce((e, s) => ([...e, s.name]), [])))
    const yearCounts = {}

    const locations = nodes.map(n => n.location) // .reduce((e, s) => ([...e, s.name]), [])))
    const locCounts = {}



    authors.forEach(y => {
        authorCounts[y] = (authorCounts[y] || 0) + 1
    })

    years.forEach(y => {
        yearCounts[y] = (yearCounts[y] || 0) + 1
    })

    locations.forEach(y => {
        locCounts[y] = (locCounts[y] || 0) + 1
    })



    const counts = Object.entries(authorCounts).map((textCount) => ({ name: textCount[0], texts: textCount[1] })).sort((a: any, b: any) => a.texts > b.texts ? -1 : 1)

    const countsY = Object.entries(yearCounts).map((count) => ({ year: count[0], titles: count[1] })).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)
    const countsL = Object.entries(locCounts).map((count) => ({ location: count[0], titles: count[1] })).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)


    const framePropsA = {
        data: counts.slice(0, 20),
        size: [1000, 1000],
        type: 'bar',
        projection: 'horizontal',
        oAccessor: 'name',
        rAccessor: 'texts',
        title: 'Most Common Authors',
        axes: [{
            orient: 'left',
            label: 'Number of Titles',
        }],
        style: { fill: '#ac58e5', stroke: 'white' },
        hoverAnnotation: true,
        oLabel: false,
    }

    const framePropsL = {
        data: countsL.slice(0, 10),
        size: [1000, 1000],
        type: 'bar',
        oAccessor: 'location',
        rAccessor: 'titles',
        title: 'Most Common Locations',
        axes: [{
            orient: 'left',
            label: 'Number of Titles',
        }],

        projection: 'horizontal',

        style: { fill: '#ac58e5', stroke: 'white' },
        hoverAnnotation: true,
        horizontal: true,
        oLabel: true,
    }

    const framePropsY = {
        data: countsY.slice(0, 20),
        horizontal: true,
        size: [1000, 1000],
        type: 'bar',
        oAccessor: 'year',
        rAccessor: 'titles',
        title: 'Most Common Years',
        axes: [{
            orient: 'left',
            label: 'Number of Titles',
        }],

        projection: 'horizontal',

        style: { fill: '#ac58e5', stroke: 'white' },
        hoverAnnotation: true,
        oLabel: true,
    }


    const theme = ['#ac58e5', '#E0488B', '#9fd0cb', '#e0d33a', '#7566ff', '#533f82', '#7a255d', '#365350', '#a19a11', '#3f4482']
    const frameProps = {
        nodes: nodes.filter(t => filteredTexts.has(t.id)),
        edges: edges.filter(r => filteredTexts.has(r.source) && filteredTexts.has(r.reuser)).map(r => ({ source: r.source, target: r.reuser, value: r.count })),
        size: [1200, 1200],
        margin: { left: 60, top: 60, bottom: 10, right: 10 },
        networkType: 'matrix',
        nodeIDAccessor: 'id',
        linkColor: 'rgb(255, 0, 0)',
        nodeStyle: { fill: 'none', stroke: '#DDD' },
        edgeStyle: d => {
            // console.log(d)
            return {
                fill: 'rgb(250,0,0)', // `rgb(${d.value}, 0, 0)`,
                stroke: theme['#ac58e5'], // d.source.group + 1],
                fillOpacity: 0.75,
            }
        },
        hoverAnnotation: [{ type: 'frame-hover' },
        { type: 'highlight', style: { fill: '#ac58e5', fillOpacity: 0.25, stroke: '#E0488B' } }],
        nodeLabels: true,
    }
    return (
        <div style={{ marginLeft: '100px' }}>
            <NetworkFrame {...frameProps} />
            <ResponsiveOrdinalFrame
                {...framePropsA}
                responsiveWidth={true}
            />
            <ResponsiveOrdinalFrame
                {...framePropsY}
                responsiveWidth={true}
            />
            <ResponsiveOrdinalFrame
                {...framePropsL}
                responsiveWidth={true}
            />
        </div>)
}


const makeNodeCSV = (nodes) => {
    const columns = ['id', 'title', 'year', 'author', 'location', 'as reuser', 'as source']
    const rows = nodes.map(({ id, title, year, author, location, input, output }) => [id, title, year, author, location, input, output])

    return [
        columns,
        ...rows,
    ]
}

const NodeLists = ({ texts, reuses, sources, textsById }) => {
    const [filters, setFilters] = useState({
        id: '',
        title: '',
        location: '',
        yearStart: 1,
        yearEnd: 2000,
        author: '',
    }) as any
    const { id, title, location, yearStart, yearEnd, author } = filters
    const nodes = texts.filter(node => sources.has(node.id) && node.title.includes(title) && node.id.includes(id) && node.year <= yearEnd && node.year >= yearStart && node.location.includes(location) && node.author.includes(author))
    const newSources = new Set(nodes.map(n => n.id))
    const targetsForFilter = (Array.from((new Set(reuses.filter(({ source }) => newSources.has(source)).map(({ reuser }) => reuser))))).map((reuser: any) => textsById[reuser])
    return (<div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '1', marginRight: '10px' }}>
            <h3 style={{ textAlign: 'center' }}>Source nodes list ({nodes.length} nodes), displaying up to 300, <CSVLink filename={'text-reuse-source-nodes.csv'} data={makeNodeCSV(nodes)}>download CSV</CSVLink></h3>
            <NodeFilter filters={filters} setFilters={setFilters} />
            <NodeList allNodes={nodes.splice(0, 300)} type={'source'} />
        </div>
        <div style={{ flex: '1' }}>
            <h3 style={{ textAlign: 'center' }}>Reuser nodes list ({targetsForFilter.length} nodes), displaying up to 300, <CSVLink filename={'text-reuse-target-nodes.csv'} data={makeNodeCSV(targetsForFilter)}>download CSV</CSVLink></h3>
            <NodeList allNodes={targetsForFilter.splice(0, 300)} type={'reuser'} />
        </div>
    </div>)
}

const NodeList = ({ allNodes, type }) => {
    return <Paper>
        <Table aria-label='simple table'>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align='right'>Title</TableCell>
                    <TableCell align='right'>Year</TableCell>
                    <TableCell align='right'>Location</TableCell>
                    <TableCell align='right'>Author</TableCell>
                    <TableCell align='right'>As reuser</TableCell>
                    <TableCell align='right'>As source</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {allNodes.length < 500 && allNodes.map(t => (
                    <TableRow key={t.id + type} >
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
}

const NodeFilter = ({ setFilters, filters }) => {
    return <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', marginRight: '20px' }}>
        <TextField
            id='outlined-name'
            key={'id'}
            label={'Text id'}
            value={filters.id || ''}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
        <TextField
            id='outlined-name'
            key={'title'}
            label={'Text title'}
            value={filters.title || ''}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
        <TextField
            id='outlined-name'
            key={'location'}
            label={'Location'}
            value={filters.location || ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
        <TextField
            id='outlined-name'
            key={'yearStart'}
            label={'Year begin'}
            value={filters.yearStart || ''}
            onChange={(e) => setFilters({ ...filters, yearStart: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
        <TextField
            id='outlined-name'
            key={'yearEnd'}
            label={'Year end'}
            value={filters.yearEnd || ''}
            onChange={(e) => setFilters({ ...filters, yearEnd: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
        <TextField
            id='outlined-name'
            key={'author'}
            label={'Author'}
            value={filters.author || ''}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            margin='normal'
            variant='outlined'
            style={{ flex: 1 }}
        />
    </div>
}

export default GraphWrapper
