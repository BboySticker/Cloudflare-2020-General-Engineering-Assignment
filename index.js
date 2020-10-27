let links = [
  {'name': 'Cloudflare', 'url': 'https://www.cloudflare.com/'},
  {'name': 'Cloudflare Workers', 'url': 'https://developers.cloudflare.com/workers/'},
  {'name': 'Google', 'url': 'https://www.google.com/'},
  {'name': 'Apple', 'url': 'https://www.apple.com'},
  {'name': 'Amazon', 'url': 'https://www.amazon.com'},
]

/**
 * Add event listener
 */
addEventListener('fetch', event => {
  event.respondWith(handler(event.request))
})

/**
 * Handler function
 */
async function handler(request) {
  if (request.method === 'GET') {
    var paths = request.url.split('/')
    if (paths[paths.length - 1] === 'links') {
      const init = {
        headers: { 'content-type': 'application/json' },
      }
      const body = JSON.stringify(links)
      return new Response(body, init)
    } else {
      const init = {
        headers: { 'content-type': 'text/html' },
      }
      const url = 'https://static-links-page.signalnerve.workers.dev'
      const response = await fetch(url, init)
      const linkResponse = new HTMLRewriter().on("div#links", new LinksTransformer(links)).transform(response)
      const styleResponse = new HTMLRewriter().on("div#profile", new StyleHandler()).transform(linkResponse)
      const avatarResponse = new HTMLRewriter().on("img#avatar", new AvatarHandler(
        'https://www.breakark.com/wp/wp-content/themes/skate/img/about_taisuke.jpg'
      )).transform(styleResponse)
      const finalResponse = new HTMLRewriter().on("h1#name", new NameHandler('BboySticker')).transform(avatarResponse)
      return finalResponse
    }
  }
}

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    for (let i = 0; i < this.links.length; i ++) {
      element.append(
        '<a href="' + this.links[i].url + '">' + this.links[i].name + '</a>',
        new Object({ html: true })
      )
    }
  }
}

class StyleHandler {
  constructor() {
  }

  async element(element) {
    element.removeAttribute('style')
  }
}

class AvatarHandler {
  constructor(imgSrc) {
    this.imgSrc = imgSrc
  }

  async element(element) {
    element.setAttribute('src', this.imgSrc)
  }
}

class NameHandler {
  constructor(name) {
    this.name = name
  }

  async element(element) {
    element.append(this.name)
  }
}
