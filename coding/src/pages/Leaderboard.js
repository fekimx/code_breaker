import './leaderstyles.css';
import React from 'react';
import { useNavigate } from "react-router";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

const Leaderboard = () => {
  const history = useNavigate();
  const baseUrl = '';

const sendScore = async (formData) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const status = await response.json();
  return status;
};

  class SCORE {
    constructor(name, score) {
      this.name = name;
      this.score = score;
    }
  
    sendScores() {
      this.requestScores();
      this.scores.push({
        id: Date.now(),
        name: this.name,
        score: this.score,
      });
      this.storeScoreSessionStorage();
    }
  
    storeScoreSessionStorage() {
      sessionStorage.setItem('scores', JSON.stringify(this.scores));
    }
  
    requestScores() {
      this.scores = JSON.parse(sessionStorage.getItem('scores')) || [];
    }
  }

const createScoreRow = (score, index) => {
  const listRow = document.createElement('div');
  const nameHolder = document.createElement('p');
  const scoreHolder = document.createElement('p');
  const serialNo = document.createElement('span');
  const medalImage = document.createElement('img');
  const serialImageHolder = document.createElement('div');
  const nameScoreHolder = document.createElement('div');
  const imageHolder = document.createElement('div');
  const classLists = [
    'serial-number',
    'image-holder',
    'medal-image',
    'score-list-row',
    'score-list-name',
    'score-list-score',
    'wrapper-serial-image',
    'wrapper-name-score',
  ];

  [
    serialNo,
    imageHolder,
    medalImage,
    listRow,
    nameHolder,
    scoreHolder,
    serialImageHolder,
    nameScoreHolder,
  ].forEach((element, index) => {
    element.setAttribute('class', classLists[index]);
  });

  if (index === 0) {
    medalImage.src = gold;
    medalImage.classList.add('medal');
  } else if (index === 1) {
    medalImage.src = silver;
    medalImage.classList.add('medal');
  } else if (index === 2) {
    medalImage.src = bronze;
    medalImage.classList.add('medal');
  }

  serialNo.textContent = index + 1;
  nameHolder.textContent = score.user;
  scoreHolder.textContent = score.score;

  imageHolder.appendChild(medalImage);

  serialImageHolder.append(serialNo, imageHolder);
  nameScoreHolder.append(nameHolder, scoreHolder);
  listRow.append(serialImageHolder, nameScoreHolder);
  return listRow;
};

const sortScores = (scores) => {
  scores.sort((a, b) => (Number(a.score) < Number(b.score) ? 1 : -1));
  return scores;
};

const storeData = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(sortScores(value)));
};

const getData = (key) =>
  JSON.parse(sessionStorage.getItem(key)) || [];

const checkforTopThree = (value) => {
  const previous = JSON.parse(sessionStorage.getItem('top')) || [];
  const top = previous.some((val) => value >= Number(val));
  return top;
};

const topThreeScores = (scores) => {
  const topThree = [];
  scores.slice(0, 3).forEach((element) => {
    topThree.push(element.score);
  });

  storeData('top', topThree);
};

const renderPage = (scores) => {
  const leaderList = document.querySelector('.score-list-box');
  const error = document.querySelector('.fetch-error');
  leaderList.innerHTML = '';
  if (scores.length > 0) {
    scores.forEach((score, index) => {
      leaderList.appendChild(createScoreRow(score, index));
    });
    topThreeScores(scores);
    alternatBackground();
  } else {
    error.style.display = 'block';
    error.textContent = 'The List is Empty! Please Add More Scores.';
    leaderList.appendChild(error);
  }
};

  return (
  <div className="h-screen flex bg-gray-bg1">
          <NavHeader user="Student" title="" />
    <div id="canvas"></div>
      <h1 class="page-header">Leaderboard</h1>
      <div class="container2">
        <div class="score-list">
          <div class="title-box">
            <h2 class="sub-title">Competitors</h2>
          </div>
          <div class="score-list-box"></div>
          <p class="fetch-error"></p>
        </div>
      </div>
    <Footer/>  
  </div>
  );
};
  
export default Leaderboard;