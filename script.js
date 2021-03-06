/* 
Inspired by the codepen at https://codepen.io/freeCodeCamp/pen/qRZeGZ
attributed to Gabriel Nunes with modification by Todd Chaffee.
Quote data source: https://raw.githubusercontent.com/ramespark/Database-Quotes-JSON/master/quotes.json
*/
let quoteData;

function loadQuoteData() {
  return $.ajax({
    headers: {
      Accept: 'application/json' },

    url: "https://raw.githubusercontent.com/ramespark/Database-Quotes-JSON/master/quotes.json",
    success: jsonQuotes => {
      quoteData = sanitizeQuoteData(
      JSON.parse(jsonQuotes));
      Object.freeze(quoteData);
    },
    error: () => {
      $('text').text("Servers are temporarily unreachable. No words...");
      $('author').text("Potent Quoteables");
    } });

}

function sanitizeQuoteData(data) {
  newData = [];
  data.map((value, index, array) => {
    let author = value.quoteAuthor.replace(/^(\W)[^\w]*/, '');
    let nocaseAuthor = new RegExp(author, "i");
    let text = [value.quoteText];
    data[index].quoteAuthor = author;
    if (newData.findIndex(a => nocaseAuthor.test(a.quoteAuthor)) == -1) {
      newData.push({ quoteAuthor: author, quoteText: [text] });
    } else {
      let i = newData.findIndex(a => nocaseAuthor.test(a.quoteAuthor));
      newData[i].quoteText.push(text);
    }
  });
  newData.sort((a, b) =>
  a.quoteAuthor.localeCompare(
  b.quoteAuthor));

  return newData;
}

function loadAuthorMenu(data) {
  let options = [
  "<option value='author-default'>the wind of chance</option>",
  ...data.map((value, index, array) => {
    let info = value.quoteText.length > 1 ?
    " (" + value.quoteText.length + ")" : '';
    let html =
    "<option class='author-option' value='author-" +
    index + "'>" + value.quoteAuthor + info +
    "</option>";
    return html;
  })];

  $('#author-select').html(options);
}

function getRandomQuote(data) {
  return data[
  Math.floor(Math.random() * data.length)];

}

function loadQuoteDisplay(quote) {
  let randomText = quote.quoteText[
  Math.floor(
  Math.random() * quote.quoteText.length)];


  let currentAuthor = quote.quoteAuthor;

  let encodedQuote = encodeURIComponent(
  '"' + randomText + '" ' + currentAuthor);

  let uriQuery = "hashtags=quotes&text=" +
  encodedQuote;

  $('#tweet-quote').attr(
  'href',
  "https://twitter.com/intent/tweet?" +
  uriQuery);


  $('#text').text(randomText);
  $('#author').text(currentAuthor);
}

$(document).ready(function () {
  loadQuoteData().then(() => {
    loadAuthorMenu(quoteData);
    loadQuoteDisplay(getRandomQuote(quoteData));
  });

  $('#author-select').on('change', () => {
    let val = $(
    '#author-select option:selected').
    val();
    let index = parseInt(val.match(/\d+/g));
    let quote = quoteData[index];
    loadQuoteDisplay(quote);
  });

  $('#reset-quote').on('click', () => {
    $('#author-select').val('author-default');
    loadQuoteDisplay(getRandomQuote(quoteData));
  });

  $('#new-quote').on('click', () => {
    if ($('#author-select option:selected').val() == 'author-default') {
      loadQuoteDisplay(getRandomQuote(quoteData));
    } else {
      let val = $('#author-select option:selected').val();
      let index = parseInt(val.match(/\d+/g));
      let quote = quoteData[index];
      console.log(quote);
      if (quote.quoteText.length > 1) {
        loadQuoteDisplay(quote);
      } else {
        $('#author-select').val('author-default');
        loadQuoteDisplay(getRandomQuote(quoteData));}
    }
  });
});