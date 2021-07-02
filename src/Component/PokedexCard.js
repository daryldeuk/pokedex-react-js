import React, { Component } from 'react';

export default class PokedexCard extends Component {
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