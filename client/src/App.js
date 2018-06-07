import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { sitters: [] }

  componentDidMount() {
    this.getSitters()
      .then(sitters => {
        this.setState({ sitters: sitters })
      })
      .catch(err => console.log(err));
  }

  getSitters = async (minimumRating) => {
    this.setState( { sitters:[] } )
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
        <div className="App-intro">
          <Filter onSubmit={this.getSitters}/>
          <CardList sitters={this.state.sitters}/>
        </div>
      </div>
    );
  }
}

class Filter extends Component{
  state = {
    minimumRating: 0
  }

  handleSubmit = (event ) => {
    event.preventDefault();
    this.props.onSubmit(this.state.minimumRating);
  }
  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        Minimum Rating: <input type="range" min="0" max="5.0" value={this.state.minimumRating}
        onChange={ event => {
          this.setState({minimumRating: event.target.value})
        }
        }
      />
        <button>Search</button>
      </form>
    )
  }
}

const Card = (props) => {
  return(
    <div style={{margin:'1em'}}>
      <img style={{width: '100px'}} alt="A nice kitty" src={props.sitter_image}/>
      <div style={{display: 'inline-block', marginLeft:'1em'}}>
        <div style={{fontWeight: 'bold'}}>{props.sitter_name}</div>
        <div>{props.sitter_ranking}</div>
      </div>
    </div>
  )
}

const CardList = (props) => {
  return(
    <div>
      {props.sitters.map( sitter => <Card key={sitter._id} {...sitter} />)}
    </div>
  )
}

export default App;
