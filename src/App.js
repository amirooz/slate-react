import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import List from './components/convertkit/slate-lists/docs/test-editor'
import Editor from './components/Home'
import Upload from './components/Upload'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/list" component={List} />
                    <Route path="/editor" component={Editor} />
                    <Route path="/upload" component={Upload} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
