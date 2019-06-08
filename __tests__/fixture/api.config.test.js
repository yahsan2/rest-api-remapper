module.exports = {
  baseURI: `../data`,
  api: {
    meta: {
      get: {
        '/': '/'
      }
    },
    post: {
      get: {
        '/posts': `/wp/v2/posts.json`,
        '/posts/:id': `/wp/v2/posts.json`
      },
      post: {
        '/posts': `/wp/v2/posts.json`
      },
      put: {
        '/posts/:id': `/wp/v2/posts.json`
      },
      delete: {
        '/posts/:id': `/wp/v2/posts.json`
      }
    },
    page: {
      get: {
        '/pages': `/wp/v2/pages`,
        '/pages/:id': `/wp/v2/pages`
      },
      post: {
        '/pages': `/wp/v2/pages`
      },
      put: {
        '/pages/:id': `/wp/v2/pages`
      },
      delete: {
        '/pages/:id': `/wp/v2/pages`
      }
    }
  },
  map: {
    post: {
      base: '',
      props: {
        id: 'id',
        title: 'title.rendered',
        categories: 'categories',
        terms: {
          extends: 'term',
          base: '_embedded.wp:term'
        },
        image: {
          one: true,
          extends: 'image',
          base: '_embedded.wp:featuredmedia'
        }
      }
    },
    page: {
      extends: 'post'
    },
    term: {
      id: 'id',
      description: 'description',
      title: 'name',
      slug: 'slug'
    },
    terms: {
      base: '_embedded.wp:term',
      props: {
        id: 'id',
        description: 'description',
        title: 'name',
        slug: 'slug'
      }
    },
    image: {
      id: 'id',
      title: 'title.rendered',
      url: 'source_url',
      sizes: 'media_details.sizes'
    }
  }
};
