import React, { Component } from 'react';

// CSS
import './Pokedex.css';

// Image
import logo from './img/logo.png';

export default class Pokedex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemon : [],
            pokemon_type : [],
            pokemon_type_color : {
                'bug' : '#A6B91A',
                'dark' : '#705746',
                'dragon' : '#6F35FC',
                'electric' : '#F7D02C',
                'fairy' : '#D685AD',
                'fighting' : '#C22E28',
                'fire' : '#EE8130',
                'flying' : '#A98FF3',
                'ghost' : '#735797',
                'grass' : '#7AC74C',
                'ground' : '#E2BF65',
                'ice' : '#96D9D6',
                'normal' : '#A8A77A',
                'poison' : '#A33EA1',
                'psychic' : '#F95587',
                'rock' : '#B6A136',
                'shadow' : '#5C6174',
                'steel' : '#B7B7CE',
                'unknown' : '#D1CFCD',
                'water' : '#6390F0'
            },
            isSelected : false,
        }
    }

    async componentDidMount() {

        const objPokemonTypeRes = await fetch('https://pokeapi.co/api/v2/type/');
        const objPokemonTypeData = await objPokemonTypeRes.json();

        // Sort the results alphabetically order
        objPokemonTypeData.results.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });
        objPokemonTypeData.results.map(key =>
            this.setState({ pokemon_type : this.state.pokemon_type.concat([{ name : key.name, url : key.url }])})
        );

        const objPokedexRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const objPokedexData = await objPokedexRes.json();

        Promise.all(objPokedexData.results.map(key =>
            fetch(key.url).then(resp => resp.json())
        )).then(resp => {
            resp.map((key) => {
                const strName = key.name.charAt(0).toUpperCase() + key.name.slice(1);
                const strAvatar = key.sprites.other['official-artwork'].front_default;
                const arrAttributes = key.types.map((key) => key.type.name.charAt(0).toUpperCase() + key.type.name.slice(1) + " " );
                // console.log('name : ' + strName + ' avatar ' + strAvatar + ' attr : ' + arrAttributes);
                this.setState({ pokemon : this.state.pokemon.concat([{ name : strName, avatar : strAvatar, attr : arrAttributes }]) });
                return null;
            });
        });
    }

    render() {
        return (
            <>
                <div className="wrapper">
                    <div className="header">
                        <PokemonLogo src={logo} />
                    </div>
                    <div className="nav">
                        <h4 align="center">Select Type</h4>
                        <ul>
                            {this.state.pokemon_type.map((key, idx) =>  <PokemonLabelType index={idx} url={key.url} name={key.name} bgcolor={this.state.pokemon_type_color[key.name]} />)}
                        </ul>
                    </div>
                    <div className="content">
                        {this.state.pokemon.map((key) => <PokedexCard name={key.name} avatar={key.avatar} attr={key.attr} /> )}
                    </div>
                </div>
            </>
        )
    }
}

class PokedexCard extends Component {
    render () {
        return (
            <div className="card">
                <div className="card-img">
                    <img src={this.props.avatar} alt="Avatar" className="card-img-avatar" />
                </div>
                <div className="card-details">
                    <h4><b>{this.props.name}</b></h4>
                    {this.props.attr.map((res) => <PokedexLabelType type={res} key={res} />)}
                </div>
            </div>
        )
    }
}

class PokedexLabelType extends Component {
    render () {
        return (
            <span className="card-label">{this.props.type}</span>
        )
    }
}

class PokemonLogo extends Component {
    render () {
        return (
            <img src={this.props.src} alt="Logo" className="logo" />
        )
    }
}

class PokemonLabelType extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render () {
        return (
            <li key={this.props.index} style={{ backgroundColor: `${this.props.bgcolor}` }}><a href={`${this.props.url}`}>{this.props.name}</a></li>
        )
    }
}