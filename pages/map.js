import Link from "next/link";
import Nav from "../components/nav";
import React, {Component} from 'react';
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker
} from "react-google-maps";

const MyMapComponent =  compose(
	withProps({
		googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjAYqAYLMEADjHTaoRfCm2AvuRfkMgdhU&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "400px" }} />,
		mapElement: <div style={{ height: "100%" }} />
	}),
	withScriptjs,
	withGoogleMap
)(props => (
	<GoogleMap defaultZoom={12} defaultCenter={props.locations[0]}>
    {props.isMarkerShown &&  props.locations.map( l => 
        <Marker position={l} title="hello" />
    )}
	</GoogleMap>
));

export default class Map extends Component {

	constructor(props) {
		super(props);
		this.state = {
			restaurants: {}, 
			ids: [], 
			cuisines: [],
			cuisineIds: {},
			locations: [{ lat: 40.1298, lng:-88.2582 }],
			map_state: "none"
		};
		this.locations()
		
	  }

	async locations() {
		const res = await fetch("http://localhost:5000/locations", 
		{headers: {
		  'content-type': 'application/json',
		  Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
		},});
	  	const data = await res.json()
		const locations = data.locations.map(location => JSON.parse(JSON.stringify({ "lat": location.latitude, "lng": location.longitude })) )
		this.setState({
			locations
		});

	}
	  
	async restaurants() {
	  const res = await fetch("http://localhost:5000/restaurants", 
		{headers: {
		  'content-type': 'application/json',
		  Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
		},});
	  const data = await res.json()
	  const restaurants = data.restaurants.reduce( (p,c) => (p[c.restaurant_id] = c.restaurant_name) && p, {})
		const ids = data.restaurants.map(restaurant => restaurant.restaurant_id)
	  this.setState({
		  restaurants,
		  ids,
		  map_state: "restaurants"
		});
		this.locations()
	};
  
	async cusines() {
		const res = await fetch("http://localhost:5000/cuisines", 
		  {headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
		  },});
		const data = await res.json()
		const cuisines = data.cuisines.map(cuisine => cuisine.cuisine_name)
		const cuisineIds = data.cuisines.reduce( (p,c) => (p[c.cuisine_name] = c.cuisine_id) && p, {})
		this.setState({
		  cuisines,
		  cuisineIds,
		  map_state: "cusine"
		});
	  };

	  async checkins() {
		const res = await fetch("http://localhost:5000/leaderboard/map/4", 
		  {headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
		  },});
		const data = await res.json()
		const locations = data.locations.map(r => JSON.parse(JSON.stringify({ "lat": r.latitude, "lng": r.longitude })))
		this.setState({
			locations,
		  map_state: "checkins"
		});
	  };

	async getCusinesRestrauants(food) {
		  const res =  await fetch("http://localhost:5000/locations/cuisine/" + this.state.cuisineIds[food], 
            {headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
			},});
			const restaurants = await res.json()
			const locations = restaurants.locations.map(r => JSON.parse(JSON.stringify({ "lat": r.latitude, "lng": r.longitude })))
			this.setState({
				locations
			});
	}

	render() {
	  return (
		<div>
		  <Nav />
		  <MyMapComponent isMarkerShown locations={this.state.locations}/>
		  <button onClick= {this.restaurants.bind(this)}>
			Get Restaurants
		  </button>
		  <button onClick= {this.cusines.bind(this)}>
			Get Cuisnes
		  </button>
		  <button onClick= {this.checkins.bind(this)}>
			Checkins Near Me
		  </button>
  
		  {this.state.map_state === "restaurants" && this.state.ids.map( id => 
		  <div> 
			  <Link key={id} href={"/restaurant?id=" + id}>
				  <a>{this.state.restaurants[id]}</a>
			  </Link>
		   </div>
		  )}

		  {this.state.map_state === "cusine" && this.state.cuisines.map( food => 
			<div> 
				<button onClick={this.getCusinesRestrauants.bind(this, food)}>{food}</button>
			</div>
        	)}
		</div>
	  );
	}
  }
  