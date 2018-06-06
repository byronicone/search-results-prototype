import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { sitters: [] }

  componentDidMount() {
    let divs = [];
    this.getSitters()
      .then(sitters => {
        sitters.map( (sitter) => {
            divs.push(
               sitter._id+'\n'
            )
        })
        this.setState({ sitters: divs })
      })
      .catch(err => console.log(err));
  }

  getSitters = async () => {
    const response = await fetch('/api/sitters');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">We're the dog people.</h1>
        </header>
        <p className="App-intro">
          <Result sitters={this.state.sitters}/>
        </p>
      </div>
    );
  }
}

const Result = (props) => {
  return(
    <div>{props.sitters}</div>
  )
}

export default App;
