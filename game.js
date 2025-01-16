const player = document.getElementById('player');
const game = document.getElementById('game');
let score = 0;
let isMovingLeft = false;
let isMovingRight = false;
let playerPosX = 50;
let playerPosY = 50;
const moveSpeed = 5;  // Скорость движения
const gravity = 0.5;  // Сила гравитации для сердечек

// Массив для всех сердечек
let hearts = [];

// Ссылка на элемент счета и WIN текста
const scoreDisplay = document.getElementById('score');
const winText = document.getElementById('winText');

// Функция обновления логики игры
function update() {
    // Обрабатываем движение персонажа влево/вправ
    if (isMovingRight) {
        playerPosX += moveSpeed;
        if (playerPosX > game.offsetWidth - 50) playerPosX = game.offsetWidth - 50; // Персонаж не выходит за правую границу
    }

    if (isMovingLeft) {
        playerPosX -= moveSpeed;
        if (playerPosX < 0) playerPosX = 0; // Персонаж не выходит за левую границу
    }

    // Обновляем позицию игрока на экране
    player.style.left = playerPosX + 'px';
    player.style.bottom = playerPosY + 'px';

    // Двигаем сердечки
    hearts.forEach((heart, index) => {
        const heartRect = heart.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Двигаем сердечко вниз с гравитацией
        let currentTop = parseFloat(heart.style.top);
        heart.style.top = (currentTop + gravity) + 'px';  // Падаем вниз

        // Проверка на сбор сердечек
        if (playerRect.left < heartRect.right && playerRect.right > heartRect.left &&
            playerRect.top < heartRect.bottom && playerRect.bottom > heartRect.top) {
            heart.style.display = 'none';  // Прячем сердце после того, как оно собрано
            hearts.splice(index, 1);  // Убираем сердце из массива
            score += 1;  // Увеличиваем счет
            scoreDisplay.textContent = 'Score: ' + score;  // Обновляем счет

            // Проверка для награды каждые 50 сердец
            if (score % 50 === 0) {
                generateFirework();  // Генерация салюта
                showWinText();  // Показать надпись "WIN"
            }
        }

        // Если сердечко упало за пределы экрана, убираем его
        if (heartRect.top > game.offsetHeight) {
            heart.style.display = 'none';
            hearts.splice(index, 1);
        }
    });
}

// Функция для создания нового сердечка
function spawnHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * (game.offsetWidth - 30) + 'px';  // Позиция по горизонтали
    heart.style.top = '-30px';  // Начальная позиция сверху
    game.appendChild(heart);
    hearts.push(heart);
}

// Функция для генерации салюта
function generateFirework() {
	const numFireworks = 100;  // Увеличиваем количество частиц для большего эффекта
	for (let i = 0; i < numFireworks; i++) {
			const firework = document.createElement('div');
			firework.classList.add('firework');
			firework.style.left = (Math.random() * game.offsetWidth) + 'px';
			firework.style.bottom = '50px';  // Начальная позиция около земли
			firework.style.setProperty('--direction', Math.random() > 0.5 ? 1 : -1);  // Направление разлета

			game.appendChild(firework);

			// Убираем частицы салюта через 2 секунды после завершения анимации
			setTimeout(() => {
					firework.remove();
			}, 2000);
	}
}

// Функция для отображения текста "WIN"
function showWinText() {
	winText.style.display = 'block';  // Показываем надпись
	setTimeout(() => {
			winText.style.display = 'none';  // Скрываем ее после анимации
	}, 3000);
}

// Обработчик нажатий клавиш
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        isMovingRight = true;  // Персонаж начинает двигаться вправо
    }

    if (e.code === 'ArrowLeft') {
        isMovingLeft = true;  // Персонаж начинает двигаться влево
    }
});

// Обработчик отпускания клавиш
document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') {
        isMovingRight = false;  // Персонаж останавливается
    }

    if (e.code === 'ArrowLeft') {
        isMovingLeft = false;  // Персонаж останавливается
    }
});

// Главный цикл игры
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);  // Повторяем цикл игры
}

// Запуск цикла игры
gameLoop();

// Спавн новых сердечек каждую секунду
setInterval(spawnHeart, 1000);  // Сердечки падают каждую секунду

// Добавление сенсорных событий
let touchStartX = null;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchmove', (e) => {
    const touchEndX = e.touches[0].clientX;

    if (touchStartX && touchEndX) {
        if (touchEndX > touchStartX + 10) {
            isMovingRight = true;
            isMovingLeft = false;
        } else if (touchEndX < touchStartX - 10) {
            isMovingLeft = true;
            isMovingRight = false;
        }
    }
});

document.addEventListener('touchend', () => {
    isMovingRight = false;
    isMovingLeft = false;
});
