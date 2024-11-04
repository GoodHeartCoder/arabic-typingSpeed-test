'use strict';
// prettier-ignore
const wordsArr = [
  "أعطى", "فكر", "ثم", "رياضة", "تاريخ", "قبل", "تغير", "تحدى", "كل", "واقع",
  "ساعدت", "تقاليد", "جبل", "ألوان", "فكر", "آمن", "حياة", "صداقة", "نمت", "حرية",
  "صحة", "قد", "كما", "عدالة", "درست", "صيف", "أبدع", "تعاون", "إذ", "قرية", "طموح",
  "ابتسم", "ب", "زمن", "طبيعة", "غابة", "فضول", "إلا", "جمال", "علم", "مع", "علوم",
  "قادة", "ك", "نشاط", "مدرسة", "سافرت", "ابتسمت", "جهد", "شتاء", "عند", "راحة",
  "حتى", "حديقة", "إلى", "جامعة", "تحت", "وادي", "هدوء", "ابتكر", "لم", "عالم",
  "جسر", "سفر", "من", "صوت", "فوق", "إلى", "شمس", "لعبت", "شاهدت", "صحراء", "ربيع",
  "ل", "حين", "سعادة", "تراث", "فن", "عائلة", "أمام", "مدينة", "صدق", "تقدم", "نجوم",
  "أن", "طبخت", "لأن", "مهارة", "عن", "لياقة", "بيت", "أدب", "نجاح", "و", "بنيت",
  "قمر", "مستقبل", "على", "كتبت", "حيث", "جرب", "من", "ب", "رؤية", "حكمة", "أصر",
  "تواصل", "أمل", "ما", "صبر", "تكنولوجيا", "بعد", "سماء", "تعلمت", "عقل", "حللت",
  "احترام", "قرأت", "فضيلة", "أمانة", "لا", "مكتبة", "قرأ", "زرعت", "في", "بحر",
  "طور", "قرار", "حلم", "ل", "نهر", "طريق", "حضارة", "ماضي", "حسن", "رحمة", "على",
  "استقر", "إذا", "طاقة", "فجر", "و", "كرم", "عمل", "حب", "فهم", "بعض", "هدف",
  "تواضع", "بين", "خريف", "في", "اكتشف", "خلف", "نجح", "أو", "فرح", "غامر", "تعلم",
  "لكن", "أمان", "ثقافة", "غروب"
]
const textBox = document.querySelector('.text-box');
const typedText = document.querySelector('.typed-text');
const restBtn = document.querySelector('.btn-restart');
const resultsBox = document.querySelector('.results-box');
const countdownElement = document.getElementById('countdown');
const grossWPMElement = document.getElementById('grossWPM');
const netWPMElement = document.getElementById('netWPM');
const accuracyElement = document.getElementById('accuracy');

let i = 0;
let j = 0;
let wordsElementsArr = [];
let currentWord,
  line3FirstWord,
  wordsElementsArrCopy,
  line2FirstWord,
  interval,
  timeLeft,
  GrossWPM,
  netWPM,
  accuracy;
let startedTyping = false;

const cursor = document.createElement('div');
cursor.classList.add('cursor');

// randomizes the original word array
function randomArrGenerator(array) {
  // Loop through the array from the last element to the first
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// converts the randomized array into a specific html structure then inserts it directly
function textIntoHtmlConvert(textArr) {
  // with some thinking you can understand what is happing here
  textArr.forEach(word => {
    typedText.insertAdjacentHTML(
      'beforeend',
      `<span class ="word">${Array.from(word)
        .map((char, i) => `<span class="letter" id ='a${i}'>${char}</span>`)
        .join('')} </span>`
    );
    // observer.observe(typedText.lastChild);
  });
}

// displays a randomized text with the correct html structure in every call
function displayText() {
  const shuffledArray = randomArrGenerator(wordsArr);
  textIntoHtmlConvert(shuffledArray);
  currentWord = typedText.querySelector('.word');

  wordsElementsArr = Array.from(typedText.querySelectorAll('.word'));
  wordsElementsArrCopy = wordsElementsArr.slice();
  // default cursor position before typing
  typedText.prepend(cursor);
  setTimeout(() => {
    cursor.style.top = wordsElementsArr[0].getBoundingClientRect().top + 'px';
    cursor.style.left =
      wordsElementsArr[0].getBoundingClientRect().left +
      wordsElementsArr[0].getBoundingClientRect().width +
      'px';
  }, 0.1);
}
displayText();

const updateLineFirstWords = () => {
  let currentTop = wordsElementsArrCopy[0].getBoundingClientRect().top;
  let n = 1; // Tracks line count
  let b = 1; // One-time flag for line2FirstWord assignment

  for (const word of wordsElementsArrCopy) {
    const wordTop = word.getBoundingClientRect().top;

    if (wordTop !== currentTop && n < 3) {
      n++; // Move to the next line
      currentTop = wordTop;

      if (n === 2 && b === 1) {
        line2FirstWord = word;
        b++; // Prevents reassigning line2FirstWord
      }

      if (n === 3) {
        line3FirstWord = word;
        n = 1; // Reset line counter for future use
        b = 1; // Reset flag for future use
        break; // Exit after finding line3FirstWord
      }
    }
  }
};
updateLineFirstWords();

const isWordWrong = function (word) {
  // a word is not correct if is has at lest one wrong letter or one untyped letter or one extra letter
  if (
    Array.from(word.children).some(
      letter =>
        letter.classList.contains('wrong') ||
        letter.classList.length === 1 ||
        letter.classList.contains('extra')
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const isLetterTyped = letter => (letter.classList.length > 1 ? true : false);

const lastTypedLetter = word => {
  for (let i = word.children.length - 1; i >= 0; i--) {
    const letter = word.children[i];
    if (isLetterTyped(letter)) {
      return letter; // Return the last typed letter immediately
    }
  }
  return null; // Return null if no letter is typed
};

const colorRemove = ele => ele.classList.remove('wrong', 'correct');

const finishedLineRemove = () => {
  let previousSiblings = [];
  if (line3FirstWord === currentWord) {
    let currentSibling = line2FirstWord.previousElementSibling;
    while (currentSibling) {
      previousSiblings.push(currentSibling);
      currentSibling = currentSibling.previousElementSibling;
    }
    updateLineFirstWords();

    previousSiblings.forEach(ele => {
      if (!ele.classList.contains('cursor')) {
        ele.classList.add('hidden');
        ele.classList.remove('word');
      }
    });
    // updating the array
    wordsElementsArrCopy = Array.from(typedText.querySelectorAll('.word'));
  }
};

const cursorMove = () => {
  let letterPosition =
    lastTypedLetter(currentWord)?.getBoundingClientRect() ||
    currentWord.firstElementChild.getBoundingClientRect();
  if (isLetterTyped(currentWord.firstElementChild)) {
    cursor.style.top = `${letterPosition.top}px`;
    cursor.style.left = `${letterPosition.left}px`;
  } else {
    //if no letter in the word is typed just put cursor on right of the first letter
    cursor.style.top = `${letterPosition.top}px`;
    cursor.style.left = `${letterPosition.left + letterPosition.width}px`;
  }
};
const displayResults = () => {
  grossWPMElement.innerText = `${Math.round(GrossWPM)}`;
  netWPMElement.innerText = `${Math.round(netWPM)}`;
  accuracyElement.innerText = `${Math.round(accuracy)}%`;
};
const switchTap = () => {
  textBox.classList.toggle('hidden');
  resultsBox.classList.toggle('hidden');
};
const timer = () => {
  // Set initial timer (in seconds)
  timeLeft = 60;

  // Function to format time as MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }

  // Function to start the countdown
  function startCountdown() {
    countdownElement.textContent = '01:00';
    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        countdownElement.textContent = formatTime(timeLeft);
      } else {
        switchTap();
        calcResults();
        displayResults();
        clearInterval(interval);
        countdownElement.innerHTML = '🔁';
      }
    }, 1000);
  }

  startCountdown(); // Start the timer
};

const calcResults = () => {
  const allTypedLetters = Array.from(
    typedText.querySelectorAll('.letter')
  ).filter(letter => isLetterTyped(letter));

  cursor.remove();
  // if first letter is typed than means the word has been reached
  const allTypedWords = Array.from(typedText.children).filter(word =>
    isLetterTyped(word.firstElementChild)
  );
  // if the time finished before the user finishing the last word it won't count
  if (!isLetterTyped(allTypedWords[allTypedWords.length - 1].lastElementChild))
    allTypedWords.pop();

  const numOfTypedSpaces = allTypedWords.length;
  GrossWPM = (allTypedLetters.length + numOfTypedSpaces) / 6;
  const numOfWrongWords = allTypedWords.filter(word =>
    isWordWrong(word)
  ).length;
  netWPM = GrossWPM - numOfWrongWords;
  accuracy = (netWPM / GrossWPM) * 100;
};

// the restart button
restBtn.addEventListener('click', function (e) {
  this.blur();
  typedText.innerHTML = '';
  displayText();
  i = 0;
  j = 0;
  startedTyping = false;
  if (timeLeft === 0) switchTap();
  timeLeft = 60;
  clearInterval(interval);
  countdownElement.textContent = '01:00';
});

document.documentElement.addEventListener('keydown', function (e) {
  if (timeLeft === 0) return;
  currentWord = wordsElementsArr[i];
  // it's  - 2 and not - 1 bcz every word has one extra empty space
  let lastLetterIndex = currentWord.innerText.length - 2;

  // we need this default value for our adding letters logic bcz we are adding letters after the last letter and the first expression will always give the value of null when we type extra letter bcz there is no current letter with that id
  let currentLetter =
    currentWord.querySelector(`#a${j}`) ||
    currentWord.querySelector(`#a${lastLetterIndex}`);

  //the checking logic and adding letters and we are checking only for arabic characters and we are using for that the Arabic Unicode range
  if (e.key >= '\u0600' && e.key <= '\u06FF') {
    // starting the timer
    if (!startedTyping) {
      timer();
      startedTyping = true;
    }
    if (j > lastLetterIndex) {
      // if user types extra letter they should be added to the current word
      if (currentWord.querySelectorAll('.extra').length < 6) {
        currentLetter.insertAdjacentHTML(
          'afterend',
          `<span class = 'letter extra' id ='a${j}'>${e.key}</span>`
        );
        j++;
        // because adding new letter can move words
        updateLineFirstWords();
      }
    } else {
      //checking for letter correctness
      e.key === currentLetter.textContent
        ? currentLetter.classList.add('correct')
        : currentLetter.classList.add('wrong');
      j++;
    }
  }

  if (e.key === ' ' && isLetterTyped(currentWord.firstElementChild)) {
    // if user presses 'space' he should move to next word even if he didn't compleat the current one
    // this should only work if at least one letter is typed from the current word and of course if a letter has been typed it will have more than one class and that what we use in the condition above
    i++;
    j = 0;
    currentWord = wordsElementsArr[i];
  }

  if (e.key === 'Backspace') {
    // checks if user can go back to previous word and that has two condition one he is in the first letter and the previous word is not correct
    if (
      currentLetter.id === 'a0' &&
      isWordWrong(currentWord.previousElementSibling)
    ) {
      // this is for an edge case one a word has only one letter and you typed it after that you want to go back to previous word
      if (currentWord.innerText.length === 2 && isLetterTyped(currentLetter)) {
        colorRemove(currentLetter);
      } else {
        i--;
        currentWord = wordsElementsArr[i];
        j = Number(lastTypedLetter(currentWord).id[1]) + 1;
        // it's +1 bcz j is always bigger than the last typed letter with one so the typing logic can work and we did that to keep j consistent and to not introduce more complexity
      }
    } else if (currentLetter === currentWord.lastElementChild) {
      // bcz the currentLetter variable defaults to the last letter when j is bigger than the word length that created a specif case in our deleting logic so we needed to handle it separately
      // If the last letter has been typed, the currentLetter variable will default to it in the next typing iteration (unless space is pressed). We delete it normally, but if not, we need to delete the element before it because it's the last element that was typed.
      if (currentLetter.classList.contains('extra')) {
        currentLetter.remove();
      } else {
        isLetterTyped(currentLetter)
          ? colorRemove(currentLetter)
          : colorRemove(currentLetter.previousElementSibling);
      }
      j--;
    } else {
      colorRemove(currentLetter.previousElementSibling);
      if (j !== 0) j--;
    }
  }

  finishedLineRemove();

  // updating  Cursor Position
  // if no letter in the word is typed the cursor should be on the right side of the first letter
  cursorMove();
});

window.addEventListener('resize', function () {
  cursor.classList.add('hidden');
  setTimeout(() => {
    cursorMove();
    cursor.classList.remove('hidden');
    updateLineFirstWords();
    finishedLineRemove();
  }, 500);
});
