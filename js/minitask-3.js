const URL = 'https://pokeapi.co/api/v2/pokemon?limit=10'

const pokemon = async () => {
  try {
    const response = await fetch(URL)
    if (!response.ok) throw response.status

    const { results } = await response.json()
    
    let data = results.map(async (value) => {
      const fetchPokemon = await fetch(value.url)
      if (!fetchPokemon.ok) throw fetchPokemon.status
      
      const { sprites, types } = await fetchPokemon.json()

      return {
        name: value.name,
        image: sprites.back_default,
        types: types.map(v => {
          return v.type.name
        })
      }
    })

    return await Promise.all(data)
  } catch (err) {
    console.log(`Status: ${err}`)
  }
}

const renderBody = async () => {
  const body = document.body
  const fragment = new DocumentFragment()
  const pokeAPi = await pokemon()
  
  for (const poke of pokeAPi) {
    const article = document.createElement("article")
    
    const name = document.createElement("h1")
    name.textContent = poke.name.toUpperCase()
  
    const image = document.createElement("img")
    image.src = poke.image
    
    const type = document.createElement("p")
    type.textContent = 'Types: ' + poke.types.join(", ")
    
    article.append(name, image, type)
    fragment.append(article)
  }
  
  body.append(fragment)
}

renderBody()
