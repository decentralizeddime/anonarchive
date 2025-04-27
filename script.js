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

// Handle new uploads with client-side resize/compression
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('imageInput');
  const captionInput = document.getElementById('captionInput');
  const file = fileInput.files[0];
  const caption = captionInput.value.trim();

  if (file && caption) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 300;
        const scale = maxWidth / img.width;
        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Compress to JPEG at 70% quality
        const compressedSrc = canvas.toDataURL('image/jpeg', 0.7);
        const entry = { src: compressedSrc, caption };

        // Save & render
        artifacts.push(entry);
        localStorage.setItem('artifacts', JSON.stringify(artifacts));
        renderItem(entry);
        uploadForm.reset();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});
