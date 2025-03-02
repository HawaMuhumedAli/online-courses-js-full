document.addEventListener('DOMContentLoaded', () => {
   let toggleBtn = document.getElementById('toggle-btn');
   let body = document.body;
   let darkMode = localStorage.getItem('dark-mode');

   // Dark Mode Functions
   const enableDarkMode = () => {
      toggleBtn.classList.replace('fa-sun', 'fa-moon');
      body.classList.add('dark');
      localStorage.setItem('dark-mode', 'enabled');
   };

   const disableDarkMode = () => {
      toggleBtn.classList.replace('fa-moon', 'fa-sun');
      body.classList.remove('dark');
      localStorage.setItem('dark-mode', 'disabled');
   };

   if (darkMode === 'enabled') enableDarkMode();

   if (toggleBtn) {
      toggleBtn.onclick = () => {
         darkMode = localStorage.getItem('dark-mode');
         darkMode === 'disabled' ? enableDarkMode() : disableDarkMode();
      };
   }

   let profile = document.querySelector('.header .flex .profile');
   let search = document.querySelector('.header .flex .search-form');
   let sideBar = document.querySelector('.side-bar');

   // Restore Sidebar and Profile State from Local Storage
   if (localStorage.getItem('sidebar-active') === 'true') {
      sideBar.classList.add('active');
      body.classList.add('active');
   }

   document.body.addEventListener('click', (e) => {
      if (e.target.matches('#user-btn')) {
         profile.classList.toggle('active');
         search.classList.remove('active');
         localStorage.setItem('profile-active', profile.classList.contains('active'));
      }

      if (e.target.matches('#search-btn')) {
         search.classList.toggle('active');
         profile.classList.remove('active');
      }

      if (e.target.matches('#menu-btn')) {
         sideBar.classList.toggle('active');
         body.classList.toggle('active');
         localStorage.setItem('sidebar-active', sideBar.classList.contains('active'));
      }

      if (e.target.matches('#close-btn')) {
         sideBar.classList.remove('active');
         body.classList.remove('active');
         localStorage.setItem('sidebar-active', false);
      }
   });

   window.onscroll = () => {
      profile.classList.remove('active');
      search.classList.remove('active');

      if (window.innerWidth < 1200) {
         sideBar.classList.remove('active');
         body.classList.remove('active');
         localStorage.setItem('sidebar-active', false);
      }
   };

   // Fetch user data from API and display it
   async function fetchUserData() {
      try {
         let response = await fetch('https://api.example.com/user'); // Replace with your API URL
         if (!response.ok) throw new Error('Failed to fetch user data');
         
         let userData = await response.json();
         document.querySelector('.profile .name').textContent = userData.name;
         document.querySelector('.profile .email').textContent = userData.email;
         document.querySelector('.profile img').src = userData.profilePicture;
      } catch (error) {
         console.error('Error fetching user data:', error);
      }
   }

   fetchUserData();
});

document.getElementById('search-form').addEventListener('submit', async function (e) {
   e.preventDefault();
   const query = document.getElementById('search-input').value;
   const url = `https://youtube-v3-alternative.p.rapidapi.com/search?query=${query}&geo=US&lang=en`;
   const options = {
     method: 'GET',
     headers: {
       'x-rapidapi-key': '9452172446msh620b23d249c353fp16dad9jsn7b983901f89b',
       'x-rapidapi-host': 'youtube-v3-alternative.p.rapidapi.com'
     }
   };
 
   try {
     const response = await fetch(url, options);
     const result = await response.json();
     displayVideos(result.data);
   } catch (error) {
     console.error('Error fetching search results:', error);
   }
 });
 
 function displayVideos(videos) {
   const videoList = document.getElementById('video-list');
   videoList.innerHTML = '';
   videos.forEach(video => {
     const videoItem = document.createElement('div');
     videoItem.className = 'video-item';
     videoItem.innerHTML = `
       <div class="video-thumbnail" style="background-image: url('${video.thumbnail[0].url}');"></div>
       <div class="video-info">
         <div class="video-title">${video.title}</div>
         <div class="video-channel">${video.channelTitle}</div>
       </div>
     `;
     videoItem.addEventListener('click', () => openModal(video.videoId));
     videoList.appendChild(videoItem);
   });
 }
 
 async function openModal(videoId) {
   const modal = document.getElementById('video-modal');
   const videoPlayer = document.getElementById('video-player');
   const videoUrl = `https://www.youtube.com/embed/${videoId}`;
 
   console.log('Opening video:', videoId, videoUrl); // Debugging information
 
   videoPlayer.src = videoUrl;
   modal.style.display = 'block';
 
   videoPlayer.onerror = function () {
     alert('This video is not available on YouTube.');
     closeModal();
   };
 
   document.getElementById('download-mp3').onclick = async function () {
     const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
     const options = {
       method: 'GET',
       headers: {
         'x-rapidapi-key': '9452172446msh620b23d249c353fp16dad9jsn7b983901f89b',
         'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
       }
     };
 
     try {
       const response = await fetch(url, options);
       const result = await response.json();
       if (result.status === 'ok') {
         window.location.href = result.link;
       } else {
         alert('Error downloading MP3: ' + result.msg);
       }
     } catch (error) {
       console.error('Error downloading MP3:', error);
     }
   };
 }
 
 document.getElementById('close-modal').addEventListener('click', closeModal);
 
 window.onclick = function (event) {
   const modal = document.getElementById('video-modal');
   if (event.target == modal) {
     closeModal();
   }
 };
 
 function closeModal() {
   const modal = document.getElementById('video-modal');
   const videoPlayer = document.getElementById('video-player');
   videoPlayer.src = '';
   modal.style.display = 'none';
 }
 
/////
 // Handle Form Submission
 document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const profilePicture = document.getElementById('profilePicture').files[0];

  // Validate passwords match
  if (password !== confirmPassword) {
     alert('Passwords do not match!');
     return;
  }

  // Convert image to Base64
  const reader = new FileReader();
  reader.onload = function(event) {
     const profilePictureBase64 = event.target.result;

     // Save data to localStorage
     const userData = {
        email: email,
        password: password,
        profilePicture: profilePictureBase64
     };
     localStorage.setItem('userData', JSON.stringify(userData));

     // Display saved data
     displaySavedProfile();
     alert('Registration successful!');
  };
  reader.readAsDataURL(profilePicture);
});

// Display saved profile from localStorage
function displaySavedProfile() {
  const savedData = JSON.parse(localStorage.getItem('userData'));
  if (savedData) {
     document.getElementById('savedEmail').textContent = `Email: ${savedData.email}`;
     document.getElementById('savedImage').src = savedData.profilePicture;
     document.getElementById('profilePreview').style.display = 'block';
  } else {
     document.getElementById('profilePreview').style.display = 'none';
  }
}

// Load saved profile on page load
window.onload = displaySavedProfile;