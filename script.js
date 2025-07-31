document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Navbar scroll effect
  const navbar = document.querySelector('.main-nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Slider Logic
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevArrow = document.querySelector('.slider-arrow.left');
  const nextArrow = document.querySelector('.slider-arrow.right');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  // Initialize slider
  showSlide(0);
  startSlider();

  // Event listeners
  nextArrow.addEventListener('click', function() {
    stopSlider();
    nextSlide();
    startSlider();
  });

  prevArrow.addEventListener('click', function() {
    stopSlider();
    prevSlide();
    startSlider();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  // Pause slider on hover
  const sliderContainer = document.querySelector('.slider-container');
  sliderContainer.addEventListener('mouseenter', stopSlider);
  sliderContainer.addEventListener('mouseleave', startSlider);

  // Scroll Reveal
  const sections = document.querySelectorAll('.content-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
          document.querySelector('.nav-links').classList.remove('active');
        }
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.main-nav') && window.innerWidth <= 768) {
      navLinks.classList.remove('active');
    }
  });

  // 3D Shapes Initialization
  const init3DShapes = () => {
    // Common settings
    const settings = {
      width: 200,
      height: 200,
      backgroundColor: 0xf0f0f0,
      cameraZ: 5,
      rotateSpeed: 0.005
    };

    // Store Three.js objects for each shape
    const shapeObjects = {};

    // Initialize all 3D shapes
    initShape('cube-container', createCube);
    initShape('sphere-container', createSphere);
    initShape('pyramid-container', createPyramid);
    initShape('rectangle-container', createRectangle);

    function initShape(containerId, shapeCreator) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(settings.backgroundColor);

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = settings.cameraZ;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Shape
      const shape = shapeCreator();
      scene.add(shape);

      // Controls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = 0.5;

      // Store the objects for this shape
      shapeObjects[containerId] = {
        scene,
        camera,
        renderer,
        controls,
        shape
      };

      // Animation
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // Handle resize
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }

    // Shape creators
    function createCube() {
      const geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x0066cc,
        shininess: 100,
        specular: 0x111111
      });
      const cube = new THREE.Mesh(geometry, material);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      cube.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      cube.add(directionalLight);
      
      return cube;
    }

    function createSphere() {
      const geometry = new THREE.SphereGeometry(1.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xe52e71,
        shininess: 100,
        specular: 0x111111
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      sphere.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      sphere.add(directionalLight);
      
      return sphere;
    }

    function createPyramid() {
      const geometry = new THREE.ConeGeometry(1, 1.8, 4);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00cc66,
        shininess: 100,
        specular: 0x111111
      });
      const pyramid = new THREE.Mesh(geometry, material);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      pyramid.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      pyramid.add(directionalLight);
      
      return pyramid;
    }

    function createRectangle() {
      const geometry = new THREE.BoxGeometry(1.8, 1.2, 0.9);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xff8a00,
        shininess: 100,
        specular: 0x111111
      });
      const rectangle = new THREE.Mesh(geometry, material);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      rectangle.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      rectangle.add(directionalLight);
      
      return rectangle;
    }

    // Handle click events for shape cards
    document.querySelectorAll('.shape-card').forEach(card => {
      const containerId = card.querySelector('.shape-3d').id;
      
      card.addEventListener('click', function(e) {
        // Check if the click was on the 3D canvas
        if (e.target === shapeObjects[containerId].renderer.domElement) {
          return; // Let Three.js handle the rotation
        }
        
        // Otherwise, handle the card click
        const url = this.dataset.url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('clickable')) return;
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
      });
      
      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('clickable')) return;
        card.style.transform = '';
        card.style.boxShadow = '';
      });
      
      // Allow keyboard navigation
      if (card.classList.contains('clickable')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const url = card.dataset.url;
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }
        });
      }
    });
  };

  // Initialize 3D shapes after DOM is loaded
  init3DShapes();

  // Clickable picture cards functionality
  document.querySelectorAll('.picture-card.clickable').forEach(card => {
    card.addEventListener('click', function() {
      const url = this.dataset.url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
    
    // Allow keyboard navigation
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.dataset.url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });
});