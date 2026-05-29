const storyPosts = document.querySelectorAll(".story-post");

function toggleStory(post) {
  const isExpanded = post.classList.toggle("is-expanded");
  post.setAttribute("aria-expanded", String(isExpanded));
}

storyPosts.forEach((post) => {
  post.setAttribute("role", "button");

  post.addEventListener("click", () => {
    toggleStory(post);
  });

  post.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleStory(post);
  });
});
