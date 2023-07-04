'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';

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
function generateTitleLinks(){
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector);
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



function generateTags(){

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  /* START LOOP: for every article: */

  for (let article of articles) {
    //console.log(article);

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    tagsWrapper.innerHTML = '';
    //console.log(tagsWrapper);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute("data-tags");
    //console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for (let singleTag of articleTagsArray) {
    //console.log(singleTag);

      /* generate HTML of the link */

      const linkHtml = '<li><a href="#tag-' + singleTag + '">' + singleTag + '</a></li>';
      //console.log(linkHtml);

      /* add generated code to html variable */

      html = html + linkHtml;
      //console.log(html);

    /* END LOOP: for each tag */

    }

    /* insert HTML of all the links into the tags wrapper */

  tagsWrapper.innerHTML = html;
  //console.log(tagsWrapper);
  //console.log('kolejny');

  /* END LOOP: for every article: */

  }
}



function tagClickHandler(event){

  /* prevent default action for this event */
    /* make new constant named "clickedElement" and give it the value of "this" */
  event.preventDefault();
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  //console.log(tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('.post-tags .list a.active');
  //console.log(activeTagLinks);
  //console.log('jest');

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks) {

    /* remove class active */

    activeTagLink.classList.remove('active');
    //console.log('usuniety');

  /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll(href);
  //console.group(tagLinks);

  /* START LOOP: for each found tag link */

    for (let tagLink of tagLinks) {

    /* add class active */

    tagLink.classList.add('active');
    console.log(tagLink);
    //console.log('nast');

  /* END LOOP: for each found tag link */

    }

  /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  //console.log(links);

  /* START LOOP: for each link */

  for (let link of links) {
  //console.log(link);

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    //console.log('ok');
    /* END LOOP: for each link */

  }
}


generateTags();

generateTitleLinks();

addClickListenersToTags();
