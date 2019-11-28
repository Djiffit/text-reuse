import gql from 'graphql-tag'

export const GET_CONNECTIONS = gql`
    query getReuses($author: String, $yearStart: Int, $yearEnd: Int, $title: String, $location: String, $internal: Boolean, $external: Boolean) {
        reuses(author: $author, yearStart: $yearStart, yearEnd: $yearEnd, title: $title, location: $location, internal: $internal, external: $external ) {
            reuses {
                source
                reuser
                count
            }
            texts {
                id
                year
                author
                title
                location
            }
        }
    }
`
