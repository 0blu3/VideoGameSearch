'use strict';

(function(module) {
  const searchView = {}

  searchView.displaySearchResults = (data) => {
    let template = Handlebars.compile($('#top-games-template').html()); //eslint-disable-line

    $('.top-games-li').remove();

    $('#index').append(Game.allGames.filter((item) => { //eslint-disable-line
      if (item.name.toLowerCase().indexOf(data.toLowerCase()) >= 0) {
        return true;
      }
    })
    .map(template));

    $('#games-label').text('Search Results');
    $('#index').show().siblings().hide();
  }

  searchView.setButtonHandler = (callback) => {
    console.log('initialized');
    $('#btn-search').on('click', (e) => {
      // e.preventDefault();
      console.log('clicked');
      let data = $('#box-search').val();
      console.log(data, ':box search value');
      callback(data);
    })
  }

  searchView.setButtonHandler(searchView.displaySearchResults);
  module.searchView = searchView;
})(window);
