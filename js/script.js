'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author';

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
 * find all articles
 * START LOOP: for every article:
 * * find tags wrapper
 * * make html variable with empty string
 * * get tags from data-tags attribute
 * * split tags into array
 * * START LOOP: for each tag
 * * * generate HTML of the link
 * * * add generated code to html variable
 * * END LOOP: for each tag
 * * insert HTML of all the links into the tags wrapper
 * END LOOP: for every article:
*/

function generateTags(){
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    tagsWrapper.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute("data-tags");
    const articleTagsArray = articleTags.split(' ');

    for (let singleTag of articleTagsArray) {
      const linkHtml = '<li><a href="#tag-' + singleTag + '">' + singleTag + '</a></li>';
      html = html + linkHtml;
    }

    tagsWrapper.innerHTML = html;
  }
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

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}


/**
 * find all links to tags
 * START LOOP: for each link
 * * add tagClickHandler as event listener for that link
 * END LOOP: for each link
*/
function addClickListenersToTags(){
  const links = document.querySelectorAll('a[href^="#tag-"]');
  //console.log(links);
  for (let link of links) {
  //console.log(link);
    link.addEventListener('click', tagClickHandler);
    //console.log('ok');
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

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorsSelector);
    authorWrapper.innerHTML = '';
    const articleAuthor = article.getAttribute("data-author");
    const linkHtml = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    authorWrapper.innerHTML = linkHtml;
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
    link.addEventListener('click', tagClickHandler);
  }
}



generateTags();

generateAuthors();

generateTitleLinks();

addClickListenersToTags();

addClickListenersToAuthors();
