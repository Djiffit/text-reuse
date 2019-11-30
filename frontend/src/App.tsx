import React, { useEffect, useState } from 'react'
import ApolloClient from 'apollo-boost'
import './App.css'
import { ApolloProvider } from '@apollo/react-hooks'
import styled from 'styled-components'
import FilterView from 'components/FilterView'
import GraphList from 'components/GraphList'
import AppBar from '@material-ui/core/AppBar'
import { Typography } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { filterReducer } from 'store/filterReducer'
import { Provider } from 'react-redux'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
})

const store = createStore(filterReducer)

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 3fr;
`

const Header = styled.div`
  grid-column: 1 / -1;
  clear: both;
`

const HeaderTitle = styled.h5`
  margin: 25px 50px;
  font-size: 23px;
`

const App: React.FC = () => {
  const [things, setThings] = useState([{}])
  return (
    <div style={{maxWidth: '100vw'}}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <AppBar position='static' color='secondary'>
              <HeaderTitle>
                Text reuse application
              </HeaderTitle>
            </AppBar>
            <Switch>
              <Route path='/visualize'>
                <GridWrapper>
                  <FilterView />
                  <GraphList />
                </GridWrapper>
              </Route>
              <Route path='/compare'>
                <h1>Compare view Someday hopefully</h1>
              </Route>
              <Route path='/'>
                <FilterView />
                <FilterView />
              </Route>
            </Switch>
          </Router>
        </Provider>
      </ApolloProvider>
    </div>
  )
}

export default App
