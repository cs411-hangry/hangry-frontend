import Link from "next/link";
import Nav from "../components/nav";
import request from "superagent";
import React, {Component, Button} from "react";
import Dropzone from "react-dropzone";



export default class Cuisine extends Component {

    state = {
        restaurants: [],
        restaurantsIds: [],
    }

    getRestuarants = async (id) => {
        const res =  await fetch("http://localhost:5000/serves/cuisine/" + this.props.url.query.id, 
            {headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${  sessionStorage.getItem('jwt')}`,
            },});
        
        const data = await res.json()
        const restaurants = data.restaurants.map(r => r.restaurant_name)
        const restaurantsIds = data.restaurants.reduce( (p,c) => (p[c.restaurant_name] = c.restaurant_id) && p, {})
        this.setState({
            restaurants,
            restaurantsIds
        })
      }
    
    componentDidMount() {
        this.getRestuarants(this.props.url.query.id)
    }

	render() {
		return (
			<div>
				<Nav />

                {this.state.restaurants.map( name => 
                    <div> 
                        <Link key={name} href={"/restaurant?id=" + this.state.restaurantsIds[name]}>
                            <a>{name}</a>
                        </Link>
                    </div>

                    )}

			</div>
		);
	}
}
