document.getElementById('examForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    // Получаем значения из формы
    const math = parseInt(document.getElementById('math').value);
    const russian = parseInt(document.getElementById('russian').value);
    const informatics = parseInt(document.getElementById('informatics').value);
    const physics = parseInt(document.getElementById('physics').value);

    // Минимальные баллы
    const minScores = {
        math: 40,
        russian: 40,
        informatics: 44,
        physics: 39
    };

    // Проверка на минимальные значения
    if (math < minScores.math || russian < minScores.russian || 
        (informatics < minScores.informatics && physics < minScores.physics)) {
        document.getElementById('result').innerText = "Ваших баллов недостаточно для поступления :(";
        return;
    }

    // Вычисление суммы баллов
    const totalScore = math + russian + Math.max(informatics, physics);

    // Загрузка JSON данных
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            let availableDirections = [];
            let budgetMax = -1;
            let paidMax = -1;

            // Сравнение с проходными баллами
            data.forEach(item => {
                if (totalScore >= item["проходной_балл"].бюджет) {
                    availableDirections.push(item);
                    budgetMax = Math.max(budgetMax, item["проходной_балл"].бюджет);
                }
            });

            if (availableDirections.length < 1) {
                data.forEach(item => {
                    if (totalScore >= item["проходной_балл"].платное) {
                        availableDirections.push(item);
                        paidMax = Math.max(paidMax, item["проходной_балл"].платное);
                    }
                });
            }

            // Проверка доступных направлений
            if (availableDirections.length < 1) {
                document.getElementById('result').innerText = "Нет направлений, доступных вам :(";
            } else {
                const bestItem = budgetMax >= paidMax ?
                    availableDirections.find(item => item["проходной_балл"].бюджет === budgetMax) :
                    availableDirections.find(item => item["проходной_балл"].платное === paidMax);

                // Создаем объект bestDirection с наименованием и кодом
                const bestDirection = {
                    name: bestItem.наименование,
                    code: bestItem.код
                };

                document.getElementById('result').innerText = `Доступное направление: ${bestDirection.code} ${bestDirection.name}`;
            }
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});
