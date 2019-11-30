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


const mapToQueryFilters = (f: FilterState) => {
    const filters = {
        title: f.textTitle || 'death',
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

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }


    const a11yProps = (index: any) => {
        return {
            'id': `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        }
    }

    // const { reuses, texts } = data.reuses
    const reuses = edges
    const texts = nodes

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


    // console.log(Object.values(texts_by_id), texts_by_id, texts)
    console.log(reuses.length, texts.length)

    return <div>
        <p>Graph results</p>
        <CSVLink data={makeCSV(reuses, texts)}>Download data as CSV</CSVLink>

        {activeNode && activeNode.id && <Paper style={{padding: '10px', position: 'absolute', top: `${window.innerHeight * 0.20}px`, left: `${window.innerWidth * .30}px`, zIndex: 1000000, backgroundColor: 'white', width: '300px'}}>
            {activeNode.id && <p style={{margin: 0}}><b>ID:</b> {activeNode.id}</p>}
            {activeNode.title && <p style={{margin: 0}}><b>Title:</b> {activeNode.title}</p>}
            {activeNode.author && <p style={{margin: 0}}><b>Authors:</b> {activeNode.author.split('|||').join(', ')}</p>}
            {activeNode.location && <p style={{margin: 0}}><b>Location:</b> {activeNode.location}</p>}
            {activeNode.year && <p style={{margin: 0}}><b>Year:</b> {activeNode.year}</p>}
        </Paper>}
<Paper style={{marginRight: '50px', maxWidth: '70vw'}}>
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
            {value === 0 && <GraphVis sources={sources} setActiveNode={setActiveNode} texts={texts} reuses={reuses} />}
            {value === 1 && <p>testi2</p>}
            {value === 2 && <p>testi3</p>}
        </Paper>
    </div >
}

const GraphVis = ({texts, sources, reuses, setActiveNode}) => {
    const [frozen, setFrozen] = useState(15000)

    setTimeout(() => setFrozen(0), 9000)

    console.log(ForceGraph2D)
    return (
    <div>
        <ForceGraph2D
            graphData={{ nodes: texts, links: reuses.map(({ source, reuser, count }) => ({ source, target: reuser, value: count })) }}
            width={window.innerWidth * 0.7}
            onNodeClick={(node) => setActiveNode(node)}
            height={window.innerHeight * 0.8}
            nodeAutoColorBy='group'
            enableNodeDrag={false}
            cooldownTime={frozen}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id
                const fontSize = 11 / globalScale
                ctx.font = `${fontSize}px Sans-Serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                if (sources.has(node.id)) {
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

const Visualizations = (nodes, edges, filteredTexts) => {

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



    const counts = Object.entries(authorCounts).map((textCount) => ({name: textCount[0], texts: textCount[1]})).sort((a: any, b: any) => a.texts > b.texts ? -1 : 1)

    const countsY = Object.entries(yearCounts).map((count) => ({year: count[0], titles: count[1]})).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)
    const countsL = Object.entries(locCounts).map((count) => ({location: count[0], titles: count[1]})).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)


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
            nodeStyle: { fill: 'none', stroke: '#DDD' },
            edgeStyle: d => {
                // console.log(d)
                return {
                    fill:  'rgb(250,0,0)', // `rgb(${d.value}, 0, 0)`,
                    stroke: theme['#ac58e5'], // d.source.group + 1],
                    fillOpacity: 0.75,
                }
            },
            hoverAnnotation: [{ type: 'frame-hover' },
            { type: 'highlight', style: { fill: '#ac58e5', fillOpacity: 0.25, stroke: '#E0488B' } }],
            nodeLabels: true,
        }
    return (
    <div>
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

const NodeLists = (texts, sources, targetsForFilter) => {

    return (<div style={{ display: 'flex', flexDirection: 'row' }}>
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
            </div>)
}

export default GraphList
