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
