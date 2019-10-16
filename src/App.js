import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import List from './components/convertkit/slate-lists/docs/test-editor'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/list" component={List} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
