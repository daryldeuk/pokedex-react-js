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

        console.log(objPokemonTypeData);

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

    componentWillReceiveProps (nextProps) {
        this.setState({ pokemon : [] }); // To prevent display the previous types
        this.loadPokemonType(nextProps.location.state.url);
    }

    render () {
        return (
            <>
                <div className="content">
                    {
                        (this.state.pokemon.length > 0) ?
                            this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} />)
                        : <h1>No results found... Please select other pokemon type</h1>
                    }
                </div>
            </>
        );
    }
}

