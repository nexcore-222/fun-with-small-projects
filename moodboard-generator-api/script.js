const gallery = document.getElementById('gallery');
const input = document.getElementById('keyword');
const button = document.getElementById('generate');

//Pexels API Key (you can get your own for free at https://www.pexels.com/api/)
//To get the key you need to sign up for a free account on Pexels and generate your own key by describing your project.
const PEXELS_API_KEY = "..."; //Replace with your Pexels API key

async function fetchImages(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=9`;

  //GET request with Authorization header
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY }
  });

  if (!res.ok) throw new Error("Failed to fetch images");
  const data = await res.json();

  return data.photos.map(p => p.src.medium);
}

button.addEventListener('click', async () => {
  const keyword = input.value.trim() || 'nature';
  gallery.innerHTML = '<p>Loading...</p>';

  try {
    const images = await fetchImages(keyword);
    gallery.innerHTML = '';

    images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = keyword;
      img.loading = 'lazy'; //Better performance

      //Fade-in animation
      img.style.opacity = 0;
      img.style.transition = 'opacity 0.8s ease';
      img.onload = () => (img.style.opacity = 1);

      gallery.appendChild(img);
    });
  } catch (err) {
    gallery.innerHTML = '<p>Error loading images 😞</p>';
    console.error(err);
  }
});
