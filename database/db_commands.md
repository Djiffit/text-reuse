USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM 'file:///texts.csv' AS row
MERGE (a:Text {text_id: row.id, title: row.title})

LOAD CSV WITH HEADERS FROM 'file:///actors.csv' AS row
MERGE (a:Actor {actor_id: row.actor_id})
ON CREATE SET a.name = row.name
ON MATCH SET a.name = row.name

USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM 'file:///year_connections.csv' AS row
WITH row WHERE row.year IS NOT NULL
MERGE (t:Text {text_id: row.text})
MERGE (a:Year {year: row.year})
MERGE (t)-[r:PUBLISHED_IN]->(a)

USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM 'file:///place_connections.csv' AS row
WITH row WHERE row.place IS NOT NULL
MERGE (t:Text {text_id: row.text})
MERGE (a:Place {place: row.place})
MERGE (t)-[r:HAS_LOCATION]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row, (
CASE row.type
WHEN 'author' THEN 'HAS_AUTHOR'
WHEN 'printer' THEN 'HAS_PRINTER'
WHEN 'publisher' THEN 'HAS_PUBLISHER'
WHEN 'bookseller' THEN 'HAS_BOOKSELLER'
WHEN 'corporate author' THEN 'HAS_CORPORATE_AUTHOR'
WHEN 'geographic record' THEN 'HAS_GEOGRAPHIC_RECORD'
WHEN 'unknown' THEN 'HAS_UNKNOWN'
WHEN 'translator' THEN 'HAS_TRANSLATOR'
WHEN 'editor' THEN 'HAS_EDITOR'
WHEN 'engraver' THEN 'HAS_ENGRAVER'
ELSE 'OTHER' END
) as type
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:type]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'printer' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_PRINTER]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'author' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_AUTHOR]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'publisher' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_PUBLISHER]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'bookseller' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_BOOKSELLER]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'corporate author' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_CORPORATE_AUTHOR]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'geographic record' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_GEOGRAPHIC_RECORD]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'unknown' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_UNKNOWN]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'translator' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_TRANSLATOR]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'editor' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_EDITOR]->(a)

LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'engraver' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_ENGRAVER]->(a)


LOAD CSV WITH HEADERS FROM 'file:///entity_connections.csv' as row
WITH row WHERE row.type = 'other' and row.entity IS NOT NULL and row.text IS NOT NULL
MERGE (a:Actor {actor_id: row.entity})
MERGE (t:Text {text_id: row.text})
MERGE (t)-[r:HAS_OTHER]->(a)

USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM 'file:///cluster_connections-5.csv' as row
WITH row WHERE row.from IS NOT NULL and row.to IS NOT NULL and row.cluster IS NOT NULL
MERGE (f:Text {text_id: row.from})
MERGE (t:Text {text_id: row.to})
MERGE (f) - [:USES_FRAGMENT {cluster_id: row.cluster}] -> (t)
