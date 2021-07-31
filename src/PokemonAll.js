import { Component } from "react";
// import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

// Component
import PokedexCard from "./Component/PokedexCard";

// Utils
import { capitalFirstLetter } from "./PokemonUtils";

export default class PokemonAll extends Component {

    constructor (props) {
        super(props);
        console.log()
        this.state = {
            pokemon : [],
            limit : 100,
            results : 0,
            currentpage : 1
        }
    }

    async loadAllPokemon (page) {
        page = page === undefined ? this.state.currentpage : page;
        let limit = this.state.limit * page;
        let offset = limit - 100;
        // console.log(this.state);
        const objPokedexRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=' + limit + '&offset=' + offset);
        const objPokedexData = await objPokedexRes.json();
        this.setState({ results : objPokedexData.count });

        Promise.all(objPokedexData.results.map(key =>
            fetch(key.url).then(resp => resp.json())
        )).then(resp => {
            resp.map((key) => {
                const strName = key.name.charAt(0).toUpperCase() + key.name.slice(1);
                const strAvatar = key.sprites.other['official-artwork'].front_default;
                const arrAttributes = key.types.map((key) => capitalFirstLetter(key.type.name) + " " );
                this.setState({ pokemon : this.state.pokemon.concat([{ name : strName, avatar : strAvatar, attr : arrAttributes }]) });
                return null;
            });
        });
    }

    componentDidMount() {
        this.loadAllPokemon(this.state.currentpage);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.state !== this.props.location.state) {
            console.log('change page');
            console.log(this.props.location.state.page);
            this.loadAllPokemon(this.props.location.state.page);
            this.setState({ pokemon : [] });
        }
    }

    render () {
        return (
            <>
                {
                    
                    <div className="content">
                        {this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} key={key.name} />)}
                    </div> 
                }
                
            </>
        )
    }
}