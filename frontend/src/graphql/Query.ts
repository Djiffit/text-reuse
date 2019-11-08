import gql from 'graphql-tag'

export const GET_CONNECTIONS = gql`
    query getConnections($filter: _TextFilter) {
        Text(filter: $filter, first: 200) {
            text_id
            title
            publication_year {
                year
            }
            publication_location {
                place
            }
            author {
                name
            }
            copies_from {
                title
                text_id
                author {
                    name
                }
                publication_location {
                    place
                }
                publication_year {
                    year
                }
            }
        }
    }
`
