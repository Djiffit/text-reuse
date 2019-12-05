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
import { TextField, Tab, Tabs, Button } from '@material-ui/core'
import edges from '../dummyData/edges'
import nodes from '../dummyData/nodes'
import ResponsiveOrdinalFrame from 'semiotic/lib/ResponsiveOrdinalFrame'
import { GraphFilters } from './FilterView'
import styled from 'styled-components'


const GridWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ToolTip = styled.div`
    background: white;
    position: relative;
    border: 1px solid #ddd;
    color: black;
    padding: 10px;
    z-index: 100;
    min-width: 120px;
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
        hideSubFiltered: true,
        sameYear: false,
        sameAuthor: true,
        sameLocation: false,
        sourceNodes: true,
        chartType: 'both',
        barAuthorFilter: '',
        barChartEntryStart: 0,
        barChartEntryEnd: 50,
    }) as any

    const [secret, setSecret] = useState('')

    const [sideBar, toggleBar] = useState(true)

    if (secret !== 'unicorn') {
        return  <TextField
        id='outlined-name'
        key={'secret'}
        label={'Secret'}
        value={secret || ''}
        onChange={(e) => setSecret(e.target.value)}
        margin='normal'
        variant='outlined'
        style={{ width: '100%' }}
    />
    }
    return (<GridWrapper>
        {sideBar && <div style={{flex: 1}}><GraphFilters filters={filters} setFilters={setFilters} /></div>}
        <div style={{flex: 4, zIndex: 12313123}}>
            <GraphList graphFilters={filters} />
            <div style={{position: 'fixed', left: '20px', bottom: '30px'}}>
                <Button variant='contained' color='secondary' onClick={() => toggleBar(!sideBar)}>Toggle side</Button>
            </div>
        </div>
    </GridWrapper>)
}

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

const filterNodes = (filters, nodes) => {
    const { title, id, yearEnd, yearStart, location, author } = filters
    return nodes.filter(node => node.title.includes(title) && node.id.includes(id) && node.year <= yearEnd && node.year >= yearStart && node.location.includes(location) && node.author.includes(author))
}

const GraphList = ({ graphFilters }) => {
    const [active, setActive] = useState(new Set([]))
    const [value, setValue] = useState(1)
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

    // let { reuses, texts } = data.reuses
    const reuse = [...edges]
    const text = [...nodes]
    const { sameYear, sameAuthor, hideSubFiltered, sameLocation, sourceNodes } = graphFilters

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }


    const a11yProps = (index: any) => {
        return {
            'id': `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        }
    }

    const getTextsById = (texts) => {
        const textsById = {}
        const t = texts.map(t => t)
        t.forEach(t => textsById[t.id] = {...t})

        return textsById

    }

    let textsById = getTextsById(text)

    const originalSources = Array.from(new Set(reuse.map(r => r.source)))
    const sources = new Set(filterNodes(graphFilters, originalSources.map((id: any) => textsById[id])).map(n => n.id))
    const sourceByKey = new Set(Array.from(sources).map((k: any) => textsById[k][graphFilters.key]))
    let reuses = reuse.map(r => r)
    if (hideSubFiltered || sameYear || sameAuthor || sameLocation || sourceNodes) {
        reuses = reuses.filter(({ source, reuser }) => (!hideSubFiltered || sources.has(source))
                                                        && (!sameYear || textsById[source].year !== textsById[reuser].year)
                                                        && (!sameAuthor || textsById[source].author !== textsById[reuser].author)
                                                        && (!sameLocation || textsById[source].location !== textsById[reuser].location)
                                                        && (!sourceNodes || !sources.has(reuser)))
    }

    const targetsForFilter = (Array.from((new Set(reuses.filter(({ source }) => sources.has(source)).map(({ reuser }) => reuser))))).map((reuser: any) => textsById[reuser])


    const addConnections = (textsById, reuses) => {
        const allNodes = new Set([]) as any
        reuses.forEach(({ source, reuser, count }) => {
            try {
                textsById[source].output = (textsById[source].output || 0) + count
                textsById[reuser].input = (textsById[reuser].input || 0) + count

                textsById[source].input = (textsById[source].input || 0)
                textsById[reuser].output = (textsById[reuser].output || 0)
                allNodes.add(source)
                allNodes.add(reuser)
            } catch (e) {
                console.log(e, source, reuser)
            }
        })
        return {textsById, allNodes}

    }

    const newData = addConnections(textsById, reuses)

    textsById = newData.textsById
    const allNodes = newData.allNodes

    const texts = text.filter((t: any) => allNodes.has(t.id)).map(t => ({...t, input: textsById[t.id].input, output: textsById[t.id].output}))

    return <div>
        <CSVLink filename={'text-reuse-export.csv'} data={makeCSV(reuses, texts)}>Download data as CSV</CSVLink>
        <Paper style={{ marginRight: '50px', marginLeft: '30px', maxWidth: '95%' }}>
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
            <div style={{ display: value !== 0 ? 'none' : 'inherit' }}>
                <GraphVis idKey={graphFilters.key} sources={graphFilters.key === 'id' ? sources : sourceByKey} nodesById={textsById} texts={texts} reuses={reuses} />
            </div>
            {<div style={{ display: value !== 1 ? 'none' : 'inherit' }}><Visualizations graphFilters={graphFilters} nodes={texts} edges={reuses} /></div>}
            {<div style={{ display: value !== 2 ? 'none' : 'inherit' }}><NodeLists reuses={reuses} sources={sources} texts={texts} textsById={textsById} /></div>}
        </Paper>
    </div >
}

const GraphVis = React.memo(({ texts, sources, reuses, nodesById, idKey }: any) => {
    const [activeNode, setActiveNode] = useState('') as any
    const w = window as any
    const graf = React.createRef() as any
    const [frozen, setFrozen] = useState(10000)
    if (idKey !== 'id' && frozen !== 10000) {
        setFrozen(10000)
    }
    const nodearr = idKey === 'id' ? texts : Array.from(new Set(texts.map(t => t[idKey]))).map(k => [k].reduce((p: any, c: any) => {
        p[idKey] = c
        return p
    }, {}))

    return (
        <div>
            {activeNode && activeNode.id && <Paper onClick={() => {
                    setActiveNode({})
                    setFrozen(1000)
                }} style={{ padding: '10px', position: 'absolute', marginLeft: '30px', marginTop: '30px', zIndex: 1000000, backgroundColor: 'white', width: '300px' }}>
                {activeNode.id && <p style={{ margin: 0 }}><b>ID:</b> {activeNode.id}</p>}
                {activeNode.title && <p style={{ margin: 0 }}><b>Title:</b> {activeNode.title}</p>}
                {activeNode.author && <p style={{ margin: 0 }}><b>Authors:</b> {activeNode.author.split('|||').join(', ')}</p>}
                {activeNode.location && <p style={{ margin: 0 }}><b>Location:</b> {activeNode.location}</p>}
                {activeNode.year && <p style={{ margin: 0 }}><b>Year:</b> {activeNode.year}</p>}
            </Paper>}
            <ForceGraph2D
                graphData={{ nodes: nodearr, links: reuses.map(({ source, reuser, count }) => ({ source: nodesById[source][idKey], target: nodesById[reuser][idKey], value: count }))
                                                          .filter(({ source, target }) => source !== target) }}
                width={window.innerWidth * 0.8}
                nodeId={idKey}
                ref={graf}
                onNodeHover={(node) => {
                    if (idKey === 'id' && node) {
                        setFrozen(0)
                        setActiveNode(node)
                    }
                }}
                onNodeClick={(node) => {
                    if (idKey === 'id') {
                        graf.current.pauseAnimation()
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
})

const BarGraph = ({data, title, label}) => {
    const chartProps = {
        data,
        size: [500, 900],
        type: 'bar',
        projection: 'horizontal',
        oAccessor: 'name',
        rAccessor: 'connections',
        title,
        axes: [{
            orient: 'bottom',
            label,
            ticks: 10,
        }],
        style: () => {
            const letters = '0123456789ABCDEF'
            let fill = '#'
            for (let i = 0; i < 6; i++) {
              fill += letters[Math.floor(Math.random() * 16)]
            }
            return { fill, stroke: 'white' }
        },
        margin: {left: 200, right: 25, top: 50, bottom: 50},
        // tooltipContent: (d) => {
        //     return <ToolTip>
        //       <p>watatatatatattat</p>
        //       <p onClick={console.log('we are active', d) as any}>wtatwatwatawtwa</p>

        //     </ToolTip>
        // },
        renderMode: 'sketchy',
        oPadding: 3,
        pixelColumnWidth: 18,
        hoverAnnotation: true,
        oLabel: (d) => <text style={{transform: 'translate(-190px, 3px)', fontSize: '11px'}}>
            {d.substring(0, 35)}
        </text>,
        rLabel: true,
    }
    return <ResponsiveOrdinalFrame
                {...chartProps}
                responsiveWidth={true}
            />
}

const Visualizations = ({ nodes, edges, graphFilters }) => {
    const { chartType, barAuthorFilter, barChartEntryStart, barChartEntryEnd} = graphFilters

    const authorsById = {} as any
    const yearsById = {} as any
    const locationsById = {} as any
    const textsById = {} as any

    nodes.forEach(n => {
        authorsById[n.author] = authorsById[n.author] || {}
        locationsById[n.location] = locationsById[n.location] || {}
        yearsById[n.year] = yearsById[n.year] || {}
        textsById[n.id] = textsById[n.id] || {}

        locationsById[n.location].asSource = (locationsById[n.location].asSource || 0) + n.output
        authorsById[n.author].asSource = (authorsById[n.author].asSource || 0) + n.output
        yearsById[n.year].asSource = (yearsById[n.year].asSource || 0) + n.output
        textsById[n.id].asSource = (textsById[n.id].asSource || 0) + n.output

        locationsById[n.location].asReuser = (locationsById[n.location].asReuser || 0) + n.input
        authorsById[n.author].asReuser = (authorsById[n.author].asReuser || 0) + n.input
        yearsById[n.year].asReuser = (yearsById[n.year].asReuser || 0) + n.input
        textsById[n.id].asReuser = (textsById[n.id].asReuser || 0) + n.input
    })

    const filteredTexts = new Set(Object.values(textsById).filter((t: any) => {
        return (t.output + t.input) > 200
    }).map((t: any) => ({ id: t.id, count: t.output + t.input })).sort((a, b) => a.count > b.count ? -1 : 1).splice(0, 100).map((t) => t.id))

    const theme = ['#ac58e5', '#E0488B', '#9fd0cb', '#e0d33a', '#7566ff', '#533f82', '#7a255d', '#365350', '#a19a11', '#3f4482']
    // const frameProps = {
    //     nodes: Array.from(new Set(nodes.map(n => ({name: n.year})).sort((a, b) => yearsById[a.name].output + yearsById[a.name].input > yearsById[b.name].output + yearsById[b.name].input ? 1 : -1).slice(0, 66))),
    //     edges: edges.map(({source, reuser, count}) => ({source: textsById[source].year, target: textsById[reuser].year, value: count})),
    //     size: [1200, 1200],
    //     margin: { left: 60, top: 60, bottom: 10, right: 10 },
    //     networkType: 'matrix',
    //     nodeIDAccessor: 'name',
    //     linkColor: 'rgb(255, 0, 0)',
    //     nodeStyle: { fill: 'none', stroke: '#DDD' },
    //     edgeStyle: d => {
    //         // console.log(d)
    //         return {
    //             fill: 'rgb(250,0,0)', // `rgb(${d.value}, 0, 0)`,
    //             stroke: theme['#ac58e5'], // d.source.group + 1],
    //             fillOpacity: 0.75,
    //         }
    //     },
    //     hoverAnnotation: [{ type: 'frame-hover' },
    //     { type: 'highlight', style: { fill: '#ac58e5', fillOpacity: 0.25, stroke: '#E0488B' } }],
    //     nodeLabels: true,
    // }

    const countConnections = (arr) => {
        if (chartType === 'both') {
            return arr.asReuser + arr.asSource
        }
        if (chartType === 'reuser') {
            return arr.asReuser
        }
        return arr.asSource

    }
    return (
        <div >
            <BarGraph title={`Author connections (${Object.keys(authorsById).length} unique authors)`} label={'Number of connections'} data={Object.entries(authorsById)
                    .map((arr: any) => ({connections: countConnections(arr[1]), name: arr[0]})).filter(({name}) => name.includes(barAuthorFilter))
                    .sort((a: any, b: any) => a.connections < b.connections ? 1 : -1).slice(barChartEntryStart, barChartEntryEnd)}/>

            <BarGraph title={`Year connections (${Object.keys(yearsById).length} unique years)`} label={'Number of connections'} data={Object.entries(yearsById)
                    .map((arr: any) => ({connections: countConnections(arr[1]), name: arr[0]}))
                    .sort((a: any, b: any) => a.connections < b.connections ? 1 : -1).slice(barChartEntryStart, barChartEntryEnd)}/>

            <BarGraph title={`Location connections (${Object.keys(locationsById).length} unique locations)`} label={'Number of connections'} data={Object.entries(locationsById)
                    .map((arr: any) => ({connections: countConnections(arr[1]), name: arr[0]}))
                    .sort((a: any, b: any) => a.connections < b.connections ? 1 : -1).slice(barChartEntryStart, barChartEntryEnd)}/>
            {/* <NetworkFrame {...frameProps} /> */}
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
