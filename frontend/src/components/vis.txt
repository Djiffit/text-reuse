import React from 'react'
import nodes from '../dummyData/nodes'
import edges from '../dummyData/edges'
import NetworkFrame from 'semiotic/lib/NetworkFrame'
import ResponsiveOrdinalFrame from 'semiotic/lib/ResponsiveOrdinalFrame'
//import './semiotic.css'
//import './styles.css'

const Visualizer = () => {

    const authors = nodes.map(n => n.author.reduce((e, s) => ([...e, s.name]), []))
    const authorCounts = {}

    const years = nodes.map(n => n.year) //.reduce((e, s) => ([...e, s.name]), [])))
    const yearCounts = {}

    const locations = nodes.map(n => n.location) //.reduce((e, s) => ([...e, s.name]), [])))
    const locCounts = {}


    authors.forEach(authorArr => authorArr.forEach(auth => {
        authorCounts[auth] = (authorCounts[auth] || 0) + 1
    }))

    years.forEach(y => {
        yearCounts[y] = (yearCounts[y] || 0) + 1
    })

    locations.forEach(y => {
        locCounts[y] = (locCounts[y] || 0) + 1
    })



    const counts = Object.entries(authorCounts).map((textCount) => ({name: textCount[0], texts: textCount[1]})).sort((a: any, b: any) => a.texts > b.texts ? -1 : 1)

    const countsY = Object.entries(yearCounts).map((count) => ({year: count[0], titles: count[1]})).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)
    const countsL = Object.entries(locCounts).map((count) => ({location: count[0], titles: count[1]})).sort((a: any, b: any) => a.titles > b.titles ? -1 : 1)


    const frameProps = {
        /* --- Data --- */
          data: counts.slice(0, 20),

        /* --- Size --- */
          size: [1280,300],

        /* --- Layout --- */
          type: 'bar',

        /* --- Process --- */
          oAccessor: 'name',
          rAccessor: 'texts',


        /* --- Customize --- */
          title: 'Most Common Authors',
          axes: [{
            orient: 'left',
            label: 'Number of Titles'
          }],

        // projection: 'horizontal',

        style: { fill: "#ac58e5", stroke: "white" },

        /* --- Interact --- */
          hoverAnnotation: true,

        /* --- Annotate --- */
          oLabel: true
        }

    const framePropsL = {
        /* --- Data --- */
          data: countsL.slice(0, 20),

        /* --- Size --- */
          size: [1280,300],

        /* --- Layout --- */
          type: 'bar',

        /* --- Process --- */
          oAccessor: 'location',
          rAccessor: 'titles',


        /* --- Customize --- */
          title: 'Most Common Locations',
          axes: [{
            orient: 'left',
            label: 'Number of Titles'
          }],

        // projection: 'horizontal',

        style: { fill: "#ac58e5", stroke: "white" },

        /* --- Interact --- */
          hoverAnnotation: true,

        /* --- Annotate --- */
          oLabel: true
        }

    const framePropsY = {
            /* --- Data --- */
              data: countsY.slice(0, 20),

            /* --- Size --- */
              size: [1280,300],

            /* --- Layout --- */
              type: 'bar',

            /* --- Process --- */
              oAccessor: 'year',
              rAccessor: 'titles',


            /* --- Customize --- */
              title: 'Most Common Years',
              axes: [{
                orient: 'left',
                label: 'Number of Titles'
              }],

            // projection: 'horizontal',

            style: { fill: "#ac58e5", stroke: "white" },

            /* --- Interact --- */
              hoverAnnotation: true,

            /* --- Annotate --- */
              oLabel: true
            }

    const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]

    const framePropsAT = {
        /* --- Data --- */
        nodes: nodes,
        edges: edges,

        /* --- Size --- */
        size: [1400,1400],
        margin: { left: 60, top: 60, bottom: 10, right: 10 },

        /* --- Layout --- */
        networkType: "matrix",

        /* --- Process --- */
        nodeIDAccessor: "text_id",

        /* --- Customize --- */
        nodeStyle: { fill: "none", stroke: "#DDD" },
        edgeStyle: d => ({
        fill: "#ac58e5",
        stroke: "#ac58e5",
        fillOpacity: 0.75
        }),

        /* --- Interact --- */
        hoverAnnotation: [{ type: "frame-hover" },
        { type: "highlight", style: { fill: "#ac58e5", fillOpacity: 0.25, stroke: "#E0488B" } }],

        /* --- Annotate --- */
        nodeLabels: true
        }




        const framePropsM = {   nodes: [{ name: "Myriel", group: 1 },
            { name: "Napoleon", group: 1 },
            { name: "Mlle.Baptistine", group: 1 },
            { name: "Mme.Magloire", group: 1 },
            { name: "CountessdeLo", group: 1 },
            { name: "Geborand", group: 1 },
            { name: "Champtercier", group: 1 },
            { name: "Cravatte", group: 1 },
            { name: "Count", group: 1 },
            { name: "OldMan", group: 1 },
            { name: "Labarre", group: 2 },
            { name: "Valjean", group: 2 },
            { name: "Marguerite", group: 3 },
            { name: "Mme.deR", group: 2 },
            { name: "Isabeau", group: 2 },
            { name: "Gervais", group: 2 },
            { name: "Tholomyes", group: 3 },
            { name: "Listolier", group: 3 },
            { name: "Fameuil", group: 3 },
            { name: "Blacheville", group: 3 },
            { name: "Favourite", group: 3 },
            { name: "Dahlia", group: 3 },
            { name: "Zephine", group: 3 },
            { name: "Fantine", group: 3 },
            { name: "Mme.Thenardier", group: 4 },
            { name: "Thenardier", group: 4 },
            { name: "Cosette", group: 5 },
            { name: "Javert", group: 4 },
            { name: "Fauchelevent", group: 0 },
            { name: "Bamatabois", group: 2 },
            { name: "Perpetue", group: 3 },
            { name: "Simplice", group: 2 },
            { name: "Scaufflaire", group: 2 },
            { name: "Woman1", group: 2 },
            { name: "Judge", group: 2 },
            { name: "Champmathieu", group: 2 },
            { name: "Brevet", group: 2 },
            { name: "Chenildieu", group: 2 },
            { name: "Cochepaille", group: 2 },
            { name: "Pontmercy", group: 4 },
            { name: "Boulatruelle", group: 6 },
            { name: "Eponine", group: 4 },
            { name: "Anzelma", group: 4 },
            { name: "Woman2", group: 5 },
            { name: "MotherInnocent", group: 0 },
            { name: "Gribier", group: 0 },
            { name: "Jondrette", group: 7 },
            { name: "Mme.Burgon", group: 7 },
            { name: "Gavroche", group: 8 },
            { name: "Gillenormand", group: 5 },
            { name: "Magnon", group: 5 },
            { name: "Mlle.Gillenormand", group: 5 },
            { name: "Mme.Pontmercy", group: 5 },
            { name: "Mlle.Vaubois", group: 5 },
            { name: "Lt.Gillenormand", group: 5 },
            { name: "Marius", group: 8 },
            { name: "BaronessT", group: 5 },
            { name: "Mabeuf", group: 8 },
            { name: "Enjolras", group: 8 },
            { name: "Combeferre", group: 8 },
            { name: "Prouvaire", group: 8 },
            { name: "Feuilly", group: 8 },
            { name: "Courfeyrac", group: 8 },
            { name: "Bahorel", group: 8 },
            { name: "Bossuet", group: 8 },
            { name: "Joly", group: 8 },
            { name: "Grantaire", group: 8 },
            { name: "MotherPlutarch", group: 9 },
            { name: "Gueulemer", group: 4 },
            { name: "Babet", group: 4 },
            { name: "Claquesous", group: 4 },
            { name: "Montparnasse", group: 4 },
            { name: "Toussaint", group: 5 },
            { name: "Child1", group: 10 },
            { name: "Child2", group: 10 },
            { name: "Brujon", group: 4 },
            { name: "Mme.Hucheloup", group: 8 }],
          edges: [{ source: { name: "Napoleon", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Mlle.Baptistine", group: 1 }, target: { name: "Myriel", group: 1 }, value: 8 },
            { source: { name: "Mme.Magloire", group: 1 }, target: { name: "Myriel", group: 1 }, value: 10 },
            { source: { name: "Mme.Magloire", group: 1 }, target: { name: "Mlle.Baptistine", group: 1 }, value: 6 },
            { source: { name: "CountessdeLo", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Geborand", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Champtercier", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Cravatte", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Count", group: 1 }, target: { name: "Myriel", group: 1 }, value: 2 },
            { source: { name: "OldMan", group: 1 }, target: { name: "Myriel", group: 1 }, value: 1 },
            { source: { name: "Valjean", group: 2 }, target: { name: "Labarre", group: 2 }, value: 1 },
            { source: { name: "Valjean", group: 2 }, target: { name: "Mme.Magloire", group: 1 }, value: 3 },
            { source: { name: "Valjean", group: 2 }, target: { name: "Mlle.Baptistine", group: 1 }, value: 3 },
            { source: { name: "Valjean", group: 2 }, target: { name: "Myriel", group: 1 }, value: 5 },
            { source: { name: "Marguerite", group: 3 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Mme.deR", group: 2 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Isabeau", group: 2 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Gervais", group: 2 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Listolier", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 4 },
            { source: { name: "Fameuil", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 4 },
            { source: { name: "Fameuil", group: 3 }, target: { name: "Listolier", group: 3 }, value: 4 },
            { source: { name: "Blacheville", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 4 },
            { source: { name: "Blacheville", group: 3 }, target: { name: "Listolier", group: 3 }, value: 4 },
            { source: { name: "Blacheville", group: 3 }, target: { name: "Fameuil", group: 3 }, value: 4 },
            { source: { name: "Favourite", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 3 },
            { source: { name: "Favourite", group: 3 }, target: { name: "Listolier", group: 3 }, value: 3 },
            { source: { name: "Favourite", group: 3 }, target: { name: "Fameuil", group: 3 }, value: 3 },
            { source: { name: "Favourite", group: 3 }, target: { name: "Blacheville", group: 3 }, value: 4 },
            { source: { name: "Dahlia", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 3 },
            { source: { name: "Dahlia", group: 3 }, target: { name: "Listolier", group: 3 }, value: 3 },
            { source: { name: "Dahlia", group: 3 }, target: { name: "Fameuil", group: 3 }, value: 3 },
            { source: { name: "Dahlia", group: 3 }, target: { name: "Blacheville", group: 3 }, value: 3 },
            { source: { name: "Dahlia", group: 3 }, target: { name: "Favourite", group: 3 }, value: 5 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 3 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Listolier", group: 3 }, value: 3 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Fameuil", group: 3 }, value: 3 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Blacheville", group: 3 }, value: 3 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Favourite", group: 3 }, value: 4 },
            { source: { name: "Zephine", group: 3 }, target: { name: "Dahlia", group: 3 }, value: 4 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Tholomyes", group: 3 }, value: 3 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Listolier", group: 3 }, value: 3 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Fameuil", group: 3 }, value: 3 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Blacheville", group: 3 }, value: 3 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Favourite", group: 3 }, value: 4 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Dahlia", group: 3 }, value: 4 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Zephine", group: 3 }, value: 4 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Marguerite", group: 3 }, value: 2 },
            { source: { name: "Fantine", group: 3 }, target: { name: "Valjean", group: 2 }, value: 9 },
            { source: { name: "Mme.Thenardier", group: 4 }, target: { name: "Fantine", group: 3 }, value: 2 },
            { source: { name: "Mme.Thenardier", group: 4 }, target: { name: "Valjean", group: 2 }, value: 7 },
            { source: { name: "Thenardier", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 13 },
            { source: { name: "Thenardier", group: 4 }, target: { name: "Fantine", group: 3 }, value: 1 },
            { source: { name: "Thenardier", group: 4 }, target: { name: "Valjean", group: 2 }, value: 12 },
            { source: { name: "Cosette", group: 5 }, target: { name: "Mme.Thenardier", group: 4 }, value: 4 },
            { source: { name: "Cosette", group: 5 }, target: { name: "Valjean", group: 2 }, value: 31 },
            { source: { name: "Cosette", group: 5 }, target: { name: "Tholomyes", group: 3 }, value: 1 },
            { source: { name: "Cosette", group: 5 }, target: { name: "Thenardier", group: 4 }, value: 1 },
            { source: { name: "Javert", group: 4 }, target: { name: "Valjean", group: 2 }, value: 17 },
            { source: { name: "Javert", group: 4 }, target: { name: "Fantine", group: 3 }, value: 5 },
            { source: { name: "Javert", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 5 },
            { source: { name: "Javert", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Javert", group: 4 }, target: { name: "Cosette", group: 5 }, value: 1 },
            { source: { name: "Fauchelevent", group: 0 }, target: { name: "Valjean", group: 2 }, value: 8 },
            { source: { name: "Fauchelevent", group: 0 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Bamatabois", group: 2 }, target: { name: "Fantine", group: 3 }, value: 1 },
            { source: { name: "Bamatabois", group: 2 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Bamatabois", group: 2 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Perpetue", group: 3 }, target: { name: "Fantine", group: 3 }, value: 1 },
            { source: { name: "Simplice", group: 2 }, target: { name: "Perpetue", group: 3 }, value: 2 },
            { source: { name: "Simplice", group: 2 }, target: { name: "Valjean", group: 2 }, value: 3 },
            { source: { name: "Simplice", group: 2 }, target: { name: "Fantine", group: 3 }, value: 2 },
            { source: { name: "Simplice", group: 2 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Scaufflaire", group: 2 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Woman1", group: 2 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Woman1", group: 2 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Judge", group: 2 }, target: { name: "Valjean", group: 2 }, value: 3 },
            { source: { name: "Judge", group: 2 }, target: { name: "Bamatabois", group: 2 }, value: 2 },
            { source: { name: "Champmathieu", group: 2 }, target: { name: "Valjean", group: 2 }, value: 3 },
            { source: { name: "Champmathieu", group: 2 }, target: { name: "Judge", group: 2 }, value: 3 },
            { source: { name: "Champmathieu", group: 2 }, target: { name: "Bamatabois", group: 2 }, value: 2 },
            { source: { name: "Brevet", group: 2 }, target: { name: "Judge", group: 2 }, value: 2 },
            { source: { name: "Brevet", group: 2 }, target: { name: "Champmathieu", group: 2 }, value: 2 },
            { source: { name: "Brevet", group: 2 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Brevet", group: 2 }, target: { name: "Bamatabois", group: 2 }, value: 1 },
            { source: { name: "Chenildieu", group: 2 }, target: { name: "Judge", group: 2 }, value: 2 },
            { source: { name: "Chenildieu", group: 2 }, target: { name: "Champmathieu", group: 2 }, value: 2 },
            { source: { name: "Chenildieu", group: 2 }, target: { name: "Brevet", group: 2 }, value: 2 },
            { source: { name: "Chenildieu", group: 2 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Chenildieu", group: 2 }, target: { name: "Bamatabois", group: 2 }, value: 1 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Judge", group: 2 }, value: 2 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Champmathieu", group: 2 }, value: 2 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Brevet", group: 2 }, value: 2 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Chenildieu", group: 2 }, value: 2 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Cochepaille", group: 2 }, target: { name: "Bamatabois", group: 2 }, value: 1 },
            { source: { name: "Pontmercy", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 1 },
            { source: { name: "Boulatruelle", group: 6 }, target: { name: "Thenardier", group: 4 }, value: 1 },
            { source: { name: "Eponine", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 2 },
            { source: { name: "Eponine", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 3 },
            { source: { name: "Anzelma", group: 4 }, target: { name: "Eponine", group: 4 }, value: 2 },
            { source: { name: "Anzelma", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 2 },
            { source: { name: "Anzelma", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Woman2", group: 5 }, target: { name: "Valjean", group: 2 }, value: 3 },
            { source: { name: "Woman2", group: 5 }, target: { name: "Cosette", group: 5 }, value: 1 },
            { source: { name: "Woman2", group: 5 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "MotherInnocent", group: 0 }, target: { name: "Fauchelevent", group: 0 }, value: 3 },
            { source: { name: "MotherInnocent", group: 0 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Gribier", group: 0 }, target: { name: "Fauchelevent", group: 0 }, value: 2 },
            { source: { name: "Mme.Burgon", group: 7 }, target: { name: "Jondrette", group: 7 }, value: 1 },
            { source: { name: "Gavroche", group: 8 }, target: { name: "Mme.Burgon", group: 7 }, value: 2 },
            { source: { name: "Gavroche", group: 8 }, target: { name: "Thenardier", group: 4 }, value: 1 },
            { source: { name: "Gavroche", group: 8 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Gavroche", group: 8 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Gillenormand", group: 5 }, target: { name: "Cosette", group: 5 }, value: 3 },
            { source: { name: "Gillenormand", group: 5 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Magnon", group: 5 }, target: { name: "Gillenormand", group: 5 }, value: 1 },
            { source: { name: "Magnon", group: 5 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Mlle.Gillenormand", group: 5 }, target: { name: "Gillenormand", group: 5 }, value: 9 },
            { source: { name: "Mlle.Gillenormand", group: 5 }, target: { name: "Cosette", group: 5 }, value: 2 },
            { source: { name: "Mlle.Gillenormand", group: 5 }, target: { name: "Valjean", group: 2 }, value: 2 },
            { source: { name: "Mme.Pontmercy", group: 5 }, target: { name: "Mlle.Gillenormand", group: 5 }, value: 1 },
            { source: { name: "Mme.Pontmercy", group: 5 }, target: { name: "Pontmercy", group: 4 }, value: 1 },
            { source: { name: "Mlle.Vaubois", group: 5 }, target: { name: "Mlle.Gillenormand", group: 5 }, value: 1 },
            { source: { name: "Lt.Gillenormand", group: 5 }, target: { name: "Mlle.Gillenormand", group: 5 }, value: 2 },
            { source: { name: "Lt.Gillenormand", group: 5 }, target: { name: "Gillenormand", group: 5 }, value: 1 },
            { source: { name: "Lt.Gillenormand", group: 5 }, target: { name: "Cosette", group: 5 }, value: 1 },
            { source: { name: "Marius", group: 8 }, target: { name: "Mlle.Gillenormand", group: 5 }, value: 6 },
            { source: { name: "Marius", group: 8 }, target: { name: "Gillenormand", group: 5 }, value: 12 },
            { source: { name: "Marius", group: 8 }, target: { name: "Pontmercy", group: 4 }, value: 1 },
            { source: { name: "Marius", group: 8 }, target: { name: "Lt.Gillenormand", group: 5 }, value: 1 },
            { source: { name: "Marius", group: 8 }, target: { name: "Cosette", group: 5 }, value: 21 },
            { source: { name: "Marius", group: 8 }, target: { name: "Valjean", group: 2 }, value: 19 },
            { source: { name: "Marius", group: 8 }, target: { name: "Tholomyes", group: 3 }, value: 1 },
            { source: { name: "Marius", group: 8 }, target: { name: "Thenardier", group: 4 }, value: 2 },
            { source: { name: "Marius", group: 8 }, target: { name: "Eponine", group: 4 }, value: 5 },
            { source: { name: "Marius", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 4 },
            { source: { name: "BaronessT", group: 5 }, target: { name: "Gillenormand", group: 5 }, value: 1 },
            { source: { name: "BaronessT", group: 5 }, target: { name: "Marius", group: 8 }, value: 1 },
            { source: { name: "Mabeuf", group: 8 }, target: { name: "Marius", group: 8 }, value: 1 },
            { source: { name: "Mabeuf", group: 8 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Mabeuf", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Enjolras", group: 8 }, target: { name: "Marius", group: 8 }, value: 7 },
            { source: { name: "Enjolras", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 7 },
            { source: { name: "Enjolras", group: 8 }, target: { name: "Javert", group: 4 }, value: 6 },
            { source: { name: "Enjolras", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 1 },
            { source: { name: "Enjolras", group: 8 }, target: { name: "Valjean", group: 2 }, value: 4 },
            { source: { name: "Combeferre", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 15 },
            { source: { name: "Combeferre", group: 8 }, target: { name: "Marius", group: 8 }, value: 5 },
            { source: { name: "Combeferre", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 6 },
            { source: { name: "Combeferre", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 2 },
            { source: { name: "Prouvaire", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Prouvaire", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 4 },
            { source: { name: "Prouvaire", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 2 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 2 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 6 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 2 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 5 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 1 },
            { source: { name: "Feuilly", group: 8 }, target: { name: "Marius", group: 8 }, value: 1 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Marius", group: 8 }, value: 9 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 17 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 13 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 7 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 2 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Feuilly", group: 8 }, value: 6 },
            { source: { name: "Courfeyrac", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 3 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 5 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 5 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Courfeyrac", group: 8 }, value: 6 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 2 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 4 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Feuilly", group: 8 }, value: 3 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 2 },
            { source: { name: "Bahorel", group: 8 }, target: { name: "Marius", group: 8 }, value: 1 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Marius", group: 8 }, value: 5 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Courfeyrac", group: 8 }, value: 12 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 5 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Bahorel", group: 8 }, value: 4 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 10 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Feuilly", group: 8 }, value: 6 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 2 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 9 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 1 },
            { source: { name: "Bossuet", group: 8 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Joly", group: 8 }, target: { name: "Bahorel", group: 8 }, value: 5 },
            { source: { name: "Joly", group: 8 }, target: { name: "Bossuet", group: 8 }, value: 7 },
            { source: { name: "Joly", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 3 },
            { source: { name: "Joly", group: 8 }, target: { name: "Courfeyrac", group: 8 }, value: 5 },
            { source: { name: "Joly", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 5 },
            { source: { name: "Joly", group: 8 }, target: { name: "Feuilly", group: 8 }, value: 5 },
            { source: { name: "Joly", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 2 },
            { source: { name: "Joly", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 5 },
            { source: { name: "Joly", group: 8 }, target: { name: "Mabeuf", group: 8 }, value: 1 },
            { source: { name: "Joly", group: 8 }, target: { name: "Marius", group: 8 }, value: 2 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Bossuet", group: 8 }, value: 3 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 3 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Combeferre", group: 8 }, value: 1 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Courfeyrac", group: 8 }, value: 2 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Joly", group: 8 }, value: 2 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Bahorel", group: 8 }, value: 1 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Feuilly", group: 8 }, value: 1 },
            { source: { name: "Grantaire", group: 8 }, target: { name: "Prouvaire", group: 8 }, value: 1 },
            { source: { name: "MotherPlutarch", group: 9 }, target: { name: "Mabeuf", group: 8 }, value: 3 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 5 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Gueulemer", group: 4 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Babet", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 6 },
            { source: { name: "Babet", group: 4 }, target: { name: "Gueulemer", group: 4 }, value: 6 },
            { source: { name: "Babet", group: 4 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Babet", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Babet", group: 4 }, target: { name: "Javert", group: 4 }, value: 2 },
            { source: { name: "Babet", group: 4 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Babet", group: 4 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 4 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Babet", group: 4 }, value: 4 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Gueulemer", group: 4 }, value: 4 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Mme.Thenardier", group: 4 }, value: 1 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Claquesous", group: 4 }, target: { name: "Enjolras", group: 8 }, value: 1 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Babet", group: 4 }, value: 2 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Gueulemer", group: 4 }, value: 2 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Claquesous", group: 4 }, value: 2 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Montparnasse", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 1 },
            { source: { name: "Toussaint", group: 5 }, target: { name: "Cosette", group: 5 }, value: 2 },
            { source: { name: "Toussaint", group: 5 }, target: { name: "Javert", group: 4 }, value: 1 },
            { source: { name: "Toussaint", group: 5 }, target: { name: "Valjean", group: 2 }, value: 1 },
            { source: { name: "Child1", group: 10 }, target: { name: "Gavroche", group: 8 }, value: 2 },
            { source: { name: "Child2", group: 10 }, target: { name: "Gavroche", group: 8 }, value: 2 },
            { source: { name: "Child2", group: 10 }, target: { name: "Child1", group: 10 }, value: 3 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Babet", group: 4 }, value: 3 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Gueulemer", group: 4 }, value: 3 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Thenardier", group: 4 }, value: 3 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Eponine", group: 4 }, value: 1 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Claquesous", group: 4 }, value: 1 },
            { source: { name: "Brujon", group: 4 }, target: { name: "Montparnasse", group: 4 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Bossuet", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Joly", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Grantaire", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Bahorel", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Courfeyrac", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Gavroche", group: 8 }, value: 1 },
            { source: { name: "Mme.Hucheloup", group: 8 }, target: { name: "Enjolras", group: 8 }, value: 1 }],
          size: [1400,1400],
          margin: { left: 60, top: 60, bottom: 10, right: 10 },
          networkType: "matrix",
          nodeIDAccessor: "name",
          nodeStyle: { fill: "none", stroke: "#DDD" },
          edgeStyle: d => ({
          fill: theme[d.source.group + 1],
          stroke: theme[d.source.group + 1],
          fillOpacity: 0.75
        }),
          hoverAnnotation: [{ type: "frame-hover" },
            { type: "highlight", style: { fill: "#ac58e5", fillOpacity: 0.25, stroke: "#E0488B" } }],
          nodeLabels: true
        }










  const colors = {
    "Base Import": "#ac58e5",
    Usage: "#E0488B",
    Intermediary: "#9fd0cb",
    Other: "#e0d33a"
  }
  const frameProps2 = {   nodes: [{ id: "Coal reserves", input: 0, output: 127.93, category: "Base Import" },
      { id: "Coal imports", input: 0, output: 349.7879708, category: "Base Import" },
      { id: "Oil reserves", input: 0, output: 802.5479528, category: "Base Import" },
      { id: "Oil imports", input: 0, output: 65.64315528, category: "Base Import" },
      { id: "Gas reserves", input: 0, output: 645.7728959, category: "Base Import" },
      { id: "Gas imports", input: 0, output: 355.6589677, category: "Base Import" },
      { id: "UK land based bioenergy", input: 0, output: 3.027913952, category: "Base Import" },
      { id: "Agricultural 'waste'", input: 0, output: 9.282517755, category: "Base Import" },
      { id: "Other waste", input: 0, output: 35.834982973, category: "Base Import" },
      { id: "Biomass imports", input: 0, output: 4.089432558, category: "Base Import" },
      { id: "Solar", input: 0, output: 0.028059966, category: "Base Import" },
      { id: "Nuclear", input: 0, output: 160.71, category: "Base Import" },
      { id: "Coal", input: 477.7179708, output: 477.7179708, category: "Intermediary" },
      { id: "Oil", input: 868.1911080799999, output: 868.1911081, category: "Intermediary" },
      { id: "Natural Gas", input: 1001.4318636, output: 1001.431864, category: "Intermediary" },
      { id: "Bio-conversion", input: 41.025159347, output: 41.025159349000006, category: "Intermediary" },
      { id: "Solid", input: 504.62288648099997, output: 504.622886431, category: "Intermediary" },
      { id: "Liquid", input: 869.260235105, output: 868.8924025279999, category: "Intermediary" },
      { id: "Gas", input: 1019.73061411, output: 1019.730613744, category: "Intermediary" },
      { id: "Solar PV", input: 0.028059966, output: 0.028059966, category: "Intermediary" },
      { id: "Electricity grid", input: 386.24405559099995, output: 386.24405554800006, category: "Intermediary" },
      { id: "Thermal generation", input: 946.6966335120001, output: 946.6966335309999, category: "Intermediary" },
      { id: "District heating", input: 9.042140031, output: 9.042140031, category: "Intermediary" },
      { id: "Wind", input: 0, output: 14.4406701, category: "Intermediary" },
      { id: "Tidal", input: 0, output: 0.005003425, category: "Intermediary" },
      { id: "Wave", input: 0, output: 0, category: "Intermediary" },
      { id: "Hydro", input: 0, output: 5.329728, category: "Intermediary" },
      { id: "Losses", input: 615.5268253639999, output: 0, category: "Usage" },
      { id: "Over generation / exports", input: 1.14e-13, output: 0, category: "Usage" },
      { id: "Industry", input: 539.6958806810001, output: 0, category: "Usage" },
      { id: "Heating and cooling - homes", input: 408.56077568, output: 0, category: "Usage" },
      { id: "Heating and cooling - commercial", input: 121.41835477199999, output: 0, category: "Usage" },
      { id: "Lighting & appliances - homes", input: 95.393170916, output: 0, category: "Usage" },
      { id: "Lighting & appliances - commercial", input: 82.034798449, output: 0, category: "Usage" },
      { id: "Agriculture", input: 10.647506258999998, output: 0, category: "Usage" },
      { id: "Road transport", input: 470.2870297, output: 0, category: "Usage" },
      { id: "Rail transport", input: 17.724487402999998, output: 0, category: "Usage" },
      { id: "Domestic aviation", input: 9.55109733, output: 0, category: "Usage" },
      { id: "National navigation", input: 26.57289571, output: 0, category: "Usage" },
      { id: "International aviation", input: 125.0236042, output: 0, category: "Usage" },
      { id: "International shipping", input: 57.28499215, output: 0, category: "Usage" }],
    edges: [{ source: "Coal reserves", target: "Coal", value: 127.93 },
      { source: "Coal imports", target: "Coal", value: 349.7879708 },
      { source: "Oil reserves", target: "Oil", value: 802.5479528 },
      { source: "Oil imports", target: "Oil", value: 65.64315528 },
      { source: "Gas reserves", target: "Natural Gas", value: 645.7728959 },
      { source: "Gas imports", target: "Natural Gas", value: 355.6589677 },
      { source: "UK land based bioenergy", target: "Bio-conversion", value: 3.027913952 },
      { source: "Agricultural 'waste'", target: "Bio-conversion", value: 9.282517755 },
      { source: "Other waste", target: "Bio-conversion", value: 28.71472764 },
      { source: "Other waste", target: "Solid", value: 7.120255333 },
      { source: "Biomass imports", target: "Solid", value: 4.089432558 },
      { source: "Coal", target: "Solid", value: 477.7179708 },
      { source: "Oil", target: "Liquid", value: 868.1911081 },
      { source: "Natural Gas", target: "Gas", value: 1001.431864 },
      { source: "Solar", target: "Solar PV", value: 0.028059966 },
      { source: "Solar PV", target: "Electricity grid", value: 0.028059966 },
      { source: "Bio-conversion", target: "Solid", value: 15.69522779 },
      { source: "Bio-conversion", target: "Liquid", value: 1.069127005 },
      { source: "Bio-conversion", target: "Gas", value: 18.29875011 },
      { source: "Bio-conversion", target: "Losses", value: 5.962054444 },
      { source: "Solid", target: "Thermal generation", value: 434.145135 },
      { source: "Liquid", target: "Thermal generation", value: 8.534858112 },
      { source: "Gas", target: "Thermal generation", value: 343.3066404 },
      { source: "Nuclear", target: "Thermal generation", value: 160.71 },
      { source: "Thermal generation", target: "District heating", value: 9.042140031 },
      { source: "Thermal generation", target: "Electricity grid", value: 366.4405941 },
      { source: "Thermal generation", target: "Losses", value: 571.2138994 },
      { source: "Wind", target: "Electricity grid", value: 14.4406701 },
      { source: "Tidal", target: "Electricity grid", value: 0.005003425 },
      { source: "Wave", target: "Electricity grid", value: 0 },
      { source: "Hydro", target: "Electricity grid", value: 5.329728 },
      { source: "Electricity grid", target: "Over generation / exports", value: 1.14e-13 },
      { source: "Electricity grid", target: "Losses", value: 26.94051694 },
      { source: "District heating", target: "Industry", value: 9.042140031 },
      { source: "Electricity grid", target: "Heating and cooling - homes", value: 28.7767749 },
      { source: "Solid", target: "Heating and cooling - homes", value: 13.14794248 },
      { source: "Liquid", target: "Heating and cooling - homes", value: 11.7924845 },
      { source: "Gas", target: "Heating and cooling - homes", value: 354.8435738 },
      { source: "Electricity grid", target: "Heating and cooling - commercial", value: 31.40903798 },
      { source: "Liquid", target: "Heating and cooling - commercial", value: 9.357802772 },
      { source: "Gas", target: "Heating and cooling - commercial", value: 80.65151402 },
      { source: "Electricity grid", target: "Lighting & appliances - homes", value: 87.37770782 },
      { source: "Gas", target: "Lighting & appliances - homes", value: 8.015463096 },
      { source: "Electricity grid", target: "Lighting & appliances - commercial", value: 73.04774089 },
      { source: "Gas", target: "Lighting & appliances - commercial", value: 8.987057559 },
      { source: "Electricity grid", target: "Industry", value: 126.2492384 },
      { source: "Solid", target: "Industry", value: 56.47800845 },
      { source: "Liquid", target: "Industry", value: 137.4335097 },
      { source: "Gas", target: "Industry", value: 210.4929841 },
      { source: "Electricity grid", target: "Agriculture", value: 4.259002504 },
      { source: "Solid", target: "Agriculture", value: 0.851800501 },
      { source: "Liquid", target: "Agriculture", value: 3.513677065 },
      { source: "Gas", target: "Agriculture", value: 2.023026189 },
      { source: "Electricity grid", target: "Road transport", value: 0 },
      { source: "Liquid", target: "Road transport", value: 470.2870297 },
      { source: "Electricity grid", target: "Rail transport", value: 8.184036114 },
      { source: "Liquid", target: "Rail transport", value: 9.540451289 },
      { source: "Liquid", target: "Domestic aviation", value: 9.55109733 },
      { source: "Liquid", target: "National navigation", value: 26.57289571 },
      { source: "Liquid", target: "International aviation", value: 125.0236042 },
      { source: "Liquid", target: "International shipping", value: 57.28499215 },
      { source: "Gas", target: "Losses", value: 11.41035458 }],
    size: [800,300],
    margin: { right: 130, bottom: 20 },
    networkType: "arc",
    nodeIDAccessor: "id",
    sourceAccessor: "source",
    targetAccessor: "target",
    nodeStyle: {stroke:"blue", fill:"red"},
    edgeStyle: {stroke:"green", fill:"none"},
    edgeWidthAccessor: "value",
    hoverAnnotation: true
  }



    return <div>

   <ResponsiveOrdinalFrame
        {...frameProps}
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

    <ResponsiveOrdinalFrame
        {...framePropsM}
        responsiveWidth={true}
    />
        <NetworkFrame
            nodes={Array.from(nodes)}
            edges={Array.from(edges)}
            nodeIDAccessor={'text_id'}
            nodeSizeAccessor={2}
            edgeStyle={{ stroke: '#9fd0cb', fill: 'none' }}
            networkType={{ type: 'force', forceManyBody: -250, distanceMax: 500, edgeStrength: 2 }}
        />
    </div>
}

export default Visualizer
