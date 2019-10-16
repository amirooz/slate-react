import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import PDF from './components/Pdf'
import List from './components/convertkit/slate-lists/docs/test-editor'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/list" component={List} />
                    <Route path="/pdf" component={PDF} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
