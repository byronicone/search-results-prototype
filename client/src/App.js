import React, { Component } from 'react';
import {splitEvery} from 'ramda';
import {range} from 'ramda';
import logo from './logo.svg';
import browseIcon from './icon_browse_sitter.svg';
import heartIcon from './icon_heart_shield.svg';
import payIcon from './icon_phone_pay.svg';
import speechIcon from './icon_speech_bubbles.svg';
import StarRatingComponent from 'react-star-rating-component';
import './App.css';


class App extends Component {
  state = { sitters: [], page: 1, lastPage:1}

  componentDidMount() {
    this.getSitters();
  }

  getSitters = async (minimumRating) => {
    const response = await fetch(`/api/sitters?minimumRating=${minimumRating}`);
    const sitters = await response.json();
    this.setState({sitters: sitters, page: 1, lastPage: sitters.length/10});
  }

  changePage = (newPage) => {
    this.setState( (prevState) => {
      prevState.page = newPage;
      return prevState;
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">We're the dog people.</h1>
        </header>
        <div className="App-intro">
          <div className="star-ratings">
          <div>Choose a standard of excellence for your pooch's new pal!</div>
            <StarRatingComponent
              name="minimumRatingFilter"
              starCount={5}
              value={this.state.minimumRating}
              onStarClick={this.getSitters.bind(this)}
            />
          </div>
          <CardList page={this.state.page} sitters={this.state.sitters}/>
          <Paginator onPageClick={this.changePage} currentPage={this.state.page} lastPage={this.state.lastPage}/>
        </div>
      </div>
    );
  }
}

const Card = (props) => {
  return(
    <div style={{marginBottom: '1.5em', marginLeft: '3em', marginRight:'3em', display: 'inline-block'}}>
      <img style={{height: '12em'}} alt="A nice kitty" src={props.sitter_image}/>
      <div >
        <div style={{margin: '.5em'}}>
          <div className="sitter-details" style={{fontWeight: 'bold'}}>{props.sitter_name}</div>
          <div className="sitter-details"> Rating: {props.sitter_rating_avg}</div>
        </div>
        <div className="sitter-actions">
          <img src={browseIcon} className="action-icon" alt="browse" />
          <img src={heartIcon} className="action-icon" alt="like" />
          <img src={payIcon} className="action-icon" alt="pay" />
          <img src={speechIcon} className="action-icon" alt="contact" />
        </div>
      </div>
    </div>
  )
}

const CardList = (props) => {

  let currentPage = props.sitters;

  if(props.sitters.length > 10){
    currentPage = splitEvery( 10, props.sitters )[props.page - 1];
  }

  return(
    <div style={{margin: '3em'}}>
      {currentPage.map( sitter => <Card key={sitter._id} {...sitter} />)}
    </div>
  )
}

const Paginator = (props) => {
  const allPageNumbers = range(1, props.lastPage + 1);

  const selectIfCurrent = (pageNumber) => {
    if(props.currentPage === pageNumber){
      return 'selected';
    }
  }

  return(
    <div style={{width: '100%'}}>
    {allPageNumbers.map( (page, i) => {
      return <span key={i} className={selectIfCurrent(page)}
      style={{display: 'inline-block', borderRadius: '50%', margin: '0.5em', width: '24px',
          cursor: 'pointer', backgroundColor: '#59ce97', textAlign: 'center'}}
        onClick={ () => props.onPageClick(page)}>
        {page}
      </span>
     })}
    </div>
  )
}

export default App;
