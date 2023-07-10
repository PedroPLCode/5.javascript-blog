'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagcloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authorcloud-link').innerHTML)
}

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
    titles: '.post-title',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags',
    authors: '.authors',
  },
  left: {
    sidebar: {
      header: '.left-h2',
      list: '.left-ul',
      sleepDelay: 1000,
    }
  },
};


/**
 * Sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Creates div element to show message on the screen.
 */
function printMessage(msg) {
	let div = document.createElement('div');
	div.innerHTML = msg;
	document.getElementById('messages').appendChild(div);
}


/**
 * Cleaer all content of element with id=messages
 */
function clearMessages() {
	document.getElementById('messages').innerHTML = '';
}


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
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(select.all.articles + customSelector);

  let html='';

  for (let article of articles) {
    const articleId = article.getAttribute("id");
    const articleTitle = article.querySelector(select.article.titles).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle}; //sz
    const linkHTML = templates.articleLink(linkHTMLData); //sz
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}


/**
 * Makes a calculation of min and max tags params.
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
 * Makes a calculation of proper tag class.
 */
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
  return (opts.tagSizes.classPrefix + classNumber);
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
  const articles = document.querySelectorAll(select.all.articles);
  let allTags = {};

  for (let article of articles) {
    const tagsWrapper = article.querySelector(select.article.tags);
    tagsWrapper.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute("data-tags");
    const articleTagsArray = articleTags.split(' ');

    for (let singleTag of articleTagsArray) {
      const linkHTMLData = {id: singleTag, title: singleTag}; //sz
      const linkHtml = templates.tagLink(linkHTMLData); //sz
      html = html + linkHtml;

      if(!allTags.hasOwnProperty(singleTag)){
        allTags[singleTag] = 1;
      } else {
        allTags[singleTag]++;
      }
    }
    tagsWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(select.listOf.tags);

  const allTagsData = {tags: []};

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  for (let singleTag in allTags) {
    allTagsData.tags.push({
      tag: singleTag,
      count: allTags[singleTag],
      className: calculateTagClass(allTags[singleTag], tagsParams)
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
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
async function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const activeTagLinks = document.querySelectorAll('.post-tags .list a.active');
  for (let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }

  const activeAuthorsLinks = document.querySelectorAll('.post-author a.active');
  for (let activeAuthorLink of activeAuthorsLinks) {
    activeAuthorLink.classList.remove('active');
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

  const sidebarLeftHeader = document.querySelector(select.left.sidebar.header);
  const sidebarLeftList = document.querySelector(select.left.sidebar.list);
  sidebarLeftHeader.style.opacity = '0';
  sidebarLeftList.style.opacity = '0';
  sidebarLeftHeader.style.scale = '0.5';
  sidebarLeftList.style.scale = '0.5';
  await sleep(select.left.sidebar.sleepDelay);

  if (tag == 'all') {
    sidebarLeftHeader.style.opacity = '1';
    sidebarLeftList.style.opacity = '1';
    sidebarLeftHeader.style.scale = '1';
    sidebarLeftList.style.scale = '1';
    generateTitleLinks();
    clearMessages();
    printMessage('All Articles');
  } else {
    sidebarLeftHeader.style.opacity = '1';
    sidebarLeftList.style.opacity = '1';
    sidebarLeftHeader.style.scale = '1';
    sidebarLeftList.style.scale = '1';
    generateTitleLinks('[data-tags~="' + tag + '"]');
    clearMessages();
    printMessage('# ' + tag);
  }
}


/**
 * find all links to tags
 * START LOOP: for each link
 * * add tagClickHandler as event listener for that link
 * END LOOP: for each link
*/
function addClickListenersToTags(){
  const links = document.querySelectorAll(select.all.linksTo.tags);
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
  const articles = document.querySelectorAll(select.all.articles);
  const authorsList = document.querySelector(select.listOf.authors);
  authorsList.innerHTML = '';
  const allAuthorsData = {authors: []};
  let allAuthors = {};

  for (let article of articles) {
    const authorWrapper = article.querySelector(select.article.author);
    authorWrapper.innerHTML = '';
    const articleAuthor = article.getAttribute("data-author");
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHtml = templates.authorLink(linkHTMLData);
    authorWrapper.innerHTML = linkHtml;

    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  for (let articleAuthor in allAuthors) {
    allAuthorsData.authors.push({
      author: articleAuthor,
      count: allAuthors[articleAuthor]
    });
  }

  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
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
async function authorClickHandler(event){
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

  const activeTagLinks = document.querySelectorAll('.post-tags .list a.active');
  for (let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  const sidebarLeftHeader = document.querySelector(select.left.sidebar.header);
  const sidebarLeftList = document.querySelector(select.left.sidebar.list);
  sidebarLeftHeader.style.opacity = '0';
  sidebarLeftList.style.opacity = '0';
  sidebarLeftHeader.style.scale = '0.5';
  sidebarLeftList.style.scale = '0.5';
  await sleep(select.left.sidebar.sleepDelay);
  sidebarLeftHeader.style.opacity = '1';
  sidebarLeftList.style.opacity = '1';
  sidebarLeftList.style.scale = '1';
  sidebarLeftHeader.style.scale = '1';
  generateTitleLinks('[data-author="' + author + '"]');
  clearMessages();
  printMessage('# ' + author);
}


/**
 * find all links to authors
 * START LOOP: for each link
 * * add authorClickHandler as event listener for that link
 * END LOOP: for each link
*/
function addClickListenersToAuthors(){
  const links = document.querySelectorAll(select.all.linksTo.authors);
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}


generateTags();

generateAuthors();

generateTitleLinks();

addClickListenersToTags();

addClickListenersToAuthors();

clearMessages();
printMessage('All articles');
