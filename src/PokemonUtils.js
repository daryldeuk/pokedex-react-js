function capitalFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function getQueryParam (str) {
    return str.split('/')[str.split('/').length - 2];
}

function getBgColor (str) {
    let pokemon_type_color = {
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
        'water' : '#6390F0',
        'all' : '#FFFFFF'
    };

    return pokemon_type_color[str];
}

export {
    capitalFirstLetter,
    getQueryParam,
    getBgColor
}