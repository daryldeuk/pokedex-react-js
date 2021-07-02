import { Component } from "react";

// Component
import PokedexCard from "./Component/PokedexCard";

// Utils
import { capitalFirstLetter } from "./PokemonUtils";

export default class PokemonAll extends Component {

    constructor (props) {
        super(props);
        this.state = {
            pokemon : []
        }
    }

    async componentDidMount() {
        const objPokedexRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const objPokedexData = await objPokedexRes.json();

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

    render () {
        return (
            <>
                <div className="content">
                    {this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} key={key.name} />)}
                </div>
            </>
        )
    }
}