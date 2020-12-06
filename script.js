/* ---------------------------------------------------------------------
// https://www.coursera.org/learn/razrabotka-interfeysov-proyekt | 2018
// ------------------------------------------------------------------ */

(function(window, document, undefined) {
    'use strict';

    class Game {
        constructor() {
            this._cards = null;
            this._timer = null;
            this._popup = null;
            this._emoji = [
                '🐶', '🐱', '🐭', '🐹', '🐰', '🐻',
                '🐶', '🐱', '🐭', '🐹', '🐰', '🐻'
            ];
            this._counter = 0;
            this._isInitialize = false;
            this._isStarted = false;
            this._previousCard = null;
            this._timerInterval = null;
            this._timerSeconds = 60;

            this._initialize();
        }

        _initialize() {
            if (this._isInitialize) {
                return;
            }

            const cardsHtml = Array
                .from({
                    length: this._emoji.length
                })
                .map(() => {
                    return `
                        <div class="card">
                            <div class="card__rotating-container">
                                <div class="card__front-side"></div>
                                <div class="card__back-side"></div>
                            </div>
                        </div>`;
                })
                .join('');
            const gameHtml = `
                <div class="cards">
                    ${cardsHtml}
                </div>
                <div class="timer"></div>
                <div class="popup" hidden>
                    <div class="popup__window">
                        <div class="popup__title"></div>
                        <button class="popup__button" type="button" onclick="game.createNewGame();"></button>
                    </div>
                </div>`;
            const gameElement = document.createElement('div');

            gameElement.classList.add('game');
            gameElement.setAttribute('role', 'presentation');
            gameElement.innerHTML = gameHtml;
            gameElement.addEventListener('click', (event) => {
                if (event.target.parentNode.parentNode.classList.contains('card')) {
                    this._handle(event.target.parentNode.parentNode);
                }
            });

            document.body.appendChild(gameElement);

            this._cards = document.querySelectorAll('.card');
            this._timer = document.querySelector('.timer');
            this._popup = document.querySelector('.popup');

            this._isInitialize = true;

            this.createNewGame();
        }

        /**
         * @param {HTMLElement} element
         */
        _handle(element) {
            if (element.classList.contains('card_show')) {
                return;
            }

            if (!this._isStarted) {
                this._startTimer();
            }

            this._cards.forEach((card) => {
                if (card.classList.contains('card_error')) {
                    card.classList.remove('card_show', 'card_error');
                }
            });

            element.classList.add('card_show');

            if (this._previousCard) {
                if (this._previousCard.children[0].children[1].textContent === element.children[0].children[1].textContent) {
                    this._previousCard.classList.add('card_success');
                    element.classList.add('card_success');

                    this._counter++;
                } else {
                    this._previousCard.classList.add('card_error');
                    element.classList.add('card_error');
                }
                this._previousCard = null;
            } else {
                this._previousCard = element;
            }

            if (this._counter === this._emoji.length / 2) {
                this._stopTimer();
                this._showPopup({
                    titleText: 'Win',
                    buttonText: 'Play again'
                });
            }
        }

        _startTimer() {
            if (this._isStarted) {
                return;
            }

            this._timerInterval = setInterval(() => {
                if (this._timerSeconds > 10) {
                    this._timer.textContent = `00:${--this._timerSeconds}`;
                } else {
                    this._timer.textContent = `00:0${--this._timerSeconds}`;
                }

                if (this._timerSeconds === 0) {
                    this._stopTimer();
                    this._showPopup({
                        titleText: 'Lose',
                        buttonText: 'Try again'
                    });
                }
            }, 1000);

            this._isStarted = true;
        }

        _stopTimer() {
            if (!this._isStarted) {
                return;
            }

            clearInterval(this._timerInterval);

            this._isStarted = false;
            this._timerInterval = null;
        }

        _resetTimer() {
            this._stopTimer();

            this._timer.textContent = '01:00';
            this._timerSeconds = 60;
        }

        /**
         * @param {Object} settings
         * @param {string} settings.titleText
         * @param {string} settings.buttonText
         */
        _showPopup(settings) {
            this._popup.children[0].children[0].textContent = settings.titleText;
            this._popup.children[0].children[1].textContent = settings.buttonText;

            this._popup.removeAttribute('hidden');
        }

        _hidePopup() {
            this._popup.setAttribute('hidden', '');

            this._popup.children[0].children[0].textContent = '';
            this._popup.children[0].children[1].textContent = '';
        }

        createNewGame() {
            this._emoji = this._emoji.sort(() => {
                return Math.random() - .5;
            });

            this._cards.forEach((card, index) => {
                card.classList.remove('card_show', 'card_error', 'card_success');
                setTimeout(() => {
                    card.children[0].children[1].textContent = this._emoji[index];
                }, 400 / 2);
            });

            this._resetTimer();
            this._hidePopup();

            this._counter = 0;
            this._previousCard = null;
        }
    }

    window.game = new Game();
}(window, document));
