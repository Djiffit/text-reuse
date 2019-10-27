import gql from 'graphql-tag'

export const GET_CONNECTIONS = gql`
    query getConnections($filter: _TextFilter) {
        Text(filter: $filter, first: 50) {
            text_id
            title
            num_copiers
            num_copied
            publication_year {
                year
            }
            publication_location {
                place
            }
            copies_from {
                title
                text_id
            }
        }
    }
`
