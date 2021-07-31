import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

// Component
import PokemonType from './PokemonType';
import PokemonAll from './PokemonAll';

// CSS
import './Pokedex.css';

// Image
import logo from './img/logo.png';

// Utils
import { capitalFirstLetter, getQueryParam, getBgColor } from './PokemonUtils';

export default class Pokedex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemon_type : [],
            results : 0,
            limit : 100,
            currentpage : 1,
            lastpage : 0,
            pages : []
        }
    }

    async loadAllPokemon () {
        const objPokedexRes = await fetch('https://pokeapi.co/api/v2/pokemon');
        const objPokedexData = await objPokedexRes.json();
        let lastPage = parseInt(objPokedexData.count / this.state.limit);
        if ((objPokedexData.count % this.state.limit) > 0)
            lastPage++;

        for (let i = 0; i < lastPage; i++) {
            this.setState({ pages : this.state.pages.concat([i + 1]) })
        }
        
        this.setState({ results : objPokedexData.count, lastpage : lastPage });

        console.log(this.state.pages);

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
    }

    componentDidMount() {
        this.loadAllPokemon();        
    }

    render() {
        return (
            <>
                <Router>
                    <div className="wrapper">
                        <div className="header">
                            <PokemonLogo src={logo} />
                        </div>
                        <PaginationButton name="First" page="1" />
                        {
                            this.state.pages.map((key) => 
                                <PaginationButton name={key} page={key} />
                            )

                        }
                        <PaginationButton name="Last" page={this.state.lastpage} />
                        <div className="nav">
                            <h4 align="center">Select Type</h4>
                            <ul>
                                <Link to='/' key='-888'>
                                    <PokemonLabelType
                                        index='-888'
                                        name='All'
                                        bgcolor={getBgColor('all')}
                                        key='-888'
                                    />
                                </Link>
                                {this.state.pokemon_type.map((key, idx) =>
                                    <Link to={{ pathname: `/type/${getQueryParam(key.url)}`, state : { url : key.url} }} key={idx}>
                                        <PokemonLabelType
                                            index={idx}
                                            url={key.url}
                                            name={capitalFirstLetter(key.name)}
                                            bgcolor={getBgColor(key.name)}
                                            key={idx}
                                        />
                                    </Link>
                                )}
                            </ul>
                        </div>
                    </div>

                    <Route exact path="/" component={PokemonAll} />
                    <Route path="/type/:_id" component={PokemonType} />
                </Router>
            </>
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
    render () {
        return (
            <li key={this.props.index} style={{ backgroundColor: `${this.props.bgcolor}` }}>{this.props.name}</li>
        )
    }
}

class PaginationButton extends Component {
    render () {
        return (
            <Link to={{ pathname: `/`, state : { page : this.props.page} }} key={this.props.lastpage}>
                <button className="page-btn">{this.props.name}</button>
            </Link>
        )
    }
}