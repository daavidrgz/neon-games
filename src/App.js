import React from 'react';
import Music from './components/Music'
import Home from './pages/home'
import Games from './pages/games/games'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route } from 'react-router-dom'
import './styles/globals.css'
import './styles/glider.css'

export default function App() {
  return (
    <>
      <Music />
      
      <Router history={createBrowserHistory()}>
        <Switch>
          <Route path="/games">
            <Games />
          </Route>

          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </Router>
    </>
  );
}
