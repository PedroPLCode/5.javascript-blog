'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  optTagsListSelector = '.tags',
  optAuthorsListSelector = '.authors',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';


/**
 * Remove class 'active' from all article links,
 * add class 'active' to the clicked link,
 * remove class 'active' from all articles,
 * get 'href' attribute from the clicked link,
 * find the correct article using the selector (value of 'href' attribute),
 * add class 'active' to the correct article.
 */
function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const hrefAtribute = clickedElement.getAttribute("href");

  const allArticles = document.querySelectorAll('.posts article');
  for(let singleArticle of allArticles){
    if (("#" + singleArticle.getAttribute("id")) == hrefAtribute) {
      singleArticle.classList.add('active');
    }
  }
}


/**
 * Remove contents of titleList.
 * Then for each article:
 * * get the article id,
 * * find the title element
 * * get the title from the title element,
 * * insert link into titleList.
 * Insert titleList into ul list,
 * Start titleClickHandler() for each link.
 */
function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html='';

  for (let article of articles) {
    const articleId = article.getAttribute("id");
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}


/**
 *
 */
function calculateTagsParams(tags) {
  const params = {max: 0, min: 999999};

  for (let tag in tags) {

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }

  return params;
}


/**
 *
 */
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return (optCloudClassPrefix + classNumber);
}


/**
 * create a new variable allTags with an empty object
 * find all articles
 * START LOOP: for every article:
 * * find tags wrapper
 * * make html variable with empty string
 * * get tags from data-tags attribute
 * * split tags into array
 * * START LOOP: for each tag
 * * * generate HTML of the link
 * * * add generated code to html variable
 * * * check if this link is NOT already in allTags
 * * * add tag to allTags object
 * * END LOOP: for each tag
 * * insert HTML of all the links into the tags wrapper
 * END LOOP: for every article
 * find list of tags in right column
 * add html from allTags to tagList
*/
function generateTags(){
  const articles = document.querySelectorAll(optArticleSelector);
  let allTags = {};

  for (let article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    tagsWrapper.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute("data-tags");
    const articleTagsArray = articleTags.split(' ');

    for (let singleTag of articleTagsArray) {
      const linkHtml = '<li><a href="#tag-' + singleTag + '">' + singleTag + '</a></li>';
      html = html + linkHtml;

      if(!allTags.hasOwnProperty(singleTag)){
        allTags[singleTag] = 1;
      } else {
        allTags[singleTag]++;
      }
    }

    tagsWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(optTagsListSelector);
  let allTagsHtml = '';
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  for (let singleTag in allTags) {
    const tagLinkHtml = '<li><a href="#tag-' + singleTag + '" class="' + calculateTagClass(allTags[singleTag], tagsParams) + '">' + singleTag + '</a></li>';
    allTagsHtml += tagLinkHtml;
  }

  const lastLinkHtml = '<li><a href="#tag-all" class="tag-size-5">All Tags</a></li>';
  allTagsHtml += lastLinkHtml;

  tagList.innerHTML = allTagsHtml;
}


/*
* prevent default action for this event
* make new constant named "clickedElement" and give it the value of "this"
* make a new constant "href" and read the attribute "href" of the clicked element
* make a new constant "tag" and extract tag from the "href" constant
* find all tag links with class active
* START LOOP: for each active tag link
* * remove class active
* END LOOP: for each active tag link
* find all tag links with "href" attribute equal to the "href" constant
* START LOOP: for each found tag link
* * add class active
* END LOOP: for each found tag link
* execute function "generateTitleLinks" with article selector as argument
*/
function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const tag = href.replace('#tag-', '');

  const activeTagLinks = document.querySelectorAll('.post-tags .list a.active');

  for (let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }

  const activeTags = document.querySelectorAll('.tags a');

  for (let activeTag of activeTags) {
    activeTag.classList.remove('active');
  }

  const activeAuthors = document.querySelectorAll('.authors a');

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

  if (tag == 'all') {
    console.log('all');
    generateTitleLinks();
  } else {
    console.log(tag);
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
}


/**
 * find all links to tags
 * START LOOP: for each link
 * * add tagClickHandler as event listener for that link
 * END LOOP: for each link
*/
function addClickListenersToTags(){
  const links = document.querySelectorAll('a[href^="#tag-"]');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}


/**
 * find all articles
 * START LOOP: for every article:
 * * find author wrapper
 * * get author from data-author attribute
 * * create html link for author
 * * inster html link to the authot wrapper
 * END LOOP: for every article:
*/
function generateAuthors(){
  const articles = document.querySelectorAll(optArticleSelector);
  const authorsList = document.querySelector(optAuthorsListSelector);
  authorsList.innerHTML = '';

  let allAuthorsHtml = '';

  let allAuthors = {};

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorsSelector);
    authorWrapper.innerHTML = '';
    const articleAuthor = article.getAttribute("data-author");
    const linkHtml = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    authorWrapper.innerHTML = linkHtml;

    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  for (let articleAuthor in allAuthors) {
    const singleLinkHtml = '<li><a href="#author-' + articleAuthor + '"><span class="author-name">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ') </span></a></li>';

    allAuthorsHtml += singleLinkHtml;
  }

  const lastLinkHtml = '<li><a href="#author-all"><span class="author-name">Show all articles</span></a></li>';
  allAuthorsHtml += lastLinkHtml;

  authorsList.innerHTML = allAuthorsHtml;
}


/*
* prevent default action for this event
* make new constant named "clickedElement" and give it the value of "this"
* make a new constant "href" and read the attribute "href" of the clicked element
* make a new constant "author" and extract author from the "href" constant
* find all author links with class active
* START LOOP: for each active author link
* * remove class active
* END LOOP: for each active author link
* find all author links with "href" attribute equal to the "href" constant
* START LOOP: for each found author link
* * add class active
* END LOOP: for each found author link
* execute function "generateTitleLinks" with article selector as argument
*/
function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const activeAuthorsLinks = document.querySelectorAll('.post-author a.active');

  for (let activeAuthorLink of activeAuthorsLinks) {
    activeAuthorLink.classList.remove('active');
  }

  const activeAuthors = document.querySelectorAll('.authors a');

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  const activeTags = document.querySelectorAll('.tags a');

  for (let activeTag of activeTags) {
    activeTag.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  if (author == 'all') {
    console.log('all');
    generateTitleLinks();
  } else {
    generateTitleLinks('[data-author="' + author + '"]');
  }
}


/**
 * find all links to authors
 * START LOOP: for each link
 * * add authorClickHandler as event listener for that link
 * END LOOP: for each link
*/
function addClickListenersToAuthors(){
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}


generateTags();

generateAuthors();

generateTitleLinks();

addClickListenersToTags();

addClickListenersToAuthors();
