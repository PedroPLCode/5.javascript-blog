const opts = {
  TitleSelector: '.post-title',
  TagsListSelector: '.tags',
  AuthorsListSelector: '.authors',



const select = {
  all: {
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  },
  listOf: {
    tags: '.tags.list',
    authors: '.authors.list',
  },
};
