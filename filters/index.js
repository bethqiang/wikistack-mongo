module.exports = swig => {
  const pageLink = page => '<a href="' + page.route + '">' + page.title + '</a>';
  pageLink.safe = true;
  swig.setFilter('pageLink', pageLink);
};
