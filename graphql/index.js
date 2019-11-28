const { ApolloServer, gql } = require('apollo-server')
const { Pool, Client } = require('pg')

process.env.connection = process.env.connection || 'postgres://postgres:@db:5432/postgres'

const connection = process.env.connection
const client = new Client(connection)
client.connect().then(c => c)

const typeDefs = gql`
  type Text {
    id: String
    year: Int
    author: String
    title: String
    location: String
  }

  type Reuse {
    source: String
    reuser: String
    count: Int
  }

  type ReuseData {
    reuses: [Reuse]
    texts: [Text]
  }

  type Query {
    reuses(author: String, location: String, yearStart: Int, yearEnd: Int, title: String, internal: Boolean, external: Boolean): ReuseData
  }
`

const resolvers = {
  Query: {
    reuses: (_, args, context) => getReuses(args, context)
  }
}
const reuseQuery = {
  name: 'get-reuses',
  text: `SELECT t.author, t.id, r.count, t.year, t.title, t.location, r.source, r.reuser, te.author as rAuthor, te.id as rId, te.year as rYear, te.title as rTitle, te.location as rLocation 
         FROM texts t 
         RIGHT JOIN reuses r ON t.id = r.source 
         LEFT JOIN (SELECT * FROM texts) as te ON te.id = r.reuser
         WHERE LOWER(t.author) LIKE '%' || $1 || '%' AND t.year >= $2 AND t.year <= $3 AND LOWER(t.title) LIKE '%' || $4 || '%' AND LOWER(t.location) LIKE '%' || $5 || '%'`,
  values: [],
}

// UNION 
// SELECT te.author, te.id, r.count, te.year, te.title, te.location, r.source, r.reuser 
// FROM texts te RIGHT JOIN reuses r ON te.id = r.reuser LEFT JOIN (
//  SELECT id 
//  FROM texts 
//  WHERE LOWER(author) LIKE '%' || $1 || '%' AND year >= $2 AND year <= $3 AND LOWER(title) LIKE '%' || $4 || '%' AND LOWER(location) LIKE '%' || $5 || '%'
//  ) as source ON source.id = r.source

const startSet = {
  name: 'get-reuses',
  text: `SELECT id from texts
         WHERE LOWER(t.author) LIKE '%' || $1 || '%' AND t.year >= $2 AND t.year <= $3 AND LOWER(t.title) LIKE '%' || $4 || '%' AND LOWER(t.location) LIKE '%' || $5 || '%'`,
  values: [],
}

const getReuses = async ({ author = '', location = '', yearStart = 0, yearEnd = 2000, title = '', internal = false, external = false }, { client }) => {
  const params = [author.toLowerCase(), yearStart, yearEnd, title.toLowerCase(), location.toLowerCase()]
  reuseQuery.values = params

  const res = (await client.query(reuseQuery)).rows

  const reuses = res.map(({ source, reuser, count }) => ({ source, reuser, count }))
  let texts = [...res.map(row => ({ id: row.id, year: row.year, author: row.author, title: row.title, location: row.location })), ...res.map(row => ({ id: row.rid, year: row.ryear, author: row.rauthor, title: row.rtitle, location: row.rlocation }))]
  const usefulTexts = {}

  texts.forEach(text => {
    if (!usefulTexts[text.id]) {
      usefulTexts[text.id] = text
    }
  })
  reuses.forEach(({ source, reuser }) => {
    try {
      usefulTexts[source]['used'] = true
      usefulTexts[reuser]['used'] = true
    } catch (e) {
      console.log(e, source, reuser)
    }
  })

  texts = texts.filter(t => t.used)


  if (internal || external) {
    const startSet = new Set((await client.query(reuseQuery)).rows.map(r => r.id))

    if (internal) {
      return { reuses: reuses.filter(({ reuser }) => startSet.has(reuser)), texts }
    }

    if (external) {
      return { reuses: reuses.filter(({ reuser }) => !startSet.has(reuser)), texts }
    }
  }

  console.log(reuses.length, texts.length)

  return { reuses, texts }
}

new ApolloServer({
  typeDefs,
  resolvers,
  context: { client },
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))

