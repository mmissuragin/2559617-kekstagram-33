/* eslint-disable no-use-before-define */
import { isEscapeKey } from './util';

const COMMENTS_PER_PAGE = 5;

const bigPictureModal = document.querySelector('.big-picture');
const shownCountElement = bigPictureModal.querySelector('.social__comment-shown-count');
const totalCountElement = bigPictureModal.querySelector('.social__comment-total-count');
const commentsList = document.querySelector('.social__comments');
const showMoreCommentsButton = document.querySelector('.comments-loader');
const bodyElement = document.querySelector('body');
const closeModalButton = document.querySelector('.big-picture__cancel');
const uploadFileInput = document.getElementById('upload-file');
const previewImage = document.querySelector('.img-upload__preview img');
const bigPictureImage = document.querySelector('.big-picture__img img');
const effectsList = document.querySelectorAll('.effects__item input[type="radio"]');

let displayedComments = 0;
let allComments = [];
let currentImageURL = '';

const createComment = (commentData) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `<img class="social__picture" src="${commentData.avatar}" alt="${commentData.name}" width="35" height="35">
                             <p class="social__text">${commentData.message}</p>`;
  return commentElement;
};

const renderComments = () => {
  displayedComments += COMMENTS_PER_PAGE;

  if (displayedComments >= allComments.length) {
    showMoreCommentsButton.classList.add('hidden');
    displayedComments = allComments.length;
  } else {
    showMoreCommentsButton.classList.remove('hidden');
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < displayedComments; i++) {
    fragment.appendChild(createComment(allComments[i]));
  }

  commentsList.innerHTML = '';
  commentsList.appendChild(fragment);

  if (shownCountElement && totalCountElement) {
    shownCountElement.textContent = displayedComments;
    totalCountElement.textContent = allComments.length;
  }
};

const closeModal = () => {
  bigPictureModal.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentEscPress);
  displayedComments = 0;
};

const onDocumentEscPress = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onModalCloseButtonClick = () => closeModal();

const onModalLoadMoreClick = () => renderComments();

const renderPicture = (pictureData) => {
  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  bigPictureModal.querySelector('.likes-count').textContent = pictureData.likes;
  bigPictureModal.querySelector('.social__caption').textContent = pictureData.description;
};

const openBigPicture = (data) => {
  bigPictureModal.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  showMoreCommentsButton.classList.add('hidden');
  document.addEventListener('keydown', onDocumentEscPress);

  renderPicture(data);
  allComments = data.comments;
  if (allComments.length > 0) {
    renderComments();
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];

  if (file) {
    currentImageURL = URL.createObjectURL(file);
    previewImage.src = currentImageURL;
    updateEffectPreviews(currentImageURL);
  }
};

const updateEffectPreviews = (imageUrl) => {
  if (imageUrl) {
    effectsList.forEach((radio) => {
      const effectName = radio.value;
      const previewElement = document.querySelector(`.effects__preview--${effectName}`);
      previewElement.style.backgroundImage = `url(${imageUrl})`;
    });
  }
};

closeModalButton.addEventListener('click', onModalCloseButtonClick);
showMoreCommentsButton.addEventListener('click', onModalLoadMoreClick);
uploadFileInput.addEventListener('change', handleFileSelect);

export { openBigPicture };
