import { Component } from 'react';

// Component
import PokedexCard from "./Component/PokedexCard";

// Utils
import { capitalFirstLetter } from './PokemonUtils';

export default class PokemonType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pokemon : []
        }
    }

    async loadPokemonType (url) {
        const objPokemonTypeRes = await fetch(url);
        const objPokemonTypeData = await objPokemonTypeRes.json();

        Promise.all(objPokemonTypeData.pokemon.map(key =>
            fetch(key.pokemon.url).then(resp => resp.json())
        )).then(resp => {
            resp.map((key) => {
                const strName = key.name.charAt(0).toUpperCase() + key.name.slice(1);
                const strAvatar = key.sprites.other['official-artwork'].front_default || key.sprites.front_default;
                const arrAttributes = key.types.map((key) => capitalFirstLetter(key.type.name) + " " );
                this.setState({ pokemon : this.state.pokemon.concat([{ name : strName, avatar : strAvatar, attr : arrAttributes }]) });
                return null;
            });
        });
    }

    componentDidMount() {
        this.loadPokemonType(this.props.location.state.url);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.location.state.url !== this.props.location.state.url) {
            this.setState({ pokemon : [] });
            this.loadPokemonType(this.props.location.state.url);
        }
    }

    render () {
        return (
            <>
                <div className="content">
                    {this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} />)}
                </div>
            </>
        );
    }
}

