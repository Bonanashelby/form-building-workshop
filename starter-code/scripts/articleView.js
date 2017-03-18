'use strict';

var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();

  $('#articles').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    $(this).parent().find('*').fadeIn();
    $(this).hide();
  });
};
// initial display of the new article page
articleView.initNewArticlePage = function() {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later.
  $('.tab-content').show();


  // DONE: The new articles we create will be copy/pasted into our source data file.
  // We will eventually set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    // this.select selects the entire json link at the bottom of our article creation page
    this.select();
  });

  // DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-form').on('change', articleView.create);
};
// basically the form - logic and functionality of new article page
articleView.create = function() {
  // DONE: Set up a var to hold the new article we are creating.
  // Empty out the #articles element, so we can put in the updated preview
  var newArticle;
  $('#articles').empty();

  // DONE: Instantiate (using the obj constructor) an article based on what's in the form fields:
  newArticle = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    // ifChecked ? new Date : null
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });
  console.log(newArticle);

  // DONE: Use our interface (API) to the Handblebars template to put this new article into the DOM:
  $('#articles').append(newArticle.toHtml());

  // TODO: Activate the highlighting of any code blocks:
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // TODO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#export-field').show();
  $('#article-json').val(JSON.stringify(newArticle) + ',');

};

// methods to do the initial presentation of ea of the two documents -user interaction changes those displays
articleView.initIndexPage = function() {

  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(articleObject) {
    articles.push(new Article(articleObject));
  })

  articles.forEach(function(a){
    $('#articles').append(a.toHtml())
  });

  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
