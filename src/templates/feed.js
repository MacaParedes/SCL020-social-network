import { onNavigate } from "../router/router.js";
import {auth} from "../firebase/init.js"
import {signOut } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js'; //sacar de acá! 


const feed = ()=>{
    const templateFeed = ` <header>
    <nav>
      <img src="img/menu-icon.png" alt="">
      <img class="logo-mediary-nav"src="img/logo-Mediary.png" alt="">
      <p></p>
      <img src="img/search-icon.png" alt="">
      <img src="img/user-icon.png" alt="">
    </nav>
  </header>
  <section>
    <main class="feed">
      <div class="post">
        <div class="img-text-area">
          <img class="user-img-post" src="img/user-img.png" alt="">
          <textarea class="text-post" rows="4" cols="150" placeholder="What's Happening"></textarea>
        </div>
        <div class="icons-post-btn">
          <img class="post-icon-image" src="img/post-icon-image.png" alt="">
          <button class="post-btn">Post</button>
        </div>
      </div>
      <div class="posted">
        <div class="info-posted">
          <img class="img-posted" src="img/user-img.png" alt="">
          <p class="user-name-posted">User Name</p>
          <img src="img/save-icon.png" alt="">
          <img src="img/edit-icon.png" alt="">
        </div>
        <div class="interaction-posted">
          <p class="posted-text"> Lorem ipsum dolor sit amet consectetur adipisicing elit.   </p>
          <div class="icons-posted">
            <img  src="img/like-icon.png" alt="heart-icon">
            <p class="likes-count">10</p>
            <img class="comment-icon"src="img/comment-icon.png" alt="comment-icon">
          </div>
        </div>
      </div>
      <button class="btnLogOut"> Log out</button>
    </main>
  </section> `;
//TEMPLATE FEED A FEEDCONTAINER (DIV)  
  const feedContainer = document.createElement('div');
  feedContainer.innerHTML = templateFeed;
//BOTON LOGOUT - ONCLICK => SYNC - SIGNOUT (FIREBASE) -> ONNAVIGATE(LOGIN)  
  const btnLogOut  = feedContainer.querySelector('.btnLogOut')
  btnLogOut.addEventListener('click', ()=>{
    
    signOut(auth).then(() => {
      console.log('Sign-out successful.')
      // onNavigate('/login')
    }).catch((error) => {
      console.log(error, 'An error happened.')
    });
    console.log('btnLogout Clicked')
   
  })
//BOTON POST

  return feedContainer
    }

export default feed