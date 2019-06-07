module.exports = {
  baseURI: `../`,
  api: {
    meta: {
      get: {
        '/': '/'
      }
    },
    post: {
      get: {
        '/posts': `/wp/v2/posts`,
        '/posts/:id': `/wp/v2/posts`
      },
      post: {
        '/posts': `/wp/v2/posts`
      },
      put: {
        '/posts/:id': `/wp/v2/posts`
      },
      delete: {
        '/posts/:id': `/wp/v2/posts`
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
        images: {
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
      count: 'count',
      description: 'description',
      link: 'link',
      name: 'name',
      slug: 'slug',
      parent: 'parent'
    },
    image: {
      id: 'id',
      title: 'title.rendered',
      caption: 'caption.rendered',
      alt: 'alt_text',
      url: 'source_url',
      sizes: 'media_details.sizes'
    }
  }
}
