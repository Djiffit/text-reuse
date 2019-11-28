import React from 'react'
import nodes from '../dummyData/nodes'
import edges from '../dummyData/edges'
// import NetworkFrame from 'semiotic/lib/NetworkFrame'
// import ResponsiveOrdinalFrame from 'semiotic/lib/ResponsiveOrdinalFrame'

const Visualizer = () => {

  const authors = nodes.map(n => n.author.reduce((e, s) => ([...e, s.name]), []))
  const authorCounts = {}

  authors.forEach(authorArr => authorArr.forEach(auth => {
    authorCounts[auth] = (authorCounts[auth] || 0) + 1
  }))

  const counts = Object.entries(authorCounts).map((textCount) => ({ name: textCount[0], texts: textCount[1] })).sort((a: any, b: any) => a.texts > b.texts ? -1 : 1)

  const frameProps = {
    /* --- Data --- */
    data: counts.slice(0, 10),

    /* --- Size --- */
    size: [1280, 300],

    /* --- Layout --- */
    type: 'bar',

    /* --- Process --- */
    oAccessor: 'name',
    rAccessor: 'texts',


    /* --- Customize --- */
    title: 'Texts',
    axes: [{
      orient: 'left',
      label: 'Number',
    }],

    // projection: 'horizontal',

    style: { fill: '#ac58e5', stroke: 'white' },

    /* --- Interact --- */
    hoverAnnotation: true,

    /* --- Annotate --- */
    oLabel: true,
  }

  return <div>
    {/* <ResponsiveOrdinalFrame
            {...frameProps}
            responsiveWidth={true}
        />
        <NetworkFrame
            nodes={Array.from(nodes)}
            edges={Array.from(edges)}
            nodeIDAccessor={'text_id'}
            nodeSizeAccessor={2}
            edgeStyle={{ stroke: '#9fd0cb', fill: 'none' }}
            networkType={{ type: 'force', forceManyBody: -250, distanceMax: 500, edgeStrength: 2 }}
        /> */}
  </div>
}

export default Visualizer
