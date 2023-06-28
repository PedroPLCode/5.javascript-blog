'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log(event);

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  //console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
  //console.log('clickedElement (with plus): ' + clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const hrefAtribute = clickedElement.getAttribute("href");
  //console.log(hrefAtribute);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  /* [DONE] add class 'active' to the correct article */

  const allArticles = document.querySelectorAll('.posts article');
  for(let singleArticle of allArticles){
    //console.log(singleArticle.getAttribute("id"));
    if (("#" + singleArticle.getAttribute("id")) == hrefAtribute) {
      singleArticle.classList.add('active');
    }
  }

  /* PYTANIE DO MENTORA !!! :)
  W podpowiedziach, zadanie, jest ogarnięte tak:
  
  const targetArticle = document.querySelector(hrefAtribute);
  targetArticle.classList.add('active');
  
  Ja sam zrobiłem to bez podpowiedzi, z wykorzystaiem pętli for, tak jak w aktywnym kodzie powyżej.
  Musiałem dodać "#" do atrybutu id podczas porwnywania. 
  Inaczej elementy nie były identyczne i blok if się nie wykonywał.

  Oba sposoby działają. Który jest lepszy? Bardziej pożądany? 
  Ten z podpowiedzi jest krótszy i prostszy. Czyli wg zasady Keep It Simple Stupid byłby lepszy ? :)
  */

}

const links = document.querySelectorAll('.titles a');
for(let link of links){
  link.addEventListener('click', titleClickHandler);
}