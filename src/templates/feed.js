import { onNavigate } from "../router/router.js";
import { auth } from "../firebase/init.js";
import {
  createData,
  deletePost,
  getPost,
  getUserData,
  readPost,
  editPost,
  likeStatus,
} from "../firebase/firestore.js";
import { logOut } from "../firebase/auth.js";

const feed = async () => {
  console.log("holahola");
  const templateFeed = ` 
  <header>
    <nav>
      <img src="img/menu-icon.png" alt="">
      <img class="logo-mediary-nav"src="img/logo-Mediary.png" alt="">
      <button class="btnLogOut"> Log out</button>
      <img src="img/search-icon.png" alt=""/>
      <img id= "btnUser" src="img/user-icon.png" alt="" >
    </nav>
  </header>
  <section>
    <main class="feed">
      <div class="post">
        <div class="img-text-area">
          <img class="user-img-post" src="https://www.eaclinic.co.uk/wp-content/uploads/2019/01/woman-face-eyes-500x500.jpg" alt="">
          <textarea class="text-post" rows="4" cols="150" placeholder="What's Happening"></textarea>
        </div>
        <div class="icons-post-btn">
          <img class="post-icon-image" src="img/post-icon-image.png" alt="">
          <button class="post-btn">Post</button>
        </div>
      </div>
      <div class="root-post"> </div>
    </main>
  </section> `;
  //TEMPLATE FEED A FEEDCONTAINER (DIV)
  const feedContainer = document.createElement("div");
  feedContainer.innerHTML = templateFeed;

  const btnUser = feedContainer.querySelector("#btnUser");
  btnUser.addEventListener("click", () => {
    console.log(btnUser);
    onNavigate("/profile");
  });
  //BOTON LOGOUT - ONCLICK => SYNC - SIGNOUT (FIREBASE) -> ONNAVIGATE(LOGIN)
  const btnLogOut = feedContainer.querySelector(".btnLogOut");
  btnLogOut.addEventListener("click", async () => {
    await logOut(auth);
    onNavigate("/");
  });

  //BOTON POST
  const btnPost = feedContainer.querySelector(".post-btn");
  let rootFeed = feedContainer.querySelector(".root-post");

  const renderTemplateFeed = (post) => {
    rootFeed.innerHTML = "";
    let postList = "";
    post.forEach(async (doc) => {
      let docData = doc.data;
      let docId = doc.id;
      let likeHtml = `<i class="fa fa-heart" id=${docId}></i>`;
      if (docData.UsersWhoLiked.includes(auth.currentUser.uid)) {
        likeHtml = `<i class="fa fa-heart like" id=${docId}></i>`;
      }
      // console.log(docId);
      // console.log(docData);
      postList += ` 
      <div class="interaction-posted">
        <div class="posted-header">
          <img class="user-photo" src="https://www.eaclinic.co.uk/wp-content/uploads/2019/01/woman-face-eyes-500x500.jpg" alt="user-photo">
          <p class="user-name"> ${docData.nick}  </p>
          <img class="delete-icon"src="img/delete-icon.png" id=${docId} alt="delete-icon">
          <i class="far fa-edit" id=${docId} ></i>
        </div>
        <p class="post-date" >${docData.date.toDate().toLocaleString()}</p> 
        <textarea  id="text-${docId}"  class="posted-text" disabled="true"> ${
        docData.post
      } </textarea>
            <div class="icons-posted">
            ${likeHtml}
              <p class="likes-count">${docData.LikeCount}</p>
              <img class="comment-icon"src="img/comment-icon.png" alt="comment-icon">
              <button id="cancel-${docId}" class="cancel-edit-btn">Cancel</button>
              <button id="confirm-${docId}" class="confirm-edit-btn">Save</button>
            </div>
          </div>`;
    });
    rootFeed.innerHTML = postList;
    const btnsEdit = feedContainer.querySelectorAll(".fa-edit");

    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", () => {
        let textArea = feedContainer.querySelector(`#text-${btn.id}`);
        let btnConfirmEdit = feedContainer.querySelector(`#confirm-${btn.id}`);
        let btnCancelEdit = feedContainer.querySelector(`#cancel-${btn.id}`);
        textArea.disabled = false;
        btnCancelEdit.classList.add("visible");
        btnConfirmEdit.classList.add("visible");
        btnCancelEdit.addEventListener("click", () => {
          textArea.disabled = true;
          btnCancelEdit.classList.remove("visible");
          btnConfirmEdit.classList.remove("visible");
        });

        btnConfirmEdit.addEventListener("click", async () => {
          await editPost(btn.id, textArea.value);
          console.log(btnConfirmEdit.id.length);
          console.log("confirm edit clicked");
        });
      });
    });

    //Button Like
    const btnLike = feedContainer.querySelectorAll(".fa-heart");
    let count = feedContainer.querySelector(".likes-count");
    btnLike.forEach((buttonLike) => {
      buttonLike.addEventListener("click", async (e) => {
        const idPostLike = e.target.id;
        const likeInteraction = await likeStatus(
          idPostLike,
          auth.currentUser.uid
        );
      });
    });

    const btnDelete = feedContainer.querySelectorAll(".delete-icon");
    btnDelete.forEach((btn) => {
      btn.addEventListener("click", async () => {
        console.log(btn.id);
        const deleteAlert = confirm("Are you sure you want delete this post?");
        if (deleteAlert === true) {
          await deletePost(btn.id);
          readPost(renderTemplateFeed);
        }
      });
    });
  };

  readPost(renderTemplateFeed);

  btnPost.addEventListener("click", async () => {
    const textPost = feedContainer.querySelector(".text-post");
    const userData = await getUserData(auth.currentUser.uid);
    const postId = await createData(
      userData.id,
      textPost.value,
      userData.mail,
      userData.nick
    );
    console.log(postId);
    const subRoot = document.createElement("div");
    subRoot.className = "interaction-posted";
    // subRoot.innerHTML = await templateCreatedLastPost(
    //   userData.nick,
    //   postId,
    //   textPost.value
    // );

    textPost.value = "";

    const btnComment = feedContainer.querySelectorAll(".comment-icon");
    btnComment.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("comment-icon clicked");
      });
    });
  });

  return feedContainer;
};

export default feed;
