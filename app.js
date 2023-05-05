var __version = '2.0.0'
var $__storeInfo = null

var __defaults = {
  el: null
}

let imgg

const apikey = '563492ad6f91700001000001287e08f7cb0a41dabea9de4e5c6e7cd2'

function $__DSQDRenderer(rootEl, options) {
  __root = !rootEl ? document.body : document.getElementById(rootEl)
  const input = document.querySelector('input')
  const search_btn = document.querySelector('.search_btn')

  console.log(__root, input, search_btn)
  if (!m) {
    throw 'Rendering engine not loaded'
  }
  m.route.prefix = '#'
}

let model = {
  count: 0,
  images: [],
  loading: true,
  query: 'random',
  text: '',
  page_num: 1
}

async function CuratedPhotos(page_num) {
  const fig = document.querySelector('figure')
  console.log(fig)

  // fetch the data from api
  const data = await fetch(
    `https://api.pexels.com/v1/curated?page=${page_num}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: apikey //use the apikey you have generated
      }
    }
  )
  const response = await data.json() //convert the response to json
  console.log(response?.photos)
  model.loading = false
  imgg = response?.photos
  return imgg
}

async function SearchPhotos(query, page_num) {
  //   imgg = []
  const data = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&page=${page_num}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: apikey
      }
    }
  )
  const response = await data.json() //convert the response to json
  console.log(response?.photos)
  model.loading = false
  imgg = response?.photos
  return imgg
}

let ImageSearch = {
  view: function (vnode) {
    return m(
      'div',
      { 'class': 'max-w-sm rounded overflow-hidden my-10 mx-auto' },
      m(
        'form',
        { 'class': 'w-full max-w-sm' },
        m(
          'div',
          { 'class': 'flex items-center border-b-2 border-teal-500 py-2' },
          [
            m('input', {
              'class':
                'appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none',
              'type': 'text',
              'placeholder': 'Search any Image',
              oninput: async function (e) {
                model.query = e.target.value
                await SearchPhotos(e.target.value, 1)
              }
            }),
            m(
              'button',
              {
                'class':
                  'flex-shrink-0 bg-teal-500  text-sm  text-white py-1 px-2 rounded search-btn',
                'type': 'submit'
              },
              m(
                'svg',
                {
                  'xmlns': 'http://www.w3.org/2000/svg',
                  'class': 'h-6 w-6',
                  'fill': 'none',
                  'viewBox': '0 0 24 24',
                  'stroke': 'currentColor'
                },
                m('path', {
                  'strokelinecap': 'round',
                  'strokelinejoin': 'round',
                  'strokewidth': '2',
                  'd': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                })
              )
            )
          ]
        )
      )
    )
  }
}

let ImageCard = {
  view: function (vnode) {
    return m(
      'figure',
      {
        'class':
          'bg-gray-100 rounded p-8 shadow-lg overflow-hidden mx-4 lg:max-w-2xl lg:h-auto'
      },
      [
        m('img', {
          'src': vnode.attrs.src?.original,
          'class': ' w-full inset-0 h-48 ro object-cover rounded-md',
          'alt': vnode.attrs.alt
        }),
        m(
          'div',
          { 'class': 'pt-4 md:p-2 text-center md:text-center space-y-4' },
          [
            m(
              'p',
              {
                'class':
                  'text-lg text-center text-grey-700 tracking-widest font-normal uppercase'
              },
              `Photo by ${vnode.attrs.photographer}`
            ),
            m(
              'a',
              {
                'class':
                  'block text-center rounded-lg p-4 transition hover:bg-gray-800  hover:text-gray-100 ease-in-out duration-700 bg-gray-300 tracking-wider border border-gray-600 w-full',
                'href': vnode.attrs.src.original,
                'target': '_blank',
                'rel': 'noreferrer'
              },
              ' Download '
            )
          ]
        )
      ]
    )
  }
}

let Loader = {
  view: function (vnode) {
    return m('div', { 'class': 'wobbling-8' })
  }
}

let Header = {
  view: function (vnode) {
    console.log(vnode.children)
    return m('div', { 'class': 'container p-2 mx-auto' }, [
      m(ImageSearch),
      model?.images.length === 0 &&
        m(
          'h1',
          {
            'class':
              'flex content-center justify-center tracking-wider text-gray-400 text-4xl'
          }
          //   ' No Images Found!! '
        ),
      m(
        'div',
        {
          'class': 'flex content-center justify-center mx-auto '
        },
        model?.loading ? m(Loader) : null
      ),
      m(
        'div',
        {
          'class':
            'grid grid-cols-1 gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3'
        },
        vnode?.children?.map((image) => m(ImageCard, image))
      )
    ])
  }
}

function TOBSDK(options) {
  if (options.version && options.version !== __version) {
    throw 'SDK not compatible with this snippet. SDK Version: ' + __version
  }
  __defaults = Object.assign(__defaults, options)

  async function __boot() {
    // setUpCartCSS()
    await CuratedPhotos()

    renderer = new $__DSQDRenderer(__defaults.el, __defaults)
    if (!__defaults.overrideDefaultRendering) {
      if (imgg?.length > 0) {
        m.mount(document.getElementById(options.el), {
          view: function (vnode) {
            console.log(vnode)
            return [m(Header, imgg)]
          }
        })
      }
    }
    // setUpJSDep(function () {
    //     renderer = new $__DSQDRenderer(__defaults.el, __defaults)
    // })
  }
  document.addEventListener('DOMContentLoaded', __boot)
}
