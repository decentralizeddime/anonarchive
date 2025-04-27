const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');

// Load existing artifacts
const storedData = localStorage.getItem('artifacts');
let artifacts = storedData ? JSON.parse(storedData) : [];

function renderItem({ src, caption }) {
  const div = document.createElement('div');
  div.classList.add('item');

  const img = document.createElement('img');
  img.src = src;
  img.alt = caption;

  const p = document.createElement('p');
  p.textContent = caption;

  div.appendChild(img);
  div.appendChild(p);
  gallery.appendChild(div);

  // Begin fade-out after 5s
  setTimeout(() => div.classList.add('fading'), 5000);
}

// Initial render
artifacts.forEach(renderItem);

// Handle new uploads
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('imageInput');
  const captionInput = document.getElementById('captionInput');
  const file = fileInput.files[0];
  const caption = captionInput.value.trim();

  if (file && caption) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      const entry = { src, caption };

      // Save & render
      artifacts.push(entry);
      localStorage.setItem('artifacts', JSON.stringify(artifacts));
      renderItem(entry);
      uploadForm.reset();
    };
    reader.readAsDataURL(file);
  }
});
