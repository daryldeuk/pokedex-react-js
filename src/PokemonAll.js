import { Component } from "react";
// import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

// Component
import PokedexCard from "./Component/PokedexCard";

// Utils
import { capitalFirstLetter } from "./PokemonUtils";

export default class PokemonAll extends Component {

    constructor (props) {
        super(props);
        this.state = {
            pokemon : [],
            limit : 100,
            offset : 0,
            results : 0
        }
    }

    firstPage() {
        this.setState({
            offset : 0,
            limit : 100,
            pokemon: []
        });
    }

    lastPage() {
        this.setState({
            offset : this.state.limit * parseInt(this.state.results / this.state.limit),
            limit : 100,
            pokemon: []
        });
    }

    async loadAllPokemon () {
        const objPokedexRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=' + this.state.limit + '&offset=' + this.state.offset);
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
        this.loadAllPokemon();
    }

    componentDidUpdate(prevProps) {

    }

    render () {
        return (
            <>
                {/* <Router>
                    <Link to={{ pathname: '/', state : { page : 0} }} key="0">
                        <button onClick={() => this.firstPage()}>&#60;&#60;</button>
                    </Link>
                    <Link to={{ pathname: '/', state : { page : 1} }} key="1">
                        <button>1</button>
                    </Link>
                    <Link to={{ pathname: '/', state : { page : 2} }} key="2">
                        <button>2</button>
                    </Link>
                    <Link to={{ pathname: '/', state : { page : 12} }} key="12">
                        <button onClick={() => this.lastPage()}>&#62;&#62;</button>
                    </Link>

                    <Route exact path="/" component={PokemonAll} />
                </Router> */}
                <div className="content">
                    {this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} key={key.name} />)}
                </div>

            </>
        )
    }
}